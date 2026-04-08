---
title: "用 AI 搭建 Blog（三）：部署上线篇"
date: 2026-04-06T12:00:00+08:00
draft: false
tags: ["建站", "Cloudflare", "GitHub", "教程", "部署"]
description: "把本地博客推送到 GitHub，连接 Cloudflare Pages，绑定自定义域名，全程上线。"
---

> 系列文章：[系列导读](/posts/ai-build-blog/) · [准备篇](/posts/ai-blog-prepare/) · [开发篇](/posts/ai-blog-dev/) · **部署篇**

这是系列最后一篇。完成之后，你的博客就会公开在网上，通过你的域名可以直接访问。

---

## 1. 推送代码到 GitHub

在 [准备篇](/posts/ai-blog-prepare/) 里你已经在 GitHub 创建了一个空仓库，现在把本地代码推送上去。

进入你的 Hugo 项目目录，把远程仓库关联进来：

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

把所有文件添加到暂存区并提交：

```bash
git add .
git commit -m "初始化博客"
```

推送到 GitHub：

```bash
git push -u origin main
```

如果你的默认分支是 `master` 而不是 `main`，命令改成：

```bash
git push -u origin master
```

推送成功后，去 GitHub 刷新仓库页面，应该能看到所有文件已经上传。

**如果提示需要登录：**

GitHub 已经不支持用密码推送，需要用 Personal Access Token（PAT）。去 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)，生成一个勾选了 `repo` 权限的 token，用这个 token 替代密码输入。

或者更推荐的方式，配置 SSH key：

```bash
# 生成 SSH key
ssh-keygen -t ed25519 -C "你的邮箱@example.com"

# 复制公钥
cat ~/.ssh/id_ed25519.pub
```

把输出的公钥内容复制，粘贴到 GitHub → Settings → SSH and GPG keys → New SSH key。

然后把远程地址改成 SSH 格式：

```bash
git remote set-url origin git@github.com:你的用户名/你的仓库名.git
```

---

## 2. 连接 Cloudflare Pages

登录 [Cloudflare Dashboard](https://dash.cloudflare.com)，进入 **Workers & Pages** → **Pages** → **Create a project** → **Connect to Git**。

**授权 GitHub：**

点击 "Connect GitHub"，会跳转到 GitHub 授权页，选择 "Only select repositories"，勾选你的博客仓库，点击授权。

**选择仓库：**

回到 Cloudflare，选择刚才授权的仓库，点击 **Begin setup**。

**配置构建参数：**

这是最关键的一步，填写如下：

| 字段 | 值 |
|---|---|
| Project name | 随意，会成为默认域名的前缀 |
| Production branch | `main`（或 `master`，和你 GitHub 一致） |
| Framework preset | 选择 **Hugo** |
| Build command | `hugo --minify` |
| Build output directory | `public` |

展开 **Environment variables**，添加一个变量：

| 变量名 | 值 |
|---|---|
| `HUGO_VERSION` | `0.140.0`（或更新的版本） |

这个变量是必须的。Cloudflare 默认用的 Hugo 版本很旧，不指定的话可能构建失败。查看当前最新 Hugo 版本：

```bash
hugo version
```

把你本地的版本号填进去，保持一致。

点击 **Save and Deploy**，Cloudflare 会开始第一次构建，通常需要 1–2 分钟。

**查看构建日志：**

进入你的 Pages 项目 → **Deployments** 页面，点击最新那条记录，能看到实时构建日志。如果构建失败，日志里会有具体的错误信息——复制粘贴给 AI，通常能快速定位问题。

**常见构建错误：**

> `Error: module "PaperMod" not found`

submodule 没有被正确提交到 Git。检查根目录有没有 `.gitmodules` 文件，如果有，重新提交：

```bash
git add .gitmodules themes/PaperMod
git commit -m "添加 PaperMod submodule"
git push
```

> `Error: HUGO_VERSION not set`

环境变量没填，按上面说的补上。

> `Template for shortcode "xxx" not found`

文章里用了主题不支持的 shortcode，检查文章内容。

构建成功后，Cloudflare 会给你分配一个临时域名，格式是 `项目名.pages.dev`，可以先用这个访问确认效果。

---

## 3. 绑定自定义域名

在 Cloudflare Pages 项目里，进入 **Custom domains** → **Set up a custom domain**。

输入你的域名（如 `blog.你的域名.com`），点击 **Continue**。

因为域名本身就托管在 Cloudflare，它会自动识别并提示帮你添加 DNS 记录。点击 **Activate domain** 确认即可。

Cloudflare 会自动添加一条 CNAME 记录，把你的子域名指向 Pages 的地址，并自动签发 SSL 证书。

**关于子域名的选择：**

- 用 `blog.你的域名.com` 是最常见的方式
- 也可以直接用根域名 `你的域名.com`，Cloudflare 支持 CNAME Flattening，根域名也能指向 Pages

**DNS 生效时间：**

Cloudflare DNS 通常几分钟内生效。如果等了 10 分钟还不行，检查 DNS 记录是否已经添加（在域名的 DNS 设置里看），以及浏览器是否在用缓存（换个浏览器或无痕模式试试）。

---

## 4. 后续更新流程

博客上线后，每次写新文章或修改内容，只需要：

```bash
# 写完文章，保存后
git add .
git commit -m "发布新文章：文章标题"
git push
```

Push 之后，Cloudflare Pages 会自动触发重新构建，通常 1 分钟内生效。不需要登录任何控制台，不需要手动操作。

这就是静态托管最爽的地方：**写完推送，其他全自动**。

---

## 5. 可选：配置预览部署

Cloudflare Pages 默认会对每个 Pull Request 或非主分支的推送生成一个预览链接，格式是 `分支名.项目名.pages.dev`。

这个功能对独自维护博客来说用处不大，但如果你喜欢在正式发布前看效果，可以创建一个 `draft` 分支，文章写到一半推上去，得到预览链接查看效果，满意后再合并到主分支发布。

---

## 完成

到这里，整个系列就结束了。你现在有了：

- 一个基于 Hugo + PaperMod 的静态博客
- 托管在 GitHub 的源代码
- 通过 Cloudflare Pages 自动部署
- 绑定了自己域名的独立网站，带 SSL，全球 CDN

剩下的事只有一件：**持续写**。

技术门槛已经消失了，博客能不能持续下去，取决于你有没有东西想说，以及有没有养成写作的习惯。这是 AI 帮不了你的部分。

---

*有问题可以发推联系我：[@Duetopid](https://x.com/Duetopid)*
