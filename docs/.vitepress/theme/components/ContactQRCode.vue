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
  padding: 0;
}

.qrcode-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  padding: 0;
  max-width: none;
  margin: 0 auto;
}

.qrcode-card {
  text-align: center;
  padding: 1.65rem 1.3rem 1.45rem;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 245, 249, 0.94) 100%);
  border: 1px solid rgba(var(--brand-rgb), 0.12);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 18px 42px rgba(59, 130, 246, 0.08);
}

.qrcode-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 32px rgba(37, 99, 235, 0.14);
  border-color: rgba(125, 211, 252, 0.88);
}

.qrcode-image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, rgba(240, 249, 255, 0.94), rgba(255, 255, 255, 0.7));
  padding: 1rem;
  border-radius: 18px;
}

.qrcode-image {
  width: 240px;
  height: 240px;
  object-fit: contain;
  background: transparent;
}

.qrcode-title {
  margin: 1.5rem 0 0.75rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.5px;
  font-family: 'Varela Round', sans-serif;
}

.qrcode-description {
  color: var(--vp-c-text-2);
  margin: 0.5rem 0 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.qrcode-action {
  display: inline-block;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.72rem 1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.16), rgba(59, 130, 246, 0.14));
  transition: all 0.25s ease;
  cursor: pointer;
}

.qrcode-action:hover {
  color: var(--vp-c-brand-1);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(37, 99, 235, 0.18));
}

:global(.dark) .qrcode-section {
  background: transparent;
}

:global(.dark) .qrcode-card {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.74) 100%);
  border-color: rgba(var(--brand-rgb), 0.18);
  box-shadow:
    inset 0 1px 0 rgba(148, 163, 184, 0.08),
    0 18px 40px rgba(2, 6, 23, 0.24);
}

:global(.dark) .qrcode-image-wrapper {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.14), rgba(37, 99, 235, 0.18));
}

@media (max-width: 1024px) {
  .qrcode-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
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
