<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { loadReleaseFeed, resolveDownloads } from '../lib/releases.js'
import { detectPlatform } from '../lib/platform.js'

/**
 * Post-download instructions for /downloads: per-platform install steps and
 * the command that verifies the downloaded file against the release manifest.
 *
 * SSR renders the macOS panel only. Platform detection and the feed request
 * both start in onMounted, so the first client frame matches the server and a
 * failed request simply leaves the static fallback filenames in the commands.
 */

const GUIDES = [
  {
    id: 'mac',
    label: 'macOS',
    targetKey: 'darwin',
    fallbackName: 'PinableAgents-mac.dmg',
    steps: [
      '打开 PinableAgents-mac.dmg，把 PinableAgents 拖入「应用程序」。',
      '首次启动若提示无法验证开发者，在「系统设置 → 隐私与安全性」中选择仍要打开。',
      '打开终端，进入下载文件所在目录后运行下面的校验命令。',
    ],
    command: (name) => `shasum -a 256 "${name}"`,
  },
  {
    id: 'windows',
    label: 'Windows',
    targetKey: 'windows',
    fallbackName: 'PinableAgents-win-portable.zip',
    steps: [
      '把 PinableAgents-win-portable.zip 解压到任意目录。',
      '双击 PinableAgents.exe 启动；如果 SmartScreen 拦截，选择「更多信息 → 仍要运行」。',
      '打开 PowerShell，进入下载文件所在目录后运行下面的校验命令。',
    ],
    command: (name) => `Get-FileHash ".\\${name}" -Algorithm SHA256`,
  },
  {
    id: 'linux',
    label: 'Linux Core',
    targetKey: 'linux-core',
    fallbackName: 'pinable-linux-core.tar.gz',
    steps: [
      '解压 pinable-linux-core.tar.gz，例如运行 tar -xzf pinable-linux-core.tar.gz。',
      '进入解压目录，按包内说明启动 Linux Core 运行包。',
      '打开终端，进入下载文件所在目录后运行下面的校验命令。',
    ],
    command: (name) => `sha256sum "${name}"`,
  },
]

const selected = ref('mac')
const feed = ref(null)
const copied = ref({ key: null, ok: false })
let copiedTimer = null

/** Reject names that would break the quoted shell command. */
function safeName(value, fallback) {
  if (typeof value !== 'string') return fallback
  const name = value.trim()
  if (!name || /[\r\n"]/.test(name)) return fallback
  return name
}

const assetNames = computed(() => {
  const resolved = new Map(
    resolveDownloads(feed.value).map((entry) => [entry.key, entry.assetName]),
  )
  return Object.fromEntries(
    GUIDES.map((guide) => [
      guide.id,
      safeName(resolved.get(guide.targetKey), guide.fallbackName),
    ]),
  )
})

const currentGuide = computed(() => {
  const guide = GUIDES.find((item) => item.id === selected.value) ?? GUIDES[0]
  const assetName = assetNames.value[guide.id]
  return { ...guide, assetName, command: guide.command(assetName) }
})

function copyLabel(key, idle = '复制命令') {
  if (copied.value.key !== key) return idle
  return copied.value.ok ? '已复制' : '复制失败'
}

function flashCopied(key, ok) {
  copied.value = { key, ok }
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = { key: null, ok: false }
  }, 1500)
}

function selectPlatform(id) {
  if (selected.value === id) return
  selected.value = id
  copied.value = { key: null, ok: false }
  clearTimeout(copiedTimer)
}

async function copyCommand() {
  const key = selected.value
  try {
    await navigator.clipboard.writeText(currentGuide.value.command)
    flashCopied(key, true)
  } catch {
    // Insecure context or a denied clipboard — report it, never throw.
    flashCopied(key, false)
  }
}

onMounted(async () => {
  selected.value = detectPlatform() ?? 'mac'
  feed.value = await loadReleaseFeed()
})

onUnmounted(() => clearTimeout(copiedTimer))
</script>

<template>
  <div class="install-guide">
    <h2 class="ig-heading">安装与校验</h2>
    <p class="ig-lead">
      下载完成后按对应平台安装；运行前用下面的命令核对文件 SHA-256，确认与下载页发布清单一致。
    </p>

    <div class="ig-tabs" role="group" aria-label="安装指引平台">
      <button
        v-for="guide in GUIDES"
        :key="guide.id"
        type="button"
        class="ig-tab"
        :class="{ 'ig-tab--active': selected === guide.id }"
        :aria-pressed="selected === guide.id"
        @click="selectPlatform(guide.id)"
      >
        {{ guide.label }}
      </button>
    </div>

    <div class="ig-panel" role="region" :aria-label="`${currentGuide.label} 安装步骤`">
      <ol class="ig-steps">
        <li v-for="(step, index) in currentGuide.steps" :key="index" class="ig-step">
          {{ step }}
        </li>
      </ol>

      <div class="ig-verify">
        <p class="ig-verify-title">校验下载文件</p>
        <p class="ig-verify-hint">在终端或 PowerShell 中进入下载目录后运行：</p>
        <div class="ig-command">
          <code class="ig-command-text">{{ currentGuide.command }}</code>
          <button type="button" class="ig-copy" @click="copyCommand">
            {{ copyLabel(selected) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.install-guide {
  max-width: 760px;
}

/* The .install-guide prefix is load-bearing: `.vp-doc .downloads-note p` is
 * (0,2,1) and would otherwise win over a scoped one-class rule. */
.install-guide .ig-heading {
  margin: 0 0 12px;
  font-family: var(--pa-font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.2;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.install-guide .ig-lead {
  margin: 0 0 18px;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.75;
}

.ig-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.ig-tab {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--pa-transition), border-color var(--pa-transition),
    color var(--pa-transition);
}

.ig-tab:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-text-3);
}

.ig-tab--active {
  background: var(--vp-c-neutral);
  border-color: var(--vp-c-neutral);
  color: var(--vp-c-neutral-inverse);
}

.ig-tab:focus-visible,
.ig-copy:focus-visible {
  outline: 2px solid var(--vp-c-neutral);
  outline-offset: 2px;
}

.ig-panel {
  padding: 20px 22px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  background: var(--vp-c-bg-elv);
}

.ig-steps {
  margin: 0;
  padding-left: 1.25rem;
}

.install-guide .ig-step {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9375rem;
  line-height: 1.7;
}

.ig-step + .ig-step {
  margin-top: 8px;
}

.ig-verify {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-border);
}

.install-guide .ig-verify-title {
  margin: 0 0 4px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.06em;
}

.install-guide .ig-verify-hint {
  margin: 0 0 10px;
  color: var(--vp-c-text-3);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.ig-command {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

/* `.vp-doc :not(pre) > code` is (0,2,1) and would add a chip background. */
.install-guide .ig-command-text {
  flex: 1 1 240px;
  min-width: 0;
  margin: 0;
  padding: 9px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius-sm);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.ig-copy {
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: var(--pa-radius);
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.75rem;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--pa-transition), border-color var(--pa-transition);
}

.ig-copy:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-text-3);
}

@media (max-width: 480px) {
  .ig-panel {
    padding: 18px;
  }

  .ig-command-text,
  .ig-copy {
    flex: 1 1 100%;
  }
}
</style>
