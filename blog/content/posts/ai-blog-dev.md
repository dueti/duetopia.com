---
title: "用 AI 搭建 Blog（二）：本地开发篇"
date: 2026-04-06T11:00:00+08:00
draft: false
tags: ["建站", "Hugo", "PaperMod", "教程"]
description: "安装 Hugo、配置 PaperMod 主题、写第一篇文章，在本地把博客跑起来。"
---

> 系列文章：[系列导读](/posts/ai-build-blog/) · [准备篇](/posts/ai-blog-prepare/) · **开发篇** · [部署篇](/posts/ai-blog-deploy/)

这篇的目标是：**在你的电脑上把博客跑起来**，能在浏览器里看到效果。

---

## 1. 安装 Hugo

Hugo 是这套方案的核心，负责把你的 Markdown 文章转成静态 HTML。

```bash
brew install hugo
```

安装完成后验证：

```bash
hugo version
```

输出类似 `hugo v0.140.0+extended darwin/arm64` 就说明成功了。注意要有 `extended` 字样，部分主题依赖它编译 SCSS。如果没有，运行：

```bash
brew install hugo --formula
```

或者直接：

```bash
brew reinstall hugo
```

---

## 2. 创建 Hugo 项目

选一个你想放博客文件的目录，然后运行：

```bash
hugo new site my-blog
cd my-blog
```

Hugo 会创建如下结构：

```
my-blog/
├── archetypes/       # 文章模板
├── assets/           # 自定义 CSS/JS
├── content/          # 文章内容（你主要在这里工作）
├── layouts/          # 自定义模板
├── static/           # 静态资源（图片、favicon 等）
├── themes/           # 主题
└── hugo.toml         # 配置文件
```

初始化 Git 仓库：

```bash
git init
```

---

## 3. 安装 PaperMod 主题

把 PaperMod 作为 Git submodule 引入，这样后续主题更新方便：

```bash
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

这条命令会把 PaperMod 克隆到 `themes/PaperMod` 目录，下载大约需要几十秒。

---

## 4. 配置 hugo.toml

用你喜欢的编辑器打开 `hugo.toml`，替换成下面的内容（根据自己的信息修改）：

```toml
baseURL = "https://你的域名.com/"
languageCode = "zh-cn"
title = "你的博客名称"
theme = "PaperMod"

[outputs]
  home = ["HTML", "RSS", "JSON"]

[params]
  env = "production"
  title = "你的博客名称"
  description = "博客简介"
  author = "你的名字"
  ShowReadingTime = true
  ShowShareButtons = false
  ShowPostNavLinks = true
  ShowBreadCrumbs = true
  ShowCodeCopyButtons = true
  ShowToc = true
  defaultTheme = "auto"       # 跟随系统深色/浅色模式
  favicon = "/favicon.png"

  [params.label]
    text = "你的博客名称"
    icon = "/avatar.png"      # 导航栏左侧头像，放到 static/ 目录
    iconHeight = 30

  [params.homeInfoParams]
    Title = ""
    Content = ""

  [[params.socialIcons]]
    name = "x"                # X / Twitter 图标
    url = "https://x.com/你的账号"

  [[params.socialIcons]]
    name = "github"
    url = "https://github.com/你的账号"

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

**几个需要注意的地方：**

- `baseURL` 填你买的域名，格式带 `https://` 和末尾 `/`
- `env = "production"` 这行很重要，控制某些功能（比如评论）只在生产环境启用
- `defaultTheme = "auto"` 表示跟随系统，用户也可以手动切换

---

## 5. 创建必要的页面

PaperMod 的搜索和归档页面需要手动创建内容文件：

```bash
# 搜索页
hugo new search.md
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

```bash
# 归档页
hugo new archives.md
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

---

## 6. 添加 favicon 和头像

把你的头像图片命名为 `avatar.png`，favicon 命名为 `favicon.png`，放到 `static/` 目录。

图片没有的话，可以先用任意一张正方形图片代替，后面再换。

---

## 7. 写第一篇文章

Hugo 的文章放在 `content/posts/` 目录。新建一篇文章：

```bash
hugo new posts/hello-world.md
```

Hugo 会根据 `archetypes/default.md` 模板生成文件，打开它：

```markdown
---
title: "Hello World"
date: 2026-04-06T10:00:00+08:00
draft: true
---
```

修改 `draft: true` 为 `draft: false`，然后在下面写内容：

```markdown
---
title: "你好，世界"
date: 2026-04-06T10:00:00+08:00
draft: false
tags: ["随笔"]
description: "博客的第一篇文章。"
---

这是第一篇文章。

## 为什么开始写博客

...
```

文章用标准 Markdown 语法写，Hugo 会自动处理标题层级、代码块、图片等。

**一些常用的 front matter 字段：**

| 字段 | 说明 |
|---|---|
| `title` | 文章标题 |
| `date` | 发布时间，决定排序 |
| `draft` | `true` 为草稿，不会被构建 |
| `tags` | 标签，支持多个 |
| `description` | 摘要，显示在文章列表和 SEO |
| `cover.image` | 封面图路径 |

---

## 8. 本地预览

```bash
hugo server -D
```

`-D` 参数表示同时显示草稿文章。在浏览器打开 `http://localhost:1313`，就能看到博客了。

Hugo 支持**热重载**：你修改文章或配置，保存后浏览器会自动刷新，不需要手动重启服务。

**几个常见问题：**

> **文章列表是空的**

确认文章的 `draft` 是 `false`，或者运行时加了 `-D` 参数。

> **主题样式没有加载**

确认 `hugo.toml` 里 `theme = "PaperMod"` 拼写正确，且 `themes/PaperMod` 目录不为空。如果 submodule 没有正确克隆，运行：

```bash
git submodule update --init --recursive
```

> **中文乱码**

检查文件编码是否为 UTF-8。

---

## 9. 项目结构整理

本地跑通之后，在项目根目录创建 `.gitignore` 文件：

```
public/
.hugo_build.lock
```

`public/` 是 Hugo 本地构建的输出目录，不需要提交到 Git——Cloudflare Pages 会在服务器端自己构建。

---

## 完成检查

开发篇结束后，你应该有：

- [x] 本地 Hugo 项目，能在 `localhost:1313` 正常预览
- [x] 至少一篇非草稿文章
- [x] `.gitignore` 已配置

下一步：把代码推送到 GitHub，再连接到 Cloudflare Pages——进入 **[部署篇](/posts/ai-blog-deploy/)**。
