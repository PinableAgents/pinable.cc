<script setup>
/**
 * Capability matrix — the dense grid near the end of the landing page.
 *
 * Entries are grouped by where the capability lives rather than by how it
 * sounds, and each one names something concrete (a flag, a protocol, a count)
 * so the grid reads as an inventory, not as adjectives.
 */
const features = [
  {
    group: 'Runtime',
    title: '四个 AI 后端统一调度',
    details: 'codex、claude、antigravity、pi 在同一控制面配置，按任务指定 --backend 与 --model。',
  },
  {
    group: 'Runtime',
    title: 'Provider 与算力池',
    details: '集中管理 Provider、模型与随包 AI 兼容网关，密钥与账号不外散到各个项目。',
  },
  {
    group: 'Execution',
    title: '并行任务编排',
    details: '--parallel 读入 ---TASK--- 块，按 dependencies 排序执行，逐任务指定 workdir、backend 与 skills。',
  },
  {
    group: 'Execution',
    title: 'Git worktree 隔离',
    details: '--worktree 让每个任务在自己的 worktree 中执行，互不踩踏，完成后可单独审阅。',
  },
  {
    group: 'Execution',
    title: '内置终端与远程服务器',
    details: '多 Tab PTY 终端，本机与 SSH 服务器统一接入，危险命令有 Guard 规则拦截。',
  },
  {
    group: 'Delivery',
    title: '可验证交付',
    details: '提交、校验、执行、审批、证据、时间线六段链路，AI 变更全程留痕可回放。',
  },
  {
    group: 'Delivery',
    title: '经验内核',
    details: '从任务与纠正中采集候选经验，脱敏评审后入库，按上下文召回并验证效果。',
  },
  {
    group: 'Surface',
    title: '消息网关与定时任务',
    details: 'telegram、feishu、weixin、weixin_miniapp 四个通道接入，支持后台执行或终端接管。',
  },
  {
    group: 'Surface',
    title: '内置 MCP 与 CodeGraph',
    details: 'codegraph 提供 8 个只读代码图谱工具，另有 remote-servers 与 a2ui 开箱可用。',
  },
  {
    group: 'Surface',
    title: '可安装模块',
    details: 'do、bugfix、image-gen、video-analysis、a2ui、pinable 六个模块按需安装，支持依赖排序。',
  },
  {
    group: 'Surface',
    title: '定时任务与静态站',
    details: '把周期性工作交给调度器，本机静态站点服务直接对外，无需另起一套工具。',
  },
  {
    group: 'Surface',
    title: 'A2A 与外部接入',
    details: '以 Agent Card 与访问凭据对外暴露能力，并发与授权范围可独立控制。',
  },
]
</script>

<template>
  <section class="features-section" aria-labelledby="features-title">
    <div class="features-header">
      <span class="landing-eyebrow">Capabilities</span>
      <h2 id="features-title">能力清单，按它实际所在的位置排列。</h2>
      <p>
        下面每一条都对应产品里一个真实可用的入口或命令。没有占位功能，也没有"即将上线"。
      </p>
    </div>

    <ul class="features-grid">
      <li v-for="feature in features" :key="feature.title" class="feature-card">
        <span class="feature-group">{{ feature.group }}</span>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-details">{{ feature.details }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* The one site-wide measure; see the Layout block in tokens.css. */
.features-section {
  width: min(var(--pa-page-width), 100% - var(--pa-gutter));
  margin: 0 auto;
  padding: 64px 0 88px;
}

.features-header {
  max-width: 62ch;
  margin-bottom: 36px;
}

.features-header h2 {
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
  font-size: clamp(1.625rem, 2.8vw, 2.25rem);
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: 0;
  text-wrap: balance;
}

.features-header p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.75;
}

/* Hairline matrix: the container paints the grid lines, the cells sit on top. */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  padding: 1px;
  list-style: none;
  background: var(--vp-c-border);
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-lg);
  overflow: hidden;
}

.feature-card {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 20px;
  background: var(--vp-c-bg-elv);
  transition: background-color var(--pa-transition);
}

.feature-card:hover {
  background: var(--vp-c-bg-soft);
}

.feature-group {
  margin-bottom: 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.feature-title {
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
}

.feature-details {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.65;
}

@media (max-width: 1200px) {
  .features-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .features-section {
    padding: 48px 0 64px;
  }
}

@media (max-width: 560px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
