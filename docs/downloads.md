---
title: 下载 PinableAgents
description: 获取 PinableAgents 的 macOS、Windows 与 Linux 版本
layout: home

hero:
  name: "Downloads"
  text: "选择适合你的 PinableAgents"
  tagline: "从一个统一的下载入口获取桌面端与核心运行包，版本信息和校验值随发布清单自动更新。"
---

<div class="downloads-page">
  <section class="downloads-panel" aria-labelledby="downloads-title">
    <div class="downloads-panel-head">
      <span class="landing-eyebrow">Latest release</span>
      <h2 id="downloads-title">下载最新版本</h2>
      <p>选择你的操作系统。推荐版本会根据当前设备自动显示。macOS 版需要 macOS 12 或更高版本。</p>
    </div>
    <HeroDownloads :start-expanded="true" />
  </section>

  <section class="downloads-note">
    <h2>软件授权</h2>
    <p>在桌面端授权页面可购买软件授权。</p>
    <p>已激活授权时，从桌面端打开商城或用量页面会用当前 License Key 自动登录，无需再输入邮箱和密码，登录后可查看该授权关联账号的订单、密钥、用量、模型目录和渠道状态；直接访问网站时，可在 <code>/license-login</code> 页面输入 License Key 或使用账号登录。</p>
  </section>

  <section class="downloads-note">
    <span class="landing-eyebrow">Release notes</span>
    <p>每个文件都来自同一份发布清单，版本号、文件类型和 SHA-256 校验值保持一致。</p>
    <a href="https://github.com/PinableAgents/pinable.cc/releases" target="_blank" rel="noreferrer">查看全部发布记录 →</a>
  </section>
</div>
