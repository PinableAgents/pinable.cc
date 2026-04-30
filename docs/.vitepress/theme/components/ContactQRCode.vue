<template>
  <section class="qrcode-section">
    <div class="qrcode-container">
      <div v-for="item in qrcodes" :key="item.id" class="qrcode-card">
        <div class="qrcode-image-wrapper">
          <img :src="item.image" :alt="item.title" class="qrcode-image" />
        </div>
        <h3 class="qrcode-title">{{ item.title }}</h3>
        <p class="qrcode-description">{{ item.description }}</p>
        <a href="javascript:void(0)" class="qrcode-action">{{ item.tip }}</a>
      </div>
    </div>
  </section>
</template>

<script setup>
const qrcodes = [
  {
    id: 'gongzhonghao',
    image: '/assets/qrcodes/weixin-gongzhonghao.jpg',
    title: '微信公众号',
    description: '了解产品最新动态',
    tip: '扫码关注'
  },
  {
    id: 'qun',
    image: '/assets/qrcodes/weixin-qun.png',
    title: '微信群',
    description: '加入用户交流群',
    tip: '扫码加入'
  },
  {
    id: 'haoma',
    image: '/assets/qrcodes/weixin-haoma.png',
    title: '微信号',
    description: '私聊咨询与购买',
    tip: '扫码添加'
  }
]
</script>

<style scoped>
.qrcode-section {
  --qrcode-card-bg: var(--ui-panel);
  --qrcode-card-border: var(--ui-border);
  --qrcode-card-shadow: var(--ui-shadow);
  --qrcode-card-shadow-hover: 0 18px 34px rgba(37, 99, 235, 0.13);
  --qrcode-image-bg:
    linear-gradient(90deg, var(--ui-grid-line) 1px, transparent 1px),
    linear-gradient(0deg, var(--ui-grid-line) 1px, transparent 1px),
    rgba(var(--brand-rgb), 0.06);
  --qrcode-action-bg: rgba(var(--brand-rgb), 0.1);
  padding: 0;
}

.qrcode-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  padding: 0;
  max-width: 1040px;
  margin: 0 auto;
}

.qrcode-card {
  text-align: center;
  padding: 1.35rem 1.2rem 1.25rem;
  border-radius: 8px;
  background: var(--qrcode-card-bg);
  border: 1px solid var(--qrcode-card-border);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: var(--qrcode-card-shadow);
}

.qrcode-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--qrcode-card-shadow-hover);
  border-color: var(--ui-border-strong);
}

.qrcode-image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.15rem;
  background: var(--qrcode-image-bg);
  background-size: 28px 28px, 28px 28px, 100% 100%;
  padding: 1rem;
  border: 1px solid var(--qrcode-card-border);
  border-radius: 8px;
}

.qrcode-image {
  width: 220px;
  height: 220px;
  object-fit: contain;
  background: transparent;
}

.qrcode-title {
  margin: 1.15rem 0 0.55rem;
  font-size: 1.18rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: 0;
  font-family: 'Varela Round', sans-serif;
}

.qrcode-description {
  color: var(--vp-c-text-2);
  margin: 0.35rem 0 1.1rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.qrcode-action {
  display: inline-block;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 800;
  padding: 0.72rem 1rem;
  border-radius: 8px;
  background: var(--qrcode-action-bg);
  transition: all 0.25s ease;
  cursor: pointer;
}

.qrcode-action:hover {
  color: var(--vp-c-brand-1);
  background: rgba(var(--brand-rgb), 0.16);
}

:global(html.dark) .qrcode-section,
:global(.dark) .qrcode-section {
  --qrcode-card-bg: rgba(15, 23, 42, 0.76);
  --qrcode-card-border: rgba(var(--brand-rgb), 0.18);
  --qrcode-card-shadow: 0 16px 36px rgba(2, 6, 23, 0.26);
  --qrcode-card-shadow-hover: 0 20px 42px rgba(2, 6, 23, 0.36);
  --qrcode-image-bg:
    linear-gradient(90deg, rgba(103, 232, 249, 0.08) 1px, transparent 1px),
    linear-gradient(0deg, rgba(103, 232, 249, 0.08) 1px, transparent 1px),
    rgba(56, 189, 248, 0.1);
  --qrcode-action-bg: rgba(56, 189, 248, 0.14);
  background: transparent;
}

:global(html.dark) .qrcode-card,
:global(.dark) .qrcode-card {
  background: var(--qrcode-card-bg);
  border-color: var(--qrcode-card-border);
  box-shadow: var(--qrcode-card-shadow);
}

:global(html.dark) .qrcode-image-wrapper,
:global(.dark) .qrcode-image-wrapper {
  background: var(--qrcode-image-bg);
  background-size: 28px 28px, 28px 28px, 100% 100%;
  border-color: var(--qrcode-card-border);
}

:global(html.dark) .qrcode-action,
:global(.dark) .qrcode-action {
  background: var(--qrcode-action-bg);
}

@media (max-width: 1024px) {
  .qrcode-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .qrcode-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0;
  }

  .qrcode-card {
    padding: 1.35rem 1.1rem;
  }

  .qrcode-image-wrapper {
    padding: 1.2rem;
  }

  .qrcode-image {
    width: 200px;
    height: 200px;
  }

  .qrcode-title {
    font-size: 1.15rem;
  }
}

@media (max-width: 480px) {
  .qrcode-card {
    padding: 1.2rem 1rem;
  }

  .qrcode-image {
    width: 160px;
    height: 160px;
  }

  .qrcode-title {
    font-size: 1rem;
  }

  .qrcode-description {
    font-size: 0.9rem;
  }
}
</style>
