<script setup>
const year = new Date().getFullYear()

const columns = [
  {
    label: 'Product',
    links: [
      { text: 'Runtime', href: '/#runtime' },
      { text: 'Orchestration', href: '/#orchestration' },
      { text: 'Delivery', href: '/#delivery' },
      { text: 'Experience', href: '/#experience' },
      { text: 'Capabilities', href: '/#capabilities' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { text: '产品介绍', href: '/about' },
      { text: '下载', href: '/downloads' },
      { text: 'Roadmap', href: '/#roadmap' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { text: '联系我们', href: '/contact' },
      { text: 'GitHub', href: 'https://github.com/PinableAgents', rel: 'noreferrer' },
    ],
  },
]
</script>

<template>
  <footer class="site-footer">
    <div class="sf-inner">
      <div class="sf-top">
        <div class="sf-brand">
          <a href="/" class="sf-logo">PinableAgents</a>
          <p class="sf-desc">把 AI 研发变成可验证的交付。<br>四个后端统一调度，每次变更都留痕。</p>
        </div>

        <nav class="sf-cols" aria-label="页脚导航">
          <div v-for="col in columns" :key="col.label" class="sf-col">
            <span class="sf-col-label">{{ col.label }}</span>
            <ul class="sf-col-links">
              <li v-for="link in col.links" :key="link.text">
                <a :href="link.href" :rel="link.rel">{{ link.text }}</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="sf-bottom">
        <span class="sf-copy">© {{ year }} PinableAgents · PinableLab</span>
        <span class="sf-tagline">Workflows · Orchestration · Execution</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}

.sf-inner {
  width: min(var(--pa-page-width), 100% - var(--pa-gutter));
  margin: 0 auto;
  padding: 56px 0 32px;
}

/* Top row: brand left, columns right */
.sf-top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 64px;
  align-items: start;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--vp-c-border);
}

.sf-logo {
  display: inline-block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  letter-spacing: 0;
  margin-bottom: 12px;
}

.sf-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--vp-c-text-3);
  max-width: 28ch;
}

/* Columns */
.sf-cols {
  display: flex;
  gap: 56px;
}

.sf-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 100px;
}

.sf-col-label {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.sf-col-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sf-col-links li {
  margin: 0;
}

.sf-col-links a {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color var(--pa-transition);
}

.sf-col-links a:hover {
  color: var(--vp-c-text-1);
}

/* Bottom row */
.sf-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 28px;
}

.sf-copy {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

.sf-tagline {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

/* Responsive */
@media (max-width: 768px) {
  .sf-top {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .sf-cols {
    gap: 32px;
    flex-wrap: wrap;
  }

  .sf-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
