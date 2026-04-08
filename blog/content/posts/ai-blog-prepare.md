---
title: "用 AI 搭建 Blog（一）：准备篇"
date: 2026-04-06T10:30:00+08:00
draft: false
tags: ["建站", "域名", "Cloudflare", "教程"]
description: "建站第一步：怎么选域名、在哪买、需要注册哪些账号。"
---

> 系列文章：[系列导读](/posts/ai-build-blog/) · **准备篇** · [开发篇](/posts/ai-blog-dev/) · [部署篇](/posts/ai-blog-deploy/)

这篇解决三件事：**域名怎么选、在哪买、需要注册哪些账号**。

---

## 1. 注册 GitHub 账号

GitHub 用来托管博客的源代码，每次你推送更新，Cloudflare 会自动拉取并重新构建。

前往 [github.com](https://github.com) 注册，用邮箱注册即可，全程免费。

注册完成后，创建一个新的仓库（Repository）：

1. 点击右上角 **+** → **New repository**
2. 仓库名随意，例如 `blog` 或 `my-blog`
3. 选择 **Private**（私有）或 **Public** 均可，Cloudflare Pages 都能访问
4. 不要勾选 "Add a README file"，保持仓库为空
5. 点击 **Create repository**

记下仓库的 HTTPS 地址，格式是 `https://github.com/你的用户名/仓库名.git`，后面会用到。

---

## 2. 注册 Cloudflare 账号

Cloudflare 承担两个角色：**域名 DNS 管理** 和 **Pages 静态托管**。两者在同一个控制台，配置最方便。

前往 [cloudflare.com](https://cloudflare.com) 注册，同样免费。

注册后不需要做任何设置，域名买好之后再回来配置。

---

## 3. 购买域名

### 在哪买

推荐直接在 **Cloudflare Registrar** 购买（登录后进入 **Domain Registration** → **Register Domains**）。

原因很实际：
- Cloudflare 以批发价卖域名，不加价，没有"第一年特价第二年暴涨"的套路
- 域名和 DNS 在同一个平台，不需要手动修改 Nameserver
- 后续绑定到 Cloudflare Pages 时，CNAME/A 记录自动填好

### 怎么选域名

几个实用原则：

**后缀选 `.com`**。不是说其他后缀不行，但 `.com` 最通用，别人看到也不会困惑。如果 `.com` 被注册了，`.blog`、`.dev`、`.io` 也都不错。

**名字要短**。博客域名是要反复输入和分享的，6–10 个字符最理想。

**好记，不容易拼错**。避免连字符、数字、容易混淆的字母组合（`rn` 看起来像 `m`）。

**用 AI 帮你想**。告诉 AI 你博客的定位和风格，让它给你出 20 个候选域名，然后去搜可用性。比自己想高效得多。

### 购买流程

1. 在 Cloudflare Registrar 搜索你想要的域名
2. 确认价格（大多数 `.com` 在 $9–$12/年）
3. 添加支付方式（信用卡或 PayPal）
4. 购买完成后，域名会出现在你的 **Domains** 列表里

购买完成后，Cloudflare 会自动把该域名的 Nameserver 设为 Cloudflare 的，不需要额外操作。

---

## 4. 本地环境确认

在进入开发篇之前，确认你的 Mac 上已经有以下工具：

**Homebrew**（Mac 的包管理器，用来安装 Hugo）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后运行 `brew --version`，能看到版本号就说明成功了。

**Git**（代码版本管理，用来推送到 GitHub）：

```bash
git --version
```

Mac 自带 Git，一般不需要额外安装。如果提示未安装，运行：

```bash
brew install git
```

**配置 Git 用户信息**（只需要做一次）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

邮箱和 GitHub 注册时用的一致。

---

## 完成检查

准备篇结束后，你应该有：

- [x] GitHub 账号，空仓库已创建
- [x] Cloudflare 账号
- [x] 一个域名（在 Cloudflare 购买）
- [x] 本地安装了 Homebrew 和 Git

全部就位后，进入 **[开发篇](/posts/ai-blog-dev/)**。
