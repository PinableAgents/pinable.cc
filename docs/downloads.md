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
      <p>选择你的操作系统。推荐版本会根据当前设备自动显示。</p>
    </div>
    <HeroDownloads :start-expanded="true" />
  </section>

  <section class="downloads-note">
    <h2>软件授权与卡密</h2>
    <p>桌面端授权页面可购买软件授权及授权卡密。授权卡密购买后，先激活本订单的软件授权，再在购买窗口刷新并领取卡密；备货和人工交付状态会单独显示。外部卡密需要按商品说明到第三方服务手动兑换，不会自动导入模型额度。</p>
    <p>普通外部卡密不含软件授权，可通过购买窗口的「浏览商城」入口购买。已激活软件授权时，从桌面打开商城会携带当前 License Key 自动登录，无需再次输入卡密或邮箱密码；直接访问网站时，可手动使用 License Key 或账号登录。</p>
    <p>从桌面端打开商城或用量页面时，会携带当前 License Key 自动建立授权会话，无需邮箱和密码。管理员需先在授权后台的「系统设置 → 站点设置」开启「授权模式」并保存；授权会话可访问商城及该授权关联账号的订单，并查看密钥、用量、模型目录和渠道状态。也可手动访问后台的 <code>/license-login</code> 页面输入 License Key。</p>
  </section>

  <section class="downloads-note">
    <span class="landing-eyebrow">Release notes</span>
    <p>每个文件都来自同一份发布清单，版本号、文件类型和 SHA-256 校验值保持一致。</p>
    <a href="https://github.com/PinableAgents/pinable.cc/releases" target="_blank" rel="noreferrer">查看全部发布记录 →</a>
  </section>
</div>
