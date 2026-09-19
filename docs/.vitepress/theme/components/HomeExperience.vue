<script setup>
import { computed, ref } from 'vue'

const activeIndex = ref(0)

const stages = [
  {
    step: '01',
    title: '配置',
    kicker: 'Configure',
    signal: 'models.json · agents/*.md',
    body: '在统一运行根 $PINABLE_HOME 下接入 Provider 与执行引擎，安装 Skill、Workflow、MCP。配置一次，之后所有任务共用。',
    points: ['4 个后端', 'models.json', 'managed-modules/'],
  },
  {
    step: '02',
    title: '编排',
    kicker: 'Orchestrate',
    signal: '--parallel · --worktree',
    body: '把一组任务交给 pinable。--parallel 读入 ---TASK--- 块并按 dependencies 排序，每个任务可指定自己的 workdir、backend 与 model。',
    points: ['---TASK--- 协议', '依赖排序', 'worktree 隔离'],
  },
  {
    step: '03',
    title: '交付',
    kicker: 'Deliver',
    signal: 'validate → approve → evidence',
    body: '变更走可验证交付链路：提交、校验、执行、审批，每一步留下证据与时间线，AI 产出的改动有据可查。',
    points: ['审批留痕', '证据沉淀', '时间线回放'],
  },
  {
    step: '04',
    title: '沉淀',
    kicker: 'Recall',
    signal: 'experience/memory',
    body: '从任务与纠正中采集候选经验，经脱敏与评审进入复用库，下次在相似上下文里按需召回，并持续验证是否真的有用。',
    points: ['候选采集', '评审入库', '按需召回'],
  },
]

const activeStage = computed(() => stages[activeIndex.value])
</script>

<template>
  <!-- Hero product shot band -->
  <div class="he-shot-band">
    <div class="he-shot-inner">
      <div class="he-shot-card">
        <div class="he-shot-card-bar">
          <span class="he-shot-traffic"></span>
          <span class="he-shot-title">pinable — 工作流执行</span>
          <span class="he-shot-pill">运行中</span>
        </div>
        <img
          src="/assets/functions/4-workflow-tasks.png"
          alt="PinableAgents 工作流执行界面"
          class="he-shot-img"
          loading="eager"
        />
      </div>
    </div>
  </div>

  <!-- Why section -->
  <div class="home-experience">
    <section class="why-band" aria-labelledby="why-title">
      <div class="why-copy">
        <span class="landing-eyebrow">Why PinableAgents</span>
        <h2 id="why-title">为什么需要一条固定的 AI 交付链路？</h2>
        <p>
          AI 工具越来越多，但"AI 做了什么、做对了没有、改了哪里、谁批准的"这些问题在大多数工具里没有答案。
          PinableAgents 把 AI 研发动作串成固定流程——从接入 Runtime、并行编排、到可验证交付、经验回流，每一段都有对应的命令与落盘产物。
        </p>
        <ul class="why-points">
          <li>
            <strong>不是黑盒</strong>
            每次执行都有日志、证据与时间线，AI 做了什么随时可以回看。
          </li>
          <li>
            <strong>不是孤岛</strong>
            四个 AI 后端统一调度，配置一次、所有项目共用，不需要为每个工具单独维护一套配置。
          </li>
          <li>
            <strong>不是实验</strong>
            可验证交付链路保证 AI 产出的改动在被批准之前不会生效，审批留痕，可追溯。
          </li>
        </ul>
      </div>
      <div class="why-panel">
        <img
          src="/assets/functions/6-history.png"
          alt="交付历史与审批记录界面"
          class="why-img"
          loading="lazy"
        />
      </div>
    </section>

    <!-- Pipeline interactive panel -->
    <section class="workbench-band" aria-labelledby="workbench-title">
      <div class="workbench-copy">
        <span class="landing-eyebrow">Pipeline</span>
        <h2 id="workbench-title">一次任务从配置到沉淀，走完整条链路。</h2>
        <p>
          PinableAgents 把 AI 研发动作串成固定流程：接入 Runtime、并行编排、可验证交付、经验回流。
          每一段都有对应的命令与落盘产物，不是黑盒。
        </p>
      </div>

      <div class="flow-panel">
        <div class="panel-topbar">
          <span>pinable</span>
          <code>{{ activeStage.signal }}</code>
        </div>

        <div class="stage-controls" role="list" aria-label="Pipeline stages">
          <button
            v-for="(stage, index) in stages"
            :key="stage.title"
            type="button"
            class="stage-button"
            :class="{ active: activeIndex === index }"
            :aria-pressed="activeIndex === index"
            @click="activeIndex = index"
            @focus="activeIndex = index"
            @mouseenter="activeIndex = index"
          >
            <span>{{ stage.step }}</span>
            {{ stage.title }}
          </button>
        </div>

        <div class="stage-detail">
          <Transition name="panel-fade" mode="out-in">
            <div :key="activeStage.title" class="stage-detail-inner">
              <span class="stage-kicker">{{ activeStage.kicker }}</span>
              <h3>{{ activeStage.title }}</h3>
              <p>{{ activeStage.body }}</p>
              <div class="stage-points">
                <span v-for="point in activeStage.points" :key="point">{{ point }}</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Metrics strip -->
    <section class="impact-strip" aria-label="运行事实">
      <div class="impact-item">
        <span class="impact-label">统一调度</span>
        <strong>4 <em>个 AI 后端</em></strong>
        <p>codex · claude · antigravity · pi</p>
      </div>
      <div class="impact-item">
        <span class="impact-label">并行编排</span>
        <strong>--parallel</strong>
        <p>按 dependencies 排序，逐任务隔离 worktree</p>
      </div>
      <div class="impact-item">
        <span class="impact-label">单一运行根</span>
        <strong>$PINABLE_HOME</strong>
        <p>配置、会话、交付与经验归集一处</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---- Hero shot band ---- */
.he-shot-band {
  width: 100%;
  padding: 0 0 0;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-border);
  overflow: hidden;
}

/* No backdrop panel behind the shot — the card is the only surface here.
 *
 * An earlier take put a second, larger surface behind it (first two panels in
 * different tokens, then one mat spanning the band). Both read as a stray
 * rectangle: the palette is achromatic enough that a second surface is only
 * ~10/255 off the page, so it registers as a smudge rather than as a designed
 * layer, and a rectangle that is neither the card's size nor the band's width
 * has nothing to line up with. The card's own border and shadow already carry
 * the separation; a second empty surface competes with the screenshot. */
.he-shot-inner {
  width: min(var(--pa-page-width), 100% - var(--pa-gutter));
  margin: 0 auto;
  padding: 48px 0 0;
}

/* The floating product screenshot card */
.he-shot-card {
  max-width: 880px;
  margin: 0 auto;
  border: 1px solid var(--vp-c-border);
  border-bottom: none;
  border-radius: var(--pa-radius-lg) var(--pa-radius-lg) 0 0;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--pa-shadow-lg);
  overflow: hidden;
}

.he-shot-card-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

/* macOS traffic lights */
.he-shot-traffic {
  display: inline-flex;
  width: 42px;
  height: 10px;
  background:
    radial-gradient(circle, #ff5f57 0 4px, transparent 4px) 0 0 / 12px 10px no-repeat,
    radial-gradient(circle, #febc2e 0 4px, transparent 4px) 15px 0 / 12px 10px no-repeat,
    radial-gradient(circle, #28c840 0 4px, transparent 4px) 30px 0 / 12px 10px no-repeat;
  flex-shrink: 0;
}

.he-shot-title {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  flex: 1;
}

.he-shot-pill {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  color: #28c840;
  background: rgba(40,200,64,.1);
  border: 1px solid rgba(40,200,64,.2);
  border-radius: 999px;
  padding: 2px 8px;
}

.he-shot-img {
  display: block;
  width: 100%;
  height: auto;
}

/* ---- Main experience area ---- */
.home-experience {
  width: min(var(--pa-page-width), 100% - var(--pa-gutter));
  margin: 0 auto;
  padding: 80px 0 0;
}

/* ---- Why band ---- */
.why-band {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 72px;
  align-items: center;
  padding-bottom: 80px;
  border-bottom: 1px solid var(--vp-c-border);
}

.why-copy h2 {
  margin: 0 0 16px;
  max-width: 18em;
  color: var(--vp-c-text-1);
  font-size: clamp(1.625rem, 2.8vw, 2.25rem);
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: 0;
  text-wrap: balance;
}

.why-copy p {
  margin: 0;
  max-width: 46ch;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.75;
}

.why-points {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.why-points li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.why-points strong {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.why-panel {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-lg);
  background: var(--vp-c-bg-elv);
  overflow: hidden;
  box-shadow: var(--pa-shadow-lg);
}

.why-img {
  display: block;
  width: 100%;
  height: auto;
}

/* ---- Pipeline band ---- */
.workbench-band {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(480px, 1.1fr);
  gap: 40px;
  align-items: center;
  padding: 80px 0;
  border-bottom: 1px solid var(--vp-c-border);
}

.workbench-copy h2 {
  margin: 0 0 16px;
  max-width: 20ch;
  color: var(--vp-c-text-1);
  font-size: clamp(1.625rem, 2.8vw, 2.25rem);
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: 0;
  text-wrap: balance;
}

.workbench-copy p {
  margin: 0;
  max-width: 52ch;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.75;
}

/* ---- Flow panel ---- */
.flow-panel {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-lg);
  background: var(--vp-c-bg-elv);
  overflow: hidden;
  box-shadow: var(--pa-shadow);
}

.panel-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 0.8125rem;
}

.panel-topbar code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  padding: 0;
}

.stage-controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  background: var(--vp-c-border);
}

.stage-button {
  min-height: 68px;
  padding: 12px 14px;
  border: 0;
  border-radius: 0;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  transition: background-color var(--pa-transition), color var(--pa-transition);
}

.stage-button span {
  display: block;
  margin-bottom: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

.stage-button:hover,
.stage-button:focus-visible,
.stage-button.active {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
}

.stage-button.active span {
  color: var(--vp-c-text-2);
}

.stage-button:focus-visible {
  box-shadow: inset 0 0 0 2px var(--vp-c-brand-1);
}

.stage-detail {
  min-height: 220px;
  padding: 26px 24px;
}

.stage-kicker {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.stage-detail h3 {
  margin: 10px 0 12px;
  color: var(--vp-c-text-1);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0;
}

.stage-detail p {
  margin: 0;
  max-width: 56ch;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.75;
}

.stage-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.stage-points span {
  padding: 5px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-sm);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
}

/* ---- Metrics strip ---- */
.impact-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-top: 0;
  background: var(--vp-c-border);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-lg);
  overflow: hidden;
}

.impact-item {
  padding: 24px;
  background: var(--vp-c-bg-elv);
}

.impact-label {
  display: block;
  margin-bottom: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.impact-item strong {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: 0;
  font-family: var(--vp-font-family-mono);
}

.impact-item em {
  font-style: normal;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.impact-item p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.6;
}

/* ---- Motion ---- */
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity var(--pa-transition), transform var(--pa-transition);
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* ---- Responsive ---- */
@media (max-width: 1100px) {
  .why-band {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .workbench-band {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .he-shot-inner {
    padding-top: 36px;
  }
}

@media (max-width: 768px) {
  .home-experience {
    padding-top: 56px;
  }

  .stage-controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .impact-strip {
    grid-template-columns: 1fr;
  }

  .stage-detail {
    min-height: 0;
    padding: 22px 18px;
  }

  .stage-detail h3 {
    font-size: 1.25rem;
  }

  .why-band,
  .workbench-band {
    padding-bottom: 56px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stage-button,
  .panel-fade-enter-active,
  .panel-fade-leave-active {
    transition: none;
  }
}
</style>
