<script setup lang="ts">
const sections = [
  { id: 'desktop', label: '个人工作台', symbol: 'desktop' },
  { id: 'loop', label: '团队工作台', symbol: 'loop' },
  { id: 'game-dev', label: '游戏研发', symbol: 'game' },
  { id: 'learning', label: 'AI 学习', symbol: 'learning' },
] as const

const gameStages = ['构思与原型', '美术资产', '构建与验证'] as const
</script>

<template>
  <div class="lab-home">
    <section class="lab-hero" aria-labelledby="lab-title">
      <div class="lab-wrap lab-hero-inner">
        <div class="lab-hero-copy">
          <p class="lab-kicker"><span aria-hidden="true"></span> PinableLab 官方网站</p>
          <h1 id="lab-title">把 AI 用在<br><em>真实的研发里。</em></h1>
          <p class="lab-lead">从个人工作台到团队协作，从游戏资产到构建验证。PinableLab 做研发工具，也整理一路学到的方法。</p>
          <div id="download" class="lab-actions">
            <a class="lab-button lab-button-primary" href="/downloads">下载 Pinable Desktop</a>
            <a class="lab-button lab-button-secondary" href="#capabilities">探索产品</a>
          </div>
        </div>
        <figure class="lab-preview">
          <div class="lab-preview-bar">
            <span><i aria-hidden="true"></i> Pinable Desktop</span>
            <span>工作流执行</span>
          </div>
          <img src="/assets/functions/4-workflow-tasks.png" alt="Pinable Desktop 中的工作流任务执行界面" fetchpriority="high">
          <figcaption>Pinable Desktop · 产品界面</figcaption>
        </figure>
      </div>
    </section>

    <section id="capabilities" class="lab-wrap lab-products" aria-labelledby="lab-products-title">
      <nav class="lab-section-nav" aria-label="网站板块">
        <a v-for="section in sections" :key="section.id" :href="'#' + section.id">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path v-if="section.symbol === 'desktop'" d="M4 5h16v11H4zM9 20h6m-3-4v4M7 8l2 2-2 2m5 0h4" />
            <path v-else-if="section.symbol === 'loop'" d="M20 10a7 7 0 0 0-12-4L5 9m0-4v4h4m-5 5a7 7 0 0 0 12 4l3-3m0 4v-4h-4" />
            <path v-else-if="section.symbol === 'game'" d="M7 7h10a4 4 0 0 1 4 3.5l.6 4.5a2.5 2.5 0 0 1-4.2 2l-2.2-2h-6l-2.2 2a2.5 2.5 0 0 1-4.2-2l.6-4.5A4 4 0 0 1 7 7zm1 2v4m-2-2h4m6-1h.01m2 2h.01" />
            <path v-else d="M3 5h6a3 3 0 0 1 3 3v12a4 4 0 0 0-3-2H3zm18 0h-6a3 3 0 0 0-3 3v12a4 4 0 0 1 3-2h6z" />
          </svg>
          {{ section.label }}
        </a>
      </nav>

      <header class="lab-section-header">
        <p class="lab-eyebrow">产品与学习</p>
        <h2 id="lab-products-title">从手边的任务开始。</h2>
      </header>

      <article id="desktop" class="lab-card lab-desktop">
        <div class="lab-card-copy">
          <span class="lab-tag lab-tag-live">可下载</span>
          <h3>Pinable Desktop</h3>
          <p class="lab-card-subtitle">面向个人开发者的本地 AI 工作台。</p>
          <p>在一个应用里管理 AI 提供方、终端和工作流。执行过程可回看，变更在审批前可以检查。</p>
          <div class="lab-actions">
            <a class="lab-text-link" href="/about">查看产品能力</a>
            <a class="lab-text-link" href="/downloads">选择下载版本</a>
          </div>
        </div>
        <ul class="lab-desktop-list" aria-label="主要能力">
          <li><strong>集中接入</strong><span>模型、提供方与执行引擎</span></li>
          <li><strong>任务执行</strong><span>终端、工作流与会话</span></li>
          <li><strong>交付复核</strong><span>执行历史、证据与审批</span></li>
        </ul>
      </article>

      <div class="lab-grid">
        <article id="loop" class="lab-card lab-loop">
          <span class="lab-tag">暂未开放</span>
          <h3>Pinable Loop</h3>
          <p class="lab-card-subtitle">团队 AI 工作台</p>
          <p>围绕项目把任务、执行进展与人工确认放到同一条协作链路。项目现名 LoopForge，计划更名为 Pinable Loop。</p>
        </article>
        <article id="game-dev" class="lab-card lab-game">
          <span class="lab-tag">暂未开放</span>
          <h3>游戏研发工作流</h3>
          <p>探索游戏研发中从原型到资产、构建和验证的流程。Pinable Art 面向其中的图像创作和编辑环节。</p>
          <ul class="lab-stage-list" aria-label="研发流程">
            <li v-for="stage in gameStages" :key="stage">{{ stage }}</li>
          </ul>
        </article>
      </div>

      <article id="learning" class="lab-card lab-learning">
        <div class="lab-card-copy">
          <span class="lab-tag">学习资源</span>
          <h3>AIHero</h3>
          <p>持续整理 AI 学习博客和实践资源。已收录 Matt Pocock 的 AI Hero 博客及入门阅读，并明确标注外部来源。</p>
        </div>
        <a class="lab-button lab-button-secondary" href="/aihero">浏览学习资源</a>
      </article>
    </section>
  </div>
</template>

<style src="../lab-home.css"></style>
