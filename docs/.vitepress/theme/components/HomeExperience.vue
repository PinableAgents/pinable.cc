<template>
  <div class="home-experience">
    <section class="workbench-band" aria-labelledby="workbench-title">
      <div class="workbench-copy">
        <span class="section-label">研发流程控制台</span>
        <h2 id="workbench-title">把 AI 能力放进可运营、可追踪的交付链路。</h2>
        <p>
          PinableAgents 将需求拆解、并行执行、桌面端模块管理和消息网关联动统一到一套工作台里，让团队从一次性问答转向持续可复用的研发生产系统。
        </p>
      </div>

      <div class="flow-panel" aria-label="PinableAgents workflow overview">
        <div class="panel-topbar">
          <span>Pipeline</span>
          <strong>{{ activeStage.signal }}</strong>
        </div>
        <div class="stage-controls" role="list" aria-label="Workflow stages">
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

    <section class="impact-strip" aria-label="Efficiency gains">
      <div v-for="metric in metrics" :key="metric.value" class="impact-item">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <p>{{ metric.text }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const activeIndex = ref(0)

const stages = [
  {
    step: '01',
    title: '统一入口',
    kicker: 'Control',
    signal: 'Provider / Skill / Workflow',
    body: '桌面端集中管理模型后端、技能模块、工作流入口和执行记录，减少团队成员各自维护脚本的成本。',
    points: ['配置集中', '模块可复用', '入口一致']
  },
  {
    step: '02',
    title: '并行编排',
    kicker: 'Orchestration',
    signal: 'Parallel execution',
    body: '任务可以按依赖关系拆分并发执行，失败聚合后回到同一个上下文，适合多角色协作和多步骤流水线。',
    points: ['依赖编排', '失败聚合', '多路执行']
  },
  {
    step: '03',
    title: '远程联动',
    kicker: 'Gateway',
    signal: 'Message trigger',
    body: '消息通道可以触发终端任务并回传结果，让团队在远程沟通工具里完成请求、执行和状态同步。',
    points: ['消息触发', '执行回传', '状态同步']
  },
  {
    step: '04',
    title: '闭环回溯',
    kicker: 'Traceability',
    signal: 'Session history',
    body: '会话历史、执行日志和产物记录沉淀为可回放资产，帮助团队复盘、审查和持续优化协作方式。',
    points: ['上下文保留', '记录可审计', '经验复用']
  }
]

const metrics = [
  {
    label: '从零散工具到统一工作台',
    value: '1 个控制面',
    text: '模块、执行、调度和回溯不再分散。'
  },
  {
    label: '从单线程问答到研发流水线',
    value: '多路并行',
    text: '拆解后的任务可以同步推进。'
  },
  {
    label: '从临时产出到团队资产',
    value: '全程可追踪',
    text: '每次协作都能复盘、复用、审计。'
  }
]

const activeStage = computed(() => stages[activeIndex.value])
</script>

<style scoped>
.home-experience {
  --home-surface: var(--ui-panel);
  --home-surface-strong: var(--ui-panel-strong);
  --home-surface-muted: var(--surface-muted);
  --home-border: var(--ui-border);
  --home-border-strong: var(--ui-border-strong);
  --home-shadow: var(--ui-shadow);
  --home-grid: var(--ui-grid-line);
  --home-control-bg: var(--ui-panel);
  --home-control-strong-bg: var(--ui-panel-strong);
  --home-action-bg: rgba(var(--brand-rgb), 0.08);
  --home-card-shadow: 0 12px 28px rgba(37, 99, 235, 0.07);
  --home-card-shadow-hover: 0 16px 34px rgba(37, 99, 235, 0.12);
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 0 0 44px;
}

.workbench-band {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(560px, 1.12fr);
  gap: 28px;
  align-items: stretch;
  padding: 30px 0 22px;
}

.workbench-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 380px;
}

.section-label {
  display: inline-flex;
  width: fit-content;
  min-height: 30px;
  align-items: center;
  padding: 0 10px;
  border: 1px solid var(--home-border);
  border-radius: 8px;
  background: rgba(var(--brand-rgb), 0.08);
  color: var(--vp-c-brand-1);
  font-size: 0.78rem;
  font-weight: 800;
}

.workbench-copy h2 {
  margin: 18px 0 14px;
  color: var(--vp-c-text-1);
  font-family: 'Varela Round', sans-serif;
  font-size: 2.2rem;
  line-height: 1.18;
  letter-spacing: 0;
}

.workbench-copy p {
  max-width: 620px;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.78;
}

.flow-panel {
  min-height: 380px;
  border: 1px solid var(--home-border);
  border-radius: 8px;
  background:
    linear-gradient(90deg, var(--home-grid) 1px, transparent 1px),
    linear-gradient(0deg, var(--home-grid) 1px, transparent 1px),
    linear-gradient(180deg, var(--home-surface-strong), var(--home-surface-muted));
  background-size: 34px 34px, 34px 34px, 100% 100%;
  box-shadow: var(--home-shadow);
  overflow: hidden;
}

.panel-topbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  min-height: 54px;
  padding: 0 18px;
  border-bottom: 1px solid var(--home-border);
  background: var(--home-control-strong-bg);
  color: var(--vp-c-text-2);
  font-size: 0.84rem;
}

.panel-topbar strong {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  font-weight: 700;
}

.stage-controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  background: var(--home-border);
}

.stage-button {
  min-height: 74px;
  padding: 12px;
  border: 0;
  border-radius: 0;
  background: var(--home-control-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  text-align: left;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.stage-button span {
  display: block;
  margin-bottom: 6px;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
}

.stage-button:hover,
.stage-button:focus-visible,
.stage-button.active {
  background: rgba(var(--brand-rgb), 0.11);
  color: var(--vp-c-text-1);
  outline: none;
}

.stage-button:focus-visible {
  box-shadow: inset 0 0 0 2px var(--vp-c-brand-1);
}

.stage-detail {
  min-height: 250px;
  padding: 26px;
}

.stage-detail-inner {
  max-width: 620px;
}

.stage-kicker {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  font-weight: 700;
}

.stage-detail h3 {
  margin: 12px 0;
  color: var(--vp-c-text-1);
  font-size: 1.8rem;
  line-height: 1.2;
  letter-spacing: 0;
}

.stage-detail p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.98rem;
  line-height: 1.75;
}

.stage-points {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.stage-points span {
  min-height: 34px;
  padding: 7px 10px;
  border: 1px solid var(--home-border);
  border-radius: 8px;
  background: var(--home-control-bg);
  color: var(--vp-c-text-1);
  font-size: 0.86rem;
  font-weight: 700;
}

.impact-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 6px 0 0;
}

.impact-item {
  min-height: 136px;
  padding: 18px;
  border: 1px solid var(--home-border);
  border-radius: 8px;
  background: var(--home-surface);
  box-shadow: var(--home-card-shadow);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.impact-item:hover {
  transform: translateY(-3px);
  border-color: var(--home-border-strong);
  box-shadow: var(--home-card-shadow-hover);
}

.impact-item span {
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
  font-weight: 700;
}

.impact-item strong {
  display: block;
  margin: 10px 0 8px;
  color: var(--vp-c-text-1);
  font-family: 'Varela Round', sans-serif;
  font-size: 1.42rem;
  letter-spacing: 0;
}

.impact-item p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

:global(html.dark) .home-experience,
:global(.dark) .home-experience {
  --home-surface: rgba(15, 23, 42, 0.74);
  --home-surface-strong: rgba(15, 23, 42, 0.92);
  --home-surface-muted: rgba(8, 17, 31, 0.9);
  --home-border: rgba(var(--brand-rgb), 0.18);
  --home-border-strong: rgba(103, 232, 249, 0.32);
  --home-shadow: 0 18px 44px rgba(2, 6, 23, 0.3);
  --home-grid: rgba(103, 232, 249, 0.08);
  --home-control-bg: rgba(15, 23, 42, 0.86);
  --home-control-strong-bg: rgba(15, 23, 42, 0.94);
  --home-action-bg: rgba(56, 189, 248, 0.12);
  --home-card-shadow: 0 16px 36px rgba(2, 6, 23, 0.28);
  --home-card-shadow-hover: 0 20px 42px rgba(2, 6, 23, 0.38);
}

:global(html.dark) .panel-topbar,
:global(.dark) .panel-topbar,
:global(html.dark) .stage-button,
:global(.dark) .stage-button {
  background: rgba(15, 23, 42, 0.82);
}

:global(html.dark) .stage-button:hover,
:global(.dark) .stage-button:hover,
:global(.dark) .stage-button:focus-visible,
:global(html.dark) .stage-button:focus-visible,
:global(html.dark) .stage-button.active,
:global(.dark) .stage-button.active {
  background: rgba(56, 189, 248, 0.14);
}

:global(html.dark) .stage-points span,
:global(.dark) .stage-points span {
  background: rgba(15, 23, 42, 0.72);
}

@media (max-width: 960px) {
  .home-experience {
    width: min(100% - 32px, 100%);
    padding-bottom: 36px;
  }

  .workbench-band {
    grid-template-columns: 1fr;
    padding: 24px 0 18px;
  }

  .workbench-copy,
  .flow-panel {
    min-height: auto;
  }

  .impact-strip,
  .stage-controls {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 560px) {
  .home-experience {
    width: min(100% - 24px, 100%);
    padding-bottom: 32px;
  }

  .workbench-copy h2 {
    font-size: 1.7rem;
  }

  .flow-panel,
  .impact-item {
    border-radius: 8px;
  }

  .stage-detail {
    min-height: 0;
    padding: 22px 18px;
  }

  .stage-detail h3 {
    font-size: 1.42rem;
  }

}

@media (prefers-reduced-motion: reduce) {
  .stage-button,
  .impact-item,
  .panel-fade-enter-active,
  .panel-fade-leave-active {
    transition: none;
  }
}
</style>
