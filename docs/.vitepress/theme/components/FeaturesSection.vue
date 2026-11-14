<script setup>
import {
  A2A_ROLES,
  CORE_PLATFORMS,
  DELIVERY_STAGES,
  DESKTOP_PLATFORMS,
  EXPERIMENTAL_BACKENDS,
  GATEWAY_CHANNELS,
  MCP_HARNESSES,
  MODULES,
  STABLE_BACKENDS,
} from '../lib/productFacts.js'

/**
 * Capability matrix — the dense grid near the end of the landing page.
 *
 * Entries are grouped by where the capability lives rather than by how it
 * sounds, and each one names something concrete (a flag, a protocol, a count)
 * so the grid reads as an inventory, not as adjectives.
 */
const backendList = STABLE_BACKENDS.join('、')
const experimentalEngineLabel = EXPERIMENTAL_BACKENDS
  .map((backend) => (backend === 'deepseek' ? 'DeepSeek' : backend))
  .join('、')
const stageChain = DELIVERY_STAGES.join(' → ')
const gatewayList = GATEWAY_CHANNELS.join('、')
const moduleSummary = MODULES.map((module) => `${module.name} ${module.version}`).join('、')
const harnessList = MCP_HARNESSES.join('、')
const a2aRoleList = A2A_ROLES.join('、')

const features = [
  {
    group: 'Runtime',
    title: '四个内置 AI 后端统一调度',
    details: `${backendList} 在同一控制面配置，按任务指定 --backend 与 --model；${experimentalEngineLabel} 实验引擎首期只在定时任务页执行。`,
  },
  {
    group: 'Runtime',
    title: 'Provider 与算力池',
    details: 'Provider、模型集中管理；受管 CLIProxyAPI 按需启用，密钥账号不外散。',
  },
  {
    group: 'Execution',
    title: '并行编排与 worktree 隔离',
    details: '--parallel 读入 ---TASK--- 块并按 dependencies 排序；--worktree 让每个任务在独立 worktree 中执行。',
  },
  {
    group: 'Execution',
    title: '内置终端与远程服务器',
    details: '多 Tab PTY 终端，本机与 SSH 服务器统一接入，服务器命令经 Guard 规则检查。',
  },
  {
    group: 'Delivery',
    title: '可验证交付',
    details: `${stageChain}；评审与合入由宿主执行，证据与时间线留痕。`,
  },
  {
    group: 'Delivery',
    title: '项目事项与自动执行',
    details: '同一目标跨多次交付；本地验收、推送、变更请求、上线四种完成终点；模板、自动规则与按事项预算。',
  },
  {
    group: 'Delivery',
    title: '经验内核',
    details: '从任务与纠正中采集候选经验，脱敏评审后入库，按上下文召回并验证效果。',
  },
  {
    group: 'Surface',
    title: '网关、定时任务与静态站',
    details: `${gatewayList} 三个通道接入任务；周期任务按计划执行；本机静态站点直接发布。`,
  },
  {
    group: 'Surface',
    title: '内置与外部 MCP',
    details: `codegraph 提供 8 个只读代码工具，remote-servers 提供远程执行；${harnessList} 开箱可用，外部 MCP 可在界面集中管理。`,
  },
  {
    group: 'Surface',
    title: '可安装模块',
    details: `${moduleSummary}，五个模块按需安装，支持依赖排序。`,
  },
  {
    group: 'Surface',
    title: 'A2A 对外协作',
    details: `五个内置角色：${a2aRoleList}；调用凭据按 Agent 与 Skill 授权。`,
  },
  {
    group: 'Desktop',
    title: `${DESKTOP_PLATFORMS.join(' 与 ')} 桌面集成`,
    details: `菜单栏或系统托盘常驻、任务完成通知、独立查看窗口、⌘K / Ctrl+K 与 pinable:// 链接；${CORE_PLATFORMS.join('、')} 运行包不含桌面界面。`,
  },
]
</script>

<template>
  <section id="capabilities" class="features-section" aria-labelledby="features-title" data-rail-label="能力清单">
    <div class="features-header">
      <span class="landing-eyebrow">Capabilities</span>
      <h2 id="features-title">能力清单，按它实际所在的位置排列。</h2>
      <p>
        下面每一条都对应产品里一个真实可用的入口或命令。
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
