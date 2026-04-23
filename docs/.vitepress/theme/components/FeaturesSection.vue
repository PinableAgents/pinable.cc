<template>
  <section class="features-section">
    <div class="features-container">
      <div v-for="(feature, index) in features" :key="index" class="feature-card">
        <div class="feature-icon" v-html="feature.icon"></div>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-details">{{ feature.details }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 18 10 18 14 10 19 10 11 3 5.5"></polygon></svg>',
    title: '多角色协作编排',
    details: '围绕研发流程设计，支持产品、设计、开发、测试等多角色协作与工作流编排。'
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24M1 12h6m6 0h6m-1.78 7.78l-4.24-4.24m-5.08 0l-4.24 4.24"></path></svg>',
    title: '并行任务编排',
    details: '支持任务依赖、并发执行与失败聚合，适合多步骤流水线。'
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    title: '消息网关联动',
    details: '支持将消息通道与终端任务联动，实现远程触发与回传。'
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h8v8H6zM14 6h4c1.1 0 2 .9 2 2v4h-6zM6 14h6v4H8c-1.1 0-2-.9-2-2zM14 14h4v4c0 1.1-.9 2-2 2h-2z"></path></svg>',
    title: '模块与工作流管理',
    details: '桌面端提供安装、更新、卸载、创建模块与工作流执行入口。'
  }
]
</script>

<style scoped>
.features-section {
  padding: 12px 0 20px;
  --feature-card-bg: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 245, 249, 0.94) 100%);
  --feature-card-border: rgba(var(--brand-rgb), 0.12);
  --feature-card-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 18px 44px rgba(59, 130, 246, 0.08);
  --feature-card-shadow-hover: 0 18px 36px rgba(37, 99, 235, 0.14);
  --feature-card-border-hover: rgba(125, 211, 252, 0.88);
  --feature-icon-bg: linear-gradient(135deg, rgba(14, 165, 233, 0.16), rgba(59, 130, 246, 0.14));
  --feature-title-color: var(--vp-c-text-1);
  --feature-details-color: var(--vp-c-text-2);
}

.features-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 0 24px;
  max-width: 1180px;
  margin: 0 auto;
}

.feature-card {
  text-align: left;
  padding: 1.6rem;
  border-radius: 24px;
  background: var(--feature-card-bg);
  border: 1px solid var(--feature-card-border);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: var(--feature-card-shadow);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--feature-card-shadow-hover);
  border-color: var(--feature-card-border-hover);
}

.feature-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 1.5rem;
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.85rem;
  border-radius: 18px;
  background: var(--feature-icon-bg);
}

.feature-icon :deep() svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.feature-title {
  margin: 0 0 0.75rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--feature-title-color);
  letter-spacing: -0.5px;
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
  --feature-card-bg: linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.74) 100%);
  --feature-card-border: rgba(var(--brand-rgb), 0.18);
  --feature-card-shadow:
    inset 0 1px 0 rgba(148, 163, 184, 0.08),
    0 18px 40px rgba(2, 6, 23, 0.24);
  --feature-card-shadow-hover: 0 20px 42px rgba(8, 145, 178, 0.18);
  --feature-card-border-hover: rgba(103, 232, 249, 0.34);
  --feature-icon-bg: linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(37, 99, 235, 0.16));
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
    padding: 8px 0 16px;
  }

  .features-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 16px;
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
  .features-container {
    padding: 0 14px;
    gap: 1rem;
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
</style>
