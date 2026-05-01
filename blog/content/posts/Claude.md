---
title: "从 0 到 1 拥有 Claude（2026 版）"
date: 2026-05-01
draft: false
slug: "Claude"
tags: ["Claude", "教程"]
password: true
searchHidden: true
description: "本文需要密码访问"
summary: "本文需要密码访问"
---

推荐 Mac 电脑使用 Claude。

## 一、梯子

第一件事是有个自己的稳定节点，不要用机场。机场便宜但 IP 是大家共用的，注册 Google 和 Claude 都容易触发风控。

我用搬瓦工 https://bandwagonhost.com/ ，按需选择节点，我用的是日本节点 50U / 3 个月。

Lisahost https://lisahost.com/aff.php?aff=9974 备用，操作系统选 ubuntu-22.04。

## 二、把 VPS 变成可用的代理

1. 如果用的搬瓦工：买好后 → 设置图标 kiwivm → 在主页面（Main controls）选择 Stop → Install new OS → ubuntu-22.04-x86_64 → reload → 记好 root 密码 → 回到控制台 → Start 运行机器。
   把 Physical Location 到 Hostname 的内容都复制，准备发给 codex。
   ![](/images/posts/claude/bandwagon-info-1.png)

   ![](/images/posts/claude/bandwagon-info-2.png)

2. 如果用的 Lisahost：直接到控制台拿到 IP、端口、用户名、实例密码、操作系统信息。

   ![](/images/posts/claude/lisahost-info.png)

复制好的内容打开 codex，告诉 codex：

> **复制的内容** + 装一下这个脚本：https://233boy.com/sing-box/sing-box-script/ 。搭建一下服务器，我要 Clash 和 Shadowrocket 都可以用，你给我一个 yaml 文件及 Shadowrocket 导入二维码。

codex 会给到安装的教程，类似：

Mac 直接开终端，Windows 用 PowerShell，登进去：

```
ssh root@<你的IP> -p <端口>
```

跑脚本，按提示选协议的时候选 **vless-reality**。装完它会吐出一串节点链接和一个二维码，链接复制下来，回给 codex。

## 三、电脑上装 Clash Verge

下载地址 https://github.com/clash-verge-rev/clash-verge-rev/releases ，Mac 拿 dmg，Windows 拿 exe。

打开之后，左边「订阅」点「新建」，把刚才那串节点链接粘进去保存。然后「代理」里选这个节点，顶上「系统代理」打开，开全局。

去 https://ipinfo.io 看一眼，IP 变成你 VPS 的就对了。

手机上：

- iOS 用小火箭（美区 Apple ID 在 App Store 里 $2.99 买 / 港区 Apple ID $22），扫第二步那个二维码。
- Android 装 Clash Verge 安卓版，导入 yaml 文件。

## 四、注册 Gmail

梯子切到搭建节点。

已有 Gmail / 新 Gmail 都行，区域不要在 Claude 禁用的区域。已有的看看 Google 的地址在哪：[Google 服务条款适用地区](https://policies.google.com/terms?hl=zh_CN)

![](/images/posts/claude/gmail-region.png)

注册新的 Gmail 要开 Chrome **无痕窗口**（一定要无痕，否则会被你已有的 Google 登录态污染）。访问 https://accounts.google.com/signup ，手机号验证用国内 +86 就行。

注册完点头像 → 管理 Google 账号 → 隐私与个性化，确认地区是你服务器的区域。

已有 Gmail 想改地区，去 https://payments.google.com 改地址，30 天只能改一次。或者在 Google Pay 切换：https://blog.duetopia.com/posts/google-us-account/ ，不一定成功。

## 五、登 Claude

同一个无痕窗口、节点别动，访问 https://claude.ai ，选 Continue with Google，用刚注册的那个 Gmail 登进去就完了。

有时候需要手机号，去咸鱼搜索 Claude，大概费用 2-5R，接一次码就行；没要手机号更好。

到这一步免费版已经能用。下面是要不要订 Pro。

## 六、订阅 Pro

Claude 网页订阅不收国内卡，得绕一下。Google Pay / Apple 礼品卡。

Bitget 开个 U 卡 → 这张卡绑到 Google Pay → 在 Seeker 这台手机上完成订阅。

Bitget Wallet Card 注册 https://newshare.bwb.global/zh/referralLanding?inviteCode=z3cda2 ，过 KYC（身份证 + 人脸），充 USDT，开虚拟 Visa 卡。卡余额留够 $25 以上，扣费的时候差几毛会失败。

Seeker 是一台原生 Google 手机，GMS 完整能装 Google Play。
连 WiFi（梯子接上，下载 Clash 并配置），登第四步那个 Gmail，Google Play → 订阅设置，把 Bitget 的卡加进去。

地址可以用[地址生成器](https://www.meiguodizhi.com/usa-address/alaska)，阿拉斯加税少。只要 CVV、卡号、姓名正确就行。

然后 Claude 网页或者 App 里选 Pro，$20/月，付款的时候选 Google Pay。

如果你已经有美区 Apple ID 和 Apple 礼品卡：

- [美区 Apple ID 注册](https://blog.duetopia.com/posts/chatgpt-plus-guide/)
- [Apple 礼品卡官网购买](https://blog.duetopia.com/posts/apple-giftcard-guide/)

不要一上来就选 200U 的订阅，先用 20U，额度够就继续用，不够再升级。

## 最后

节点别乱换、设备别乱切。被封了不要立刻重开，先确认清楚哪一环走漏了再说。

## 被封后申请退款

我是用苹果礼品卡买的 Claude，所以下面分享的也是这种方法。

### 1、苹果官方网站报告问题

网站地址：[reportaproblem.apple.com](https://reportaproblem.apple.com/)

因为我们是用苹果礼品卡付的钱，但是订阅期限还没到就被封号了，所以我们直接去找苹果。

让他退款，那么他就会去找 Anthropic 核实，核实无误之后就会退款给我们。

### 2、登录账号

这里登录的是美区账号，别登错了。登国区账号的话是看不到你的订单的。

### 3、信息填写

选择「请求退款」和「其他」，然后点下一步。

### 4、选择你需要退款的订单，然后点击下一步

### 5、补充详细信息

写清楚，什么时间，Anthropic 无故封禁了我的账号，导致我无法使用应有的订阅服务。

用的话，时间日期改成你自己的：

```
On January 27, 2026, Anthropic suspended my account without explanation, even though my subscription doesn't expire until January 30, 2026. Since today is only the 27th, I'm requesting a refund for the unused portion.
```

### 6、提交等待退款


### Claude 定时任务
`做一个定时任务, 让Claude 每天定时(电脑运行Claude状态下)记忆备份数据到本地obsidian或notion`
