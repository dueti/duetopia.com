(function () {
  'use strict';

  const gate = document.getElementById('pw-gate');
  const payloadEl = document.getElementById('encrypted-payload');
  const targetEl = document.getElementById('decrypted-content');
  const input = document.getElementById('pw-input');
  const button = document.getElementById('pw-submit');
  const errorEl = document.getElementById('pw-error');

  if (!gate || !payloadEl || !targetEl) return;

  const slug = gate.dataset.slug || location.pathname;
  const cacheKey = 'pw-unlocked-' + slug;
  const raw = payloadEl.dataset.encrypted;

  if (!raw || raw === 'ENCRYPT_PLACEHOLDER') {
    showError('页面未加密（构建时跳过了加密步骤）。');
    return;
  }

  let payload;
  try {
    payload = JSON.parse(atob(raw));
  } catch (e) {
    showError('加密数据格式错误。');
    return;
  }

  function b64ToBytes(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async function deriveKey(password, saltBytes) {
    const enc = new TextEncoder();
    const keyMat = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: saltBytes, iterations: payload.iterations || 100000, hash: 'SHA-256' },
      keyMat,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  }

  async function decryptWith(password) {
    const salt = b64ToBytes(payload.salt);
    const iv = b64ToBytes(payload.iv);
    const ct = b64ToBytes(payload.ct);
    const key = await deriveKey(password, salt);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ct);
    return new TextDecoder().decode(plain);
  }

  function unlock(html) {
    targetEl.innerHTML = html;
    targetEl.hidden = false;
    payloadEl.remove();
    gate.remove();
    try { sessionStorage.setItem(cacheKey, html); } catch (e) {}
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  async function attempt() {
    const pw = input.value;
    if (!pw) return;
    errorEl.hidden = true;
    button.disabled = true;
    try {
      const html = await decryptWith(pw);
      unlock(html);
    } catch (e) {
      showError('密码错误，请重试。');
      input.select();
    } finally {
      button.disabled = false;
    }
  }

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      unlock(cached);
      return;
    }
  } catch (e) {}

  button.addEventListener('click', attempt);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') attempt();
  });
})();
