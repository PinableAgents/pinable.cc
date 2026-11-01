<script setup>
const year = new Date().getFullYear()

const links = [
  { text: '产品', href: '/about' },
  { text: '功能', href: '/#capabilities' },
  { text: '下载', href: '/downloads' },
  { text: '联系我们', href: '/contact' },
  { text: 'GitHub', href: 'https://github.com/PinableAgents', rel: 'noreferrer' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="sf-inner">
      <div class="sf-top">
        <div class="sf-brand">
          <a href="/" class="sf-logo">
            <img src="/assets/images/logo.png" alt="" width="24" height="24">
            PinableAgents
          </a>
          <p class="sf-desc">把 AI 研发变成可验证的交付。</p>
        </div>

        <nav aria-label="页脚导航">
          <ul class="sf-links">
            <li v-for="link in links" :key="link.text">
              <a :href="link.href" :rel="link.rel">{{ link.text }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="sf-bottom">
        <span class="sf-copy">© {{ year }} PinableAgents · PinableLab</span>
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
  padding: 40px 0 28px;
}

/* Top row: brand left, links right */
.sf-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--vp-c-border);
}

.sf-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  letter-spacing: 0;
  margin-bottom: 8px;
}

.sf-logo img {
  display: block;
  width: 24px;
  height: 24px;
}

.sf-desc {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--vp-c-text-3);
}

.sf-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sf-links li {
  margin: 0;
}

.sf-links a {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color var(--pa-transition);
}

.sf-links a:hover {
  color: var(--vp-c-text-1);
}

/* Bottom row */
.sf-bottom {
  padding-top: 20px;
}

.sf-copy {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

/* Responsive */
@media (max-width: 768px) {
  .sf-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
