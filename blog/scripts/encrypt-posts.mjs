#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content', 'posts');
const PUBLIC_DIR = join(ROOT, 'public', 'posts');
const ENV_LOCAL = join(ROOT, '.env.local');
const ITERATIONS = 100000;

const TEMPLATE_RE = /<template id="encrypted-region">([\s\S]*?)<\/template>/;

function loadEnvLocal() {
  if (!existsSync(ENV_LOCAL)) return;
  const text = readFileSync(ENV_LOCAL, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    let v = trimmed.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

function envNameFor(slug) {
  return 'POST_PW_' + slug.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

function findProtectedPosts() {
  const posts = [];
  if (!existsSync(CONTENT_DIR)) return posts;
  for (const name of readdirSync(CONTENT_DIR)) {
    if (!name.endsWith('.md')) continue;
    const fullPath = join(CONTENT_DIR, name);
    const raw = readFileSync(fullPath, 'utf8');
    const { data } = matter(raw);
    if (!data.password) continue;
    const slug = data.slug || name.replace(/\.md$/, '');
    const envName = envNameFor(slug);
    const password = process.env[envName];
    if (!password) {
      console.error(`  ! ${slug}: 缺少环境变量 ${envName}（front matter 标记了 password 但找不到对应的密码）`);
      posts.push({ file: name, slug, envName, password: null });
      continue;
    }
    posts.push({ file: name, slug, envName, password });
  }
  return posts;
}

function encryptHtml(plaintext, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ctParts = [cipher.update(plaintext, 'utf8'), cipher.final()];
  const tag = cipher.getAuthTag();
  const ct = Buffer.concat([...ctParts, tag]);
  const payload = {
    v: 1,
    iterations: ITERATIONS,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    ct: ct.toString('base64'),
  };
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
}

function processPost(post) {
  if (!post.password) return false;
  const htmlPath = join(PUBLIC_DIR, post.slug, 'index.html');
  if (!existsSync(htmlPath)) {
    console.error(`  ! ${post.slug}: ${htmlPath} 不存在，跳过（先跑 hugo？）`);
    return false;
  }
  let html = readFileSync(htmlPath, 'utf8');
  const match = TEMPLATE_RE.exec(html);
  if (!match) {
    console.error(`  ! ${post.slug}: 找不到 <template id="encrypted-region">，跳过`);
    return false;
  }
  const protectedHtml = match[1];
  const placeholderAttr = 'data-encrypted="ENCRYPT_PLACEHOLDER"';
  if (!html.includes(placeholderAttr)) {
    console.error(`  ! ${post.slug}: 找不到 ${placeholderAttr}，跳过`);
    return false;
  }

  const payload = encryptHtml(protectedHtml, post.password);
  const result = html
    .replace(TEMPLATE_RE, '')
    .replace(placeholderAttr, `data-encrypted="${payload}"`);
  writeFileSync(htmlPath, result, 'utf8');
  const sizeBefore = html.length;
  const sizeAfter = result.length;
  console.log(`  ✓ ${post.slug}: ${sizeBefore.toLocaleString()} → ${sizeAfter.toLocaleString()} bytes (-${(sizeBefore - sizeAfter).toLocaleString()})`);
  return true;
}

function main() {
  loadEnvLocal();
  const posts = findProtectedPosts();
  if (posts.length === 0) {
    console.log('未发现需要加密的文章。');
    return;
  }
  console.log(`发现 ${posts.length} 篇受密码保护的文章：`);
  let ok = 0;
  for (const post of posts) {
    if (processPost(post)) ok++;
  }
  console.log(`\n完成：${ok}/${posts.length} 加密成功。`);
  if (ok < posts.length) process.exit(1);
}

main();
