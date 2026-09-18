<script setup>
import { computed, ref } from 'vue'

/**
 * Interactive pipeline panel: one task's lifecycle from configuration through
 * to recall. High-altitude on purpose — the numbered SectionShell blocks below
 * it on the landing page go into capability depth, so this stays a map rather
 * than a second copy of the same list.
 *
 * Every stage names a real command, path or artifact.
 */

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

const metrics = [
  {
    label: '统一调度',
    value: '4',
    unit: '个 AI 后端',
    text: 'codex · claude · antigravity · pi',
  },
  {
    label: '并行编排',
    value: '--parallel',
    unit: '',
    text: '按 dependencies 排序，逐任务隔离 worktree',
  },
  {
    label: '单一运行根',
    value: '$PINABLE_HOME',
    unit: '',
    text: '配置、会话、交付与经验归集一处',
  },
]

const activeStage = computed(() => stages[activeIndex.value])
</script>

<template>
  <div class="home-experience">
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

    <section class="impact-strip" aria-label="运行事实">
      <div v-for="metric in metrics" :key="metric.label" class="impact-item">
        <span class="impact-label">{{ metric.label }}</span>
        <strong>
          {{ metric.value }}
          <em v-if="metric.unit">{{ metric.unit }}</em>
        </strong>
        <p>{{ metric.text }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* The one site-wide measure; see the Layout block in tokens.css. */
.home-experience {
  width: min(var(--pa-page-width), 100% - var(--pa-gutter));
  margin: 0 auto;
  padding: 64px 0 0;
}

.workbench-band {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(480px, 1.1fr);
  gap: 40px;
  align-items: center;
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

/* ---- Panel ---- */
.flow-panel {
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-lg);
  background: var(--vp-c-bg-elv);
  overflow: hidden;
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
  min-height: 236px;
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

/* ---- Facts strip ---- */
.impact-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-top: 40px;
  background: var(--vp-c-border);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-lg);
  overflow: hidden;
}

.impact-item {
  padding: 20px;
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

@media (max-width: 1024px) {
  .workbench-band {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .home-experience {
    padding-top: 48px;
  }
}

@media (max-width: 768px) {
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
}

@media (prefers-reduced-motion: reduce) {
  .stage-button,
  .panel-fade-enter-active,
  .panel-fade-leave-active {
    transition: none;
  }
}
</style>
