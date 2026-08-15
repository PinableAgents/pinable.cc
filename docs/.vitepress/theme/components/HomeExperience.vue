<template>
  <div class="home-experience">
    <section class="workbench-band" aria-labelledby="workbench-title">
      <div class="workbench-copy">
        <span class="section-label">个人 AI 工作台</span>
        <h2 id="workbench-title">把 AI 能力放进可验证、可复用的个人交付链路。</h2>
        <p>
          PinableAgents 统一管理多 AI Runtime、可安装能力与本地交付，让超级个体从一次性问答转向持续可复用的研发系统。
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
    title: '统一 Runtime',
    kicker: 'Control',
    signal: 'Provider / Runtime / Capability',
    body: '在同一工作台配置多个 AI Provider、模型与本地 Runtime，管理 Skill、MCP、Plugin 等可安装能力，减少重复维护。',
    points: ['配置集中', '能力可复用', '入口一致']
  },
  {
    step: '02',
    title: '可验证交付',
    kicker: 'Delivery',
    signal: 'Worktree · Evidence · Approval',
    body: '以本地 Git 仓库为载体，在隔离 worktree 中执行交付，沉淀证据、检查与审批记录，让 AI 变更可追溯。',
    points: ['隔离 worktree', '证据沉淀', '审批留痕']
  },
  {
    step: '03',
    title: '网关联动',
    kicker: 'Gateway',
    signal: 'Message / Schedule trigger',
    body: '接入飞书、微信、Telegram 与定时任务，从消息触发到执行回传形成个人自动化闭环。',
    points: ['消息触发', '执行回传', '定时任务']
  },
  {
    step: '04',
    title: '经验复用',
    kicker: 'Experience',
    signal: 'Experience recall',
    body: '从任务与交付中采集候选经验，经脱敏评审进入复用库，按上下文召回并持续验证使用效果。',
    points: ['候选采集', '评审入库', '按需召回']
  }
]

const metrics = [
  {
    label: '从多个 AI 工具到统一工作台',
    value: '1 个控制面',
    text: 'Provider、能力、任务与历史不再分散。'
  },
  {
    label: '从一次性问答到可验证交付',
    value: '全程可追踪',
    text: '证据、检查、审批都留痕可回看。'
  },
  {
    label: '从零散提示到个人经验资产',
    value: '可复用内核',
    text: 'Workflow、模块与经验都能沉淀复用。'
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
