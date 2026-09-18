---
title: 产品
description: PinableAgents 产品界面与能力预览
layout: home

hero:
  name: "Product"
  text: "桌面端、执行引擎与个人 AI 工作台"
  tagline: "这是产品当前版本实际具备的能力，未实现的边界单列一节，不做模糊处理。"
---

<div class="landing-page">

<section class="landing-section">
  <p class="landing-eyebrow">Interface · 界面导览</p>
  <h2 class="landing-title">五张真实截图，不是渲染图。</h2>
  <p class="landing-lead">拖动、点击箭头或使用左右方向键浏览。这是产品当前版本的实际界面。</p>
  <div class="landing-frame">
    <FunctionCarousel />
  </div>
</section>

<SectionShell
  eyebrow="01 · Runtime"
  title="一个运行根，装下全部状态。"
  lead="Provider、模型、Agent 定义、模块、运行数据与经验库都落在同一个目录下。备份它、迁移它、或者直接看它，都不需要翻找散落各处的配置。"
  panel-label="$PINABLE_HOME"
>
<ul class="landing-points">
<li><strong>配置集中</strong><code class="landing-mono">models.json</code> 与 <code class="landing-mono">agents/*.md</code> 定义可用的模型与 Agent 角色，所有项目共用一份。</li>
<li><strong>数据自持</strong>任务、交付与经验分别落在 <code class="landing-mono">data/</code>、<code class="landing-mono">delivery/</code>、<code class="landing-mono">experience/</code> 下的本地数据库。</li>
<li><strong>四个命令行</strong><code class="landing-mono">$PINABLE_HOME/bin</code> 暴露 <code class="landing-mono">pinable</code>、<code class="landing-mono">pinable-honey</code>、<code class="landing-mono">codegraph</code>、<code class="landing-mono">cliproxyapi</code>。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="02 · Orchestration"
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
<img src="/assets/functions/5-teminal.png" alt="终端执行界面" class="landing-shot" loading="lazy">
</template>
</SectionShell>

<SectionShell
  eyebrow="04 · Delivery"
  title="六个动作，构成一条交付链路。"
  lead="AI 产出的改动不直接落到主线。它经由一条固定的链路推进，每一次状态转移都留下记录，批准与驳回都有据可查。"
  panel-label="delivery chain"
>
<ul class="landing-points">
<li><strong>推进与恢复</strong><code class="landing-mono">submit</code> → <code class="landing-mono">create</code> → <code class="landing-mono">validate</code> → <code class="landing-mono">start</code>；中断后可 <code class="landing-mono">continue</code>、<code class="landing-mono">retry</code>、<code class="landing-mono">resume</code> 或 <code class="landing-mono">takeover</code>。</li>
<li><strong>人工卡点</strong><code class="landing-mono">approve</code> / <code class="landing-mono">reject</code> 是链路上的显式决策点，不是事后追认。</li>
<li><strong>结果可查</strong><code class="landing-mono">evidence</code> 与 <code class="landing-mono">timeline</code> 保存检查结果与全过程时序。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="05 · Experience"
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
  eyebrow="06 · Extensions"
  title="可安装模块，与内置的集成面。"
  lead="能力以模块形式随包发布、按需安装；对外集成则走内置的 MCP 服务与网关通道，不必自己写胶水。"
>
<ul class="landing-chips">
<li>do 1.10</li>
<li>bugfix 1.5</li>
<li>video-analysis 2.0</li>
<li>image-gen 3.1</li>
<li>a2ui 1.3</li>
<li>pinable 2.0</li>
</ul>

<ul class="landing-points">
<li><strong>三个内置 MCP</strong><code class="landing-mono">codegraph</code>（8 个只读代码检索工具）、<code class="landing-mono">remote-servers</code>、<code class="landing-mono">a2ui</code>。</li>
<li><strong>四条网关通道</strong><code class="landing-mono">telegram</code>、<code class="landing-mono">feishu</code>、<code class="landing-mono">weixin</code>、<code class="landing-mono">weixin_miniapp</code>，同一套任务从聊天窗口发起。</li>
<li><strong>其余出口</strong>终端、定时任务、服务器托管、静态站点发布、A2A 协作与 HealthBuddy 健康检查。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="07 · Boundaries"
  title="边界先说清楚，再谈能力。"
  lead="以下限制来自仓库当前状态，不是待办宣传。它们会在后续版本中改变，但此刻就是这样。"
>
<ul class="landing-points">
<li><strong>a2ui 独立界面</strong>目前仅支持 Desktop 托管任务，独立的浏览器界面尚未实现。</li>
<li><strong>PinableHoney 独立模式</strong>仅支持带 API Key 的 OpenAI / Anthropic 兼容端点，暂不支持 OAuth、插件、子 Agent 与技能市场。</li>
<li><strong>后端能力差异</strong>Pi 与 Antigravity 暂不声明支持内置 MCP 与 A2UI 交互界面。</li>
</ul>
</SectionShell>

<section class="landing-cta">
  <h2>能力细节，装上去看更准。</h2>
  <p>下载桌面端接入你已有的 AI 后端，或直接联系我们。</p>
  <div class="landing-cta-actions">
    <a class="landing-link-button landing-link-button-accent" href="/downloads">立即下载</a>
    <a class="landing-link-button" href="/contact">联系我们</a>
  </div>
</section>

</div>
