<template>
  <section class="features-section" aria-labelledby="features-title">
    <div class="features-header">
      <span>核心能力</span>
      <h2 id="features-title">围绕研发过程，而不是单次对话。</h2>
      <p>PinableAgents 的设计重点是让团队把 AI 研发动作沉淀成可安装、可编排、可触发、可回溯的生产能力。</p>
    </div>
    <div class="features-container">
      <div v-for="(feature, index) in features" :key="index" class="feature-card">
        <div class="feature-icon" v-html="feature.icon"></div>
        <span class="feature-index">{{ feature.index }}</span>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-details">{{ feature.details }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    index: '01',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 18 10 18 14 10 19 10 11 3 5.5"></polygon></svg>',
    title: '多角色协作编排',
    details: '围绕需求、设计、开发、测试等角色组织任务，让协作过程保持清晰边界和统一节奏。'
  },
  {
    index: '02',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6m-1.78 7.78l-4.24-4.24m-5.08 0l-4.24 4.24"></path></svg>',
    title: '并行任务编排',
    details: '支持任务依赖、并发执行与失败聚合，把多步骤研发流水线从人工接力变成系统调度。'
  },
  {
    index: '03',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    title: '消息网关联动',
    details: '将消息通道与终端任务联动，远程触发、执行状态和结果回传都进入同一个协作闭环。'
  },
  {
    index: '04',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h8v8H6zM14 6h4c1.1 0 2 .9 2 2v4h-6zM6 14h6v4H8c-1.1 0-2-.9-2-2zM14 14h4v4c0 1.1-.9 2-2 2h-2z"></path></svg>',
    title: '模块与工作流管理',
    details: '桌面端提供安装、更新、卸载、创建模块和执行入口，让能力分发更接近团队日常工具链。'
  }
]
</script>

<style scoped>
.features-section {
  --feature-card-bg: var(--ui-panel);
  --feature-card-border: var(--ui-border);
  --feature-card-shadow: var(--ui-shadow);
  --feature-card-shadow-hover: 0 18px 40px rgba(37, 99, 235, 0.13);
  --feature-card-border-hover: var(--ui-border-strong);
  --feature-icon-bg: rgba(var(--brand-rgb), 0.1);
  --feature-title-color: var(--vp-c-text-1);
  --feature-details-color: var(--vp-c-text-2);
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 0 0 72px;
}

.features-header {
  max-width: 760px;
  margin-bottom: 20px;
}

.features-header span {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 10px;
  border: 1px solid var(--feature-card-border);
  border-radius: 8px;
  background: rgba(var(--brand-rgb), 0.08);
  color: var(--vp-c-brand-1);
  font-size: 0.78rem;
  font-weight: 800;
}

.features-header h2 {
  margin: 18px 0 12px;
  color: var(--vp-c-text-1);
  font-family: 'Varela Round', sans-serif;
  font-size: 2rem;
  line-height: 1.2;
  letter-spacing: 0;
}

.features-header p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.75;
}

.features-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.feature-card {
  position: relative;
  text-align: left;
  min-height: 228px;
  padding: 18px;
  border-radius: 8px;
  background: var(--feature-card-bg);
  border: 1px solid var(--feature-card-border);
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: var(--feature-card-shadow);
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(var(--brand-rgb), 0.06) 1px, transparent 1px),
    linear-gradient(0deg, rgba(var(--brand-rgb), 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0;
  transition: opacity 0.22s ease;
  pointer-events: none;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--feature-card-shadow-hover);
  border-color: var(--feature-card-border-hover);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 46px;
  height: 46px;
  margin-bottom: 18px;
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.72rem;
  border-radius: 8px;
  background: var(--feature-icon-bg);
}

.feature-icon :deep() svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.feature-index {
  position: absolute;
  top: 18px;
  right: 18px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 0.76rem;
  font-weight: 700;
}

.feature-title {
  margin: 0 0 0.75rem;
  font-size: 1.08rem;
  font-weight: 800;
  color: var(--feature-title-color);
  letter-spacing: 0;
  font-family: 'Varela Round', sans-serif;
}

.feature-details {
  margin: 0;
  font-size: 0.95rem;
  color: var(--feature-details-color);
  line-height: 1.6;
}

:global(html.dark) .features-section,
:global(.dark) .features-section {
  --feature-card-bg: var(--ui-panel);
  --feature-card-border: var(--ui-border);
  --feature-card-shadow: var(--ui-shadow);
  --feature-card-shadow-hover: 0 20px 42px rgba(2, 6, 23, 0.34);
  --feature-card-border-hover: var(--ui-border-strong);
  --feature-icon-bg: rgba(56, 189, 248, 0.14);
  --feature-title-color: #f8fafc;
  --feature-details-color: #94a3b8;
}

@media (max-width: 1200px) {
  .features-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .features-section {
    width: min(100% - 32px, 100%);
    padding-bottom: 56px;
  }

  .features-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .feature-card {
    padding: 1.3rem;
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 1.2rem;
  }

  .feature-title {
    font-size: 1.05rem;
  }

  .feature-details {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .features-section {
    width: min(100% - 24px, 100%);
  }

  .feature-card {
    padding: 1.15rem;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 1rem;
  }

  .feature-title {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }

  .feature-details {
    font-size: 0.8rem;
    line-height: 1.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .feature-card::before {
    transition: none;
  }

  .feature-card:hover {
    transform: none;
  }
}
</style>
