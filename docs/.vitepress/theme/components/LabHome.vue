<script setup lang="ts">
const pillars = [
  {
    id: 'desktop',
    name: 'Pinable Desktop',
    description: '面向个人的 AI 研发工作台。',
    href: '/about',
    link: '了解产品',
  },
  {
    id: 'loop',
    name: 'LoopForge',
    description: '面向团队的 AI 研发工作台，暂未开放。',
  },
  {
    id: 'game-dev',
    name: '游戏研发',
    description: '从游戏原型到资产与构建。',
    status: '含 Pinable Art · 暂未开放',
  },
  {
    id: 'aihero',
    name: 'AIHero',
    description: 'AI 学习资源整理，暂未开放。',
  },
] as const
</script>

<template>
  <div class="lab-home">
    <section class="lab-hero" aria-labelledby="lab-title">
      <div class="lab-wrap lab-hero-inner">
        <div class="lab-hero-copy">
          <h1 id="lab-title">让 AI 参与<br>真实研发。</h1>
          <p class="lab-lead">PinableLab 为开发者和团队做 AI 研发工具。</p>
          <a id="download" class="lab-button" href="/downloads">下载 Pinable Desktop</a>
        </div>
        <div class="lab-preview">
          <img src="/assets/functions/4-workflow-tasks.png" alt="Pinable Desktop 的工作流任务界面局部" fetchpriority="high">
        </div>
      </div>
    </section>

    <section id="capabilities" class="lab-wrap lab-products" aria-label="产品与学习">
      <article v-for="pillar in pillars" :id="pillar.id" :key="pillar.id"
        class="lab-card" :class="{ 'lab-card-featured': pillar.id === 'desktop' }">
        <h2>{{ pillar.name }}</h2>
        <p>{{ pillar.description }}</p>
        <a v-if="'href' in pillar" :href="pillar.href" :aria-label="pillar.name + '：' + pillar.link">{{ pillar.link }}</a>
        <span v-else-if="'status' in pillar" class="lab-status">{{ pillar.status }}</span>
      </article>
    </section>
  </div>
</template>

<style src="../lab-home.css"></style>
