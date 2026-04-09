---
title: "用 AI 搭建自己的 Blog：从买域名到上线"
date: 2026-04-06T10:00:00+08:00
draft: false
tags: ["AI", "建站", "Hugo", "Cloudflare", "教程"]
description: "从零开始，用 Hugo + GitHub + Cloudflare Pages 搭建个人博客的完整流程。技术门槛极低，总成本只有域名费。"
---

这个博客本身就是用这套方案搭起来的。从买域名到文章上线，全程大约两个小时，其中大半时间花在等 DNS 生效上。

**技术栈：**

| 组件 | 选择 | 理由 |
|---|---|---|
| 静态网站生成器 | Hugo | 构建极快，文章用 Markdown 写 |
| 主题 | PaperMod | 简洁、支持暗色模式、搜索开箱即用 |
| 代码托管 | GitHub | 免费，和 Cloudflare 集成无缝 |
| 部署 & CDN | Cloudflare Pages | 推送即自动部署，全球 CDN，免费 SSL |
| 域名管理 | Cloudflare DNS | 和 Pages 同一控制台，配置最省事 |

**总成本：域名年费之外，全部免费。**

---

## 一、准备工作

### 注册 GitHub 账号

前往 [github.com](https://github.com) 注册，然后创建一个新仓库：

1. 右上角 **+** → **New repository**
2. 仓库名随意，例如 `blog`
3. Public / Private 均可
4. 不要勾选 "Add a README file"，保持仓库为空
5. 点击 **Create repository**

记下仓库地址，格式 `https://github.com/用户名/仓库名.git`，后面会用到。

### 注册 Cloudflare 账号

前往 [cloudflare.com](https://cloudflare.com) 注册，免费。注册后暂时不需要做任何操作。

### 购买域名

推荐直接在 **Cloudflare Registrar** 购买（登录后进 **Domain Registration** → **Register Domains**）。原因很实际：Cloudflare 以批发价卖域名，不加价，域名和 DNS 在同一个平台，后续绑定 Pages 时省去一步。

选域名的原则：
- 后缀首选 `.com`，不纠结就选它
- 名字尽量短，6–10 个字符最理想
- 好记，不容易拼错
- 想不出来就告诉 AI 你的博客定位，让它出 20 个候选

购买后 Cloudflare 会自动把域名的 Nameserver 设好，不需要额外操作。

### 本地环境

确认以下工具已安装：

**Homebrew**（没有的话先安装）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Git**（Mac 自带，验证一下）：

```bash
git --version
```

配置 Git 用户信息（只需做一次）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

---

## 二、本地搭建 Hugo 博客

### 安装 Hugo

```bash
brew install hugo
```

验证安装，注意要有 `extended` 字样，部分主题依赖它编译 SCSS：

```bash
hugo version
# hugo v0.140.0+extended darwin/arm64 ...
```

### 创建项目

```bash
hugo new site my-blog
cd my-blog
git init
```

### 安装 PaperMod 主题

```bash
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

### 配置 hugo.toml

用编辑器打开 `hugo.toml`，替换成以下内容：

```toml
baseURL = "https://你的域名.com/"
languageCode = "zh-cn"
title = "博客名称"
theme = "PaperMod"

[outputs]
  home = ["HTML", "RSS", "JSON"]

[params]
  env = "production"
  title = "博客名称"
  description = "博客简介"
  author = "你的名字"
  ShowReadingTime = true
  ShowShareButtons = false
  ShowPostNavLinks = true
  ShowBreadCrumbs = true
  ShowCodeCopyButtons = true
  ShowToc = true
  defaultTheme = "auto"
  favicon = "/favicon.png"

  [params.label]
    text = "博客名称"
    icon = "/avatar.png"
    iconHeight = 30

  [params.homeInfoParams]
    Title = ""
    Content = ""

  [[params.socialIcons]]
    name = "x"
    url = "https://x.com/你的账号"

[menu]
  [[menu.main]]
    name = "文章"
    url = "/posts/"
    weight = 1
  [[menu.main]]
    name = "标签"
    url = "/tags/"
    weight = 2
  [[menu.main]]
    name = "搜索"
    url = "/search/"
    weight = 3
  [[menu.main]]
    name = "归档"
    url = "/archives/"
    weight = 4
```

`baseURL` 填你买的域名；`env = "production"` 控制某些功能只在正式环境启用，不要删。

### 创建搜索和归档页

```bash
hugo new search.md
hugo new archives.md
```

编辑 `content/search.md`：

```markdown
---
title: "搜索"
layout: "search"
summary: "搜索"
placeholder: "搜索文章..."
---
```

编辑 `content/archives.md`：

```markdown
---
title: "归档"
layout: "archives"
url: "/archives/"
summary: "archives"
---
```

### 放置头像和 favicon

把头像图片命名为 `avatar.png`，favicon 命名为 `favicon.png`，放到 `static/` 目录。

### 写第一篇文章

```bash
hugo new posts/hello-world.md
```

打开生成的文件，把 `draft: true` 改为 `false`，然后在下面写内容：

```markdown
---
title: "你好，世界"
date: 2026-04-06T10:00:00+08:00
draft: false
tags: ["随笔"]
description: "第一篇文章。"
---

正文内容...
```

### 本地预览

```bash
hugo server -D
```

打开 `http://localhost:1313` 查看效果。Hugo 支持热重载，修改文件保存后浏览器自动刷新。

**常见问题：**

> 文章列表是空的 → 检查 `draft` 是否为 `false`，或者运行加了 `-D` 参数

> 主题样式没加载 → 运行 `git submodule update --init --recursive`

效果没问题后，在项目根目录创建 `.gitignore`：

```
public/
.hugo_build.lock
```

---

## 三、部署到 Cloudflare Pages

### 推送到 GitHub

关联远程仓库：

```bash
git remote add origin https://github.com/用户名/仓库名.git
```

提交并推送：

```bash
git add .
git commit -m "初始化博客"
git push -u origin main
```

**如果提示需要登录：** GitHub 已不支持密码推送，推荐配置 SSH key：

```bash
# 生成 key
ssh-keygen -t ed25519 -C "你的邮箱"

# 复制公钥
cat ~/.ssh/id_ed25519.pub
```

把输出内容粘贴到 GitHub → Settings → SSH and GPG keys → New SSH key，然后把远程地址改成 SSH 格式：

```bash
git remote set-url origin git@github.com:用户名/仓库名.git
```

### 连接 Cloudflare Pages

登录 Cloudflare Dashboard → **Workers & Pages** → **Pages** → **Create a project** → **Connect to Git**。

授权 GitHub，选择博客仓库，点击 **Begin setup**。

构建配置填写如下：

| 字段 | 值 |
|---|---|
| Production branch | `main` |
| Framework preset | **Hugo** |
| Build command | `hugo --minify` |
| Build output directory | `public` |

展开 **Environment variables**，添加：

| 变量名 | 值 |
|---|---|
| `HUGO_VERSION` | 你本地的 Hugo 版本号（如 `0.140.0`） |

这个变量必填，Cloudflare 默认的 Hugo 版本很旧，不指定会构建失败。

点击 **Save and Deploy**，等待 1–2 分钟。构建成功后会得到一个 `项目名.pages.dev` 的临时访问地址。

**构建失败常见原因：**

> `Error: module "PaperMod" not found` → submodule 没提交，运行 `git add .gitmodules themes/PaperMod && git commit -m "添加主题" && git push`

> 其他报错 → 复制构建日志里的错误信息，粘贴给 AI，通常一步解决

### 绑定自定义域名

在 Pages 项目里进入 **Custom domains** → **Set up a custom domain**，输入你的域名（如 `blog.你的域名.com`）。

因为域名托管在 Cloudflare，它会自动识别并帮你添加 CNAME 记录。点击 **Activate domain** 确认，SSL 证书也会自动签发。

DNS 通常几分钟内生效。如果等了 10 分钟还不行，换个浏览器或无痕模式试试（排除本地缓存）。

---

## 四、日常更新

博客上线后，每次写新文章只需要：

```bash
git add .
git commit -m "发布：文章标题"
git push
```

Push 之后 Cloudflare 自动重新构建，通常 1 分钟内生效。**写完推送，其他全自动。**

---

技术门槛到这里就消失了。博客能不能持续下去，取决于你有没有东西想说——这是 AI 帮不了的部分。
