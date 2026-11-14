---
title: 产品
description: PinableAgents 产品界面与能力预览
layout: home

hero:
  name: "Product"
  text: "桌面端、执行引擎与个人 AI 工作台"
  tagline: "这是产品当前版本实际具备的能力，每一项都对应一个可用的入口或命令。"
---

<div class="landing-page">

<section class="landing-section" data-rail-label="界面导览">
  <p class="landing-eyebrow">界面导览</p>
  <h2 class="landing-title">八张真实截图，不是渲染图。</h2>
  <p class="landing-lead">拖动、点击箭头或使用左右方向键浏览。这是产品当前版本的实际界面。</p>
  <div class="landing-frame">
    <FunctionCarousel />
  </div>
</section>

<SectionShell
  eyebrow="01 · Runtime"
  rail-label="运行时"
  title="一个运行根，装下全部状态。"
  lead="Provider、模型、Agent 定义、模块、运行数据与经验库都落在同一个目录下。备份它、迁移它、或者直接看它，都不需要翻找散落各处的配置。"
  panel-label="$PINABLE_HOME"
>
<ul class="landing-points">
<li><strong>配置集中</strong><code class="landing-mono">models.json</code> 与 <code class="landing-mono">agents/*.md</code> 定义可用的模型与 Agent 角色，所有项目共用一份。</li>
<li><strong>数据自持</strong>任务、交付与经验分别落在 <code class="landing-mono">data/</code>、<code class="landing-mono">delivery/</code>、<code class="landing-mono">experience/</code> 下的本地数据库。</li>
<li><strong>桌面端管理的四个必带命令行</strong><code class="landing-mono">$PINABLE_HOME/bin</code> 暴露 <code class="landing-mono">pinable</code>、<code class="landing-mono">pinable-ai</code>、<code class="landing-mono">codegraph</code>、<code class="landing-mono">cliproxyapi</code>。</li>
<li><strong>权限分档</strong>交互与非交互任务、只读与工作区写入或完全访问按执行引擎声明显式选择，需要更高权限时不会自动提权。</li>
<li><strong>实验引擎</strong>DeepSeek 实验引擎首期只在定时任务页执行，默认只读，不接入终端、网关、远程执行与可验证交付。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="02 · Orchestration"
  rail-label="编排"
  title="任务写成块，顺序交给依赖。"
  lead="工作流文件由 ---TASK--- 块组成。每个块声明自己是谁、在哪里跑、用哪个后端，以及依赖谁——执行顺序由依赖推导，不需要人工排期。"
  panel-label="workflow"
>
<ul class="landing-points">
<li><strong>逐块可覆盖</strong><code class="landing-mono">id</code>、<code class="landing-mono">workdir</code>、<code class="landing-mono">backend</code>、<code class="landing-mono">model</code>、<code class="landing-mono">dependencies</code>、<code class="landing-mono">skills</code> 都是按任务生效的。</li>
<li><strong>并发有上限</strong>并行度由 <code class="landing-mono">PINABLE_MAX_PARALLEL_WORKERS</code> 控制，避免一次性压垮本机或上游配额。</li>
<li><strong>互不踩踏</strong><code class="landing-mono">--worktree</code> 让每个任务在独立的 git worktree 中改动代码。</li>
</ul>

<template #panel>
<img src="/assets/functions/2-workflow.png" alt="工作流列表界面" class="landing-shot" loading="lazy">
</template>
</SectionShell>

<SectionShell
  eyebrow="03 · Sessions"
  rail-label="会话"
  title="会话可以中断，也可以接着来。"
  lead="每次执行都会回传会话标识，对话过程被完整捕获。中断之后用同一个标识恢复，上下文不会从头再来。"
  panel-label="terminal / session timeline"
>
<ul class="landing-points">
<li><strong>可恢复</strong><code class="landing-mono">pinable resume &lt;session_id&gt;</code> 接回之前的会话继续执行。</li>
<li><strong>标识回传</strong>执行输出中带回 <code class="landing-mono">SESSION_ID:</code>，脚本与人工都能直接取用。</li>
<li><strong>过程留档</strong>对话捕获与时间线视图让一次执行的前因后果可回看，而不是只看到最后一行结果。</li>
</ul>

<template #panel>
<img src="/assets/functions/5-terminal.png" alt="终端执行界面" class="landing-shot" loading="lazy">
</template>
</SectionShell>

<SectionShell
  eyebrow="04 · Delivery"
  rail-label="交付"
  title="五个阶段，构成一条交付链路。"
  lead="AI 产出的改动不直接落到主线。它按规划 → 实现 ⇄ 验证 → 评审 → 合入推进，每一次状态转移都留下记录，批准与驳回都有据可查。"
  panel-label="delivery stages"
>
<ul class="landing-points">
<li><strong>五阶段推进</strong>规划 → 实现 ⇄ 验证 → 评审 → 合入；评审与合入由宿主确定性执行。</li>
<li><strong>CLI 动词</strong><code class="landing-mono">submit</code>、<code class="landing-mono">validate</code>、<code class="landing-mono">start</code>、<code class="landing-mono">approve</code>、<code class="landing-mono">evidence</code> 与 <code class="landing-mono">timeline</code> 是操作命令，不是阶段本身；中断后还可用 <code class="landing-mono">resume</code> 或 <code class="landing-mono">takeover</code> 恢复。</li>
<li><strong>人工卡点</strong><code class="landing-mono">approve</code> / <code class="landing-mono">reject</code> 是评审阶段的显式决策点，不是事后追认。</li>
<li><strong>结果可查</strong><code class="landing-mono">evidence</code> 与 <code class="landing-mono">timeline</code> 保存检查结果与全过程时序。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="05 · Projects"
  rail-label="项目"
  title="长期目标，拆成可验收的交付。"
  lead="同一目标可以连续产生多次交付；事项保留问题、答复、拍板与发布进展，自动规则决定哪些工作流能自己接活。"
>
<ul class="landing-points">
<li><strong>事项跨多次交付</strong>同一目标下的交付、问题与发布进展留在同一事项里，后续交付继续复用已验收的上下文。</li>
<li><strong>四种完成终点</strong>本地验收、推送、变更请求与上线各自保存证据，完成一项不代表其他终点自动完成。</li>
<li><strong>交付模板</strong>验收标准里以 <code class="landing-mono">$ </code> 开头的行就是验证命令，模板执行时按它检查结果。</li>
<li><strong>规则接活</strong>定时任务或 GitHub Issue 规则按模板创建事项；应用未运行期间错过的触发点不补办。</li>
<li><strong>授权与预算</strong>预算按事项累计 Token、费用、时长与尝试次数；权限档需要更高权限时显式授权，不自动提权。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="06 · Experience"
  rail-label="经验"
  title="经验不是日志，是要被验证的假设。"
  lead="过程与人工纠正中被采集为候选经验，脱敏评审后进入复用库；在相似上下文里被召回之后，还要继续跟踪它是否真的改善了结果。"
>
<ul class="landing-points">
<li><strong>多来源采集</strong>候选、纠正、摘要、效率、片段与指纹各有独立记录，来源不同处理方式也不同。</li>
<li><strong>不自动生效</strong>采集到的内容先成为候选，经过评审才进入复用库。</li>
<li><strong>允许被淘汰</strong>召回后的效果持续跟踪，没有改善的经验会被清理，而不是只增不减。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="07 · Extensions"
  rail-label="扩展"
  title="可安装模块，与内外的集成面。"
  lead="可安装模块随包发布、按需安装；对外集成走内置与外部 MCP、消息网关和 A2A，不必自己写胶水。"
>
<ul class="landing-chips">
<li>do 1.10</li>
<li>bugfix 1.5</li>
<li>video-analysis 2.0</li>
<li>image-gen 3.2</li>
<li>pinable 2.0</li>
</ul>

<ul class="landing-points">
<li><strong>内置 MCP</strong><code class="landing-mono">codegraph</code> 提供 8 个只读代码工具，<code class="landing-mono">remote-servers</code> 提供远程执行；Claude Code、Codex、PinableAI 开箱可用，Pi 与 Antigravity 当前不声明支持。</li>
<li><strong>外部 MCP</strong>在「能力 → MCP」集中管理本地 stdio、远程 Streamable HTTP 与旧版 SSE；网关入口提供客户端凭据，内置能力仍由桌面任务权限控制。</li>
<li><strong>三条网关通道</strong><code class="landing-mono">telegram</code>、<code class="landing-mono">feishu</code>、<code class="landing-mono">weixin</code>，同一套任务从聊天窗口发起。</li>
<li><strong>A2A 对外协作</strong>五个内置角色：产品设计、美术设计、业务开发、整合审查与测试交付；调用凭据按 Agent 与 Skill 授权。</li>
<li><strong>其余出口</strong>终端、定时任务、服务器托管、静态站点发布与 HealthBuddy 健康检查。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="08 · Desktop"
  rail-label="桌面端"
  title="macOS 与 Windows，都是原生桌面端。"
  lead="macOS 与 Windows 桌面端都接入了菜单栏或系统托盘、通知、登录项与 URL 链接；Linux 提供不含桌面界面的 Core 运行包。关掉窗口不等于退出，任务跑完会来找你。"
  panel-label="settings / desktop integration"
>
<ul class="landing-chips">
<li>⌘K / Ctrl+K 命令中心</li>
<li>⌘1–9 / Ctrl+1–9 切换页面</li>
<li>⌘B / Ctrl+B 侧边栏</li>
<li>⌘I / Ctrl+I 上下文面板</li>
<li>⌘/ / Ctrl+/ 帮助</li>
<li>pinable:// 链接</li>
</ul>

<ul class="landing-points">
<li><strong>常驻与唤出</strong>关闭主窗口只隐藏到菜单栏或系统托盘；设置页「桌面集成」可开启登录时启动和显示 / 隐藏快捷键（macOS <code class="landing-mono">⌃⌥P</code>，Windows <code class="landing-mono">Ctrl+Alt+P</code>），默认都关闭。</li>
<li><strong>完成提醒</strong>主窗口不在前台时，任务完成发系统通知并在 Dock 或任务栏角标累计未读，点击通知恢复窗口并打开对应 Agent 会话。</li>
<li><strong>独立窗口</strong>Agent 会话、日志控制台、对话详情、历史会话详情与模块/技能文件可在新窗口打开；进入终端等操作回到主窗口执行。</li>
<li><strong>链接直达</strong>在浏览器或终端打开 <code class="landing-mono">pinable://agent-session/&lt;id&gt;</code>，应用会恢复主窗口并跳到该会话，冷启动也会在就绪后跳转。</li>
<li><strong>顺手的细节</strong>记住窗口位置与尺寸；macOS 保留系统原生终端菜单，Windows 使用应用菜单，粘贴可直接读取其他应用复制的文本、文件与图片。</li>
</ul>

<template #panel>
<img src="/assets/functions/8-desktop-integration.png" alt="设置页桌面集成界面" class="landing-shot" loading="lazy">
</template>
</SectionShell>

<section class="landing-cta">
  <h2>能力细节，装上去看更准。</h2>
  <p>下载桌面端接入你已有的 AI 后端，或直接联系我们。</p>
  <div class="landing-cta-actions">
    <a class="landing-link-button landing-link-button-accent" href="/downloads">立即下载</a>
    <a class="landing-link-button" href="https://github.com/PinableAgents/pinable.cc" target="_blank" rel="noreferrer">联系我们</a>
  </div>
</section>

</div>
