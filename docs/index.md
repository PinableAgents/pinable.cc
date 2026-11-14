---
layout: home

hero:
  name: "PinableAgents"
  text: "把 AI 研发变成可验证的交付。"
  tagline: "四个内置 AI 后端统一调度，在隔离 worktree 中并行执行任务，每次变更都留痕、可审批、可追溯。"
---

<HomeExperience />

<div class="landing-page">

<SectionShell
  eyebrow="01 · Runtime"
  rail-label="运行时"
  title="四个内置 AI 后端，一个控制面。"
  lead="不必为每个 AI 工具各维护一套配置。Provider、模型与执行引擎集中在一处，按任务决定这一次用哪个。另有 DeepSeek 实验引擎，首期只在定时任务页执行。"
  panel-label="provider / runtime engines / agent models"
>
<ul class="landing-points">
<li><strong>逐任务选后端</strong><code class="landing-mono">--backend</code> 与 <code class="landing-mono">--model</code> 可按任务指定，同一批任务里混用不同后端。</li>
<li><strong>配置只写一次</strong>Provider、模型与 Agent 定义都落在 <code class="landing-mono">$PINABLE_HOME</code>，所有项目共用一份。</li>
<li><strong>算力池按需启用</strong>受管 CLIProxyAPI 提供本地统一出口，密钥与账号不必散落到每个项目。</li>
</ul>

<template #panel>
<img src="/assets/functions/1-provider.png" alt="AI 提供商配置界面" class="landing-shot" loading="lazy">
</template>
</SectionShell>

<SectionShell
  eyebrow="02 · Orchestration"
  rail-label="编排"
  title="并行跑一组任务，各自隔离。"
  lead="把一批任务交给 pinable，它读入任务块、按依赖排序、逐个在独立 worktree 中执行——互不踩踏，产物可分别审阅。"
  panel-label="workflow tasks"
>
<ul class="landing-points">
<li><strong>依赖排序</strong>每个任务块可声明 <code class="landing-mono">dependencies</code>，执行顺序由依赖决定，不用手工排期。</li>
<li><strong>worktree 隔离</strong><code class="landing-mono">--worktree</code> 让每个任务在自己的 git worktree 里改代码，互不影响。</li>
<li><strong>逐任务覆盖</strong><code class="landing-mono">workdir</code>、<code class="landing-mono">backend</code>、<code class="landing-mono">model</code>、<code class="landing-mono">skills</code> 都能按任务单独设定。</li>
</ul>

<template #panel>
<img src="/assets/functions/4-workflow-tasks.png" alt="工作流任务执行界面" class="landing-shot" loading="lazy">
</template>
</SectionShell>

<SectionShell
  eyebrow="03 · Delivery"
  rail-label="交付"
  title="AI 的改动，走完审批才落地。"
  lead="变更走一条固定的五阶段链路：规划 → 实现 ⇄ 验证 → 评审 → 合入。每一步都留痕，随时可以回看当时发生了什么。"
  panel-label="history"
>
<ul class="landing-points">
<li><strong>五段推进</strong>规划 → 实现 ⇄ 验证 → 评审 → 合入；评审与合入由宿主执行。</li>
<li><strong>审批留痕</strong>谁在什么时候批准了哪一次变更，记录在案，可追溯。</li>
<li><strong>证据沉淀</strong>检查结果与产出物随交付一起保存，不是聊完就散。</li>
</ul>

<template #panel>
<img src="/assets/functions/6-history.png" alt="历史记录界面" class="landing-shot" loading="lazy">
</template>
</SectionShell>

<SectionShell
  eyebrow="04 · Projects"
  rail-label="项目"
  title="长期目标，拆成可验收的交付。"
  lead="同一目标可以连续产生多次交付；事项保留问题、答复、拍板与发布进展，自动规则决定哪些工作流能自己接活。"
>
<ul class="landing-points">
<li><strong>事项跨多次交付</strong>同一目标下的交付、问题与发布进展留在同一事项里，后续交付继续复用已验收的上下文。</li>
<li><strong>四种完成终点</strong>本地验收、推送、变更请求与上线各自保存证据，完成一项不代表其他终点自动完成。</li>
<li><strong>交付模板</strong>验收标准里以 <code class="landing-mono">$ </code> 开头的行就是验证命令，模板执行时按它检查结果。</li>
<li><strong>授权与预算</strong>自动规则按模板创建事项；预算按事项累计 Token、费用、时长与尝试次数，权限档不自动提权。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="05 · Experience"
  rail-label="经验"
  title="踩过的坑，下一次会被想起来。"
  lead="从任务过程与人工纠正中采集候选经验，脱敏评审后进入复用库，在相似上下文里按需召回，并持续验证它是否真的改善了结果。"
>
<ul class="landing-points">
<li><strong>候选采集</strong>任务结束与人工纠正都是经验来源，不需要额外记录。</li>
<li><strong>评审入库</strong>经验不会自动生效，要过脱敏与评审才进入复用库。</li>
<li><strong>效果验证</strong>召回之后仍跟踪结果，无效的经验会被淘汰，而不是一直留着。</li>
</ul>
</SectionShell>

<SectionShell
  eyebrow="06 · Desktop"
  rail-label="桌面端"
  title="关上窗口，任务照样跑完。"
  lead="macOS 与 Windows 桌面端都常驻菜单栏或系统托盘。任务在后台跑完会发系统通知，会话和日志可以拆到独立窗口里并排看。"
  panel-label="agent session"
>
<ul class="landing-points">
<li><strong>常驻菜单栏或托盘</strong>关闭主窗口只是隐藏，后台任务与定时任务不中断；在设置中开启后，可按 <code class="landing-mono">⌃⌥P</code>（Windows 为 <code class="landing-mono">Ctrl+Alt+P</code>）随时唤出。</li>
<li><strong>完成即通知</strong>主窗口不在前台时，任务完成发系统通知并在 Dock 或任务栏角标计数，点击通知直接打开对应会话。</li>
<li><strong>独立窗口</strong>Agent 会话、日志、对话与历史详情可以在新窗口打开，一边看输出一边做别的事。</li>
</ul>

<template #panel>
<img src="/assets/functions/7-agent-session.png" alt="Agent 会话详情界面" class="landing-shot" loading="lazy">
</template>
</SectionShell>

<section class="landing-section" data-rail-label="用户声音">
<span class="landing-eyebrow">用户声音</span>
<h2 class="landing-title">正在用 PinableAgents 的人在说什么。</h2>
<p class="landing-lead">早期用户的真实反馈——不是市场文案，是他们在实际项目里用过之后说的话。</p>
<ul class="landing-quotes">
<li class="landing-quote">
<p class="landing-quote-body">以前每次 AI 改了代码都要手动 diff、手动记录，PinableAgents 的交付链路让这件事变成了自动的。审批记录和时间线省了我大量沟通成本。</p>
<p class="landing-quote-author"><strong>独立开发者</strong>使用场景：个人项目迭代</p>
</li>
<li class="landing-quote">
<p class="landing-quote-body">可以同时跑四个内置后端处理不同类型的任务，配置一次就能在所有项目里复用，这个设计非常省心。以前每个项目都要单独配 Claude Key 和 OpenAI Key，现在不用了。</p>
<p class="landing-quote-author"><strong>小团队技术负责人</strong>使用场景：多项目 AI 辅助研发</p>
</li>
<li class="landing-quote">
<p class="landing-quote-body">worktree 隔离这个功能解决了我最头疼的问题——AI 在同一个分支改代码会互相踩踏。现在让它并行跑，完成后我自己审再合并，清晰多了。</p>
<p class="landing-quote-author"><strong>全栈工程师</strong>使用场景：功能并行开发</p>
</li>
</ul>
</section>

<section class="landing-cta">
  <h2>把 AI 研发过程，纳入可复核的轨道。</h2>
  <p>下载桌面端，接入你已有的 AI 后端，从第一个任务开始留痕。</p>
  <div class="landing-cta-actions">
    <a class="landing-link-button landing-link-button-accent" href="/downloads">立即下载</a>
    <a class="landing-link-button" href="/about">了解产品能力</a>
    <a class="landing-link-button" href="https://github.com/PinableAgents/pinable.cc" target="_blank" rel="noreferrer">联系我们</a>
  </div>
</section>

</div>

<FeaturesSection />
