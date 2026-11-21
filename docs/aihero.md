---
title: AIHero 学习资源
description: PinableLab 整理的 AI 学习资料入口，区分第三方资源与本站内容。
sidebar: false
---

<script setup lang="ts">
import { learningResources } from './.vitepress/theme/learning-resources'
</script>

# AIHero 学习资源

从模型原理到实际工作流，这里收录可直接阅读的 AI 学习资料。下方为已核验的外部资源，不是 PinableLab 自有课程或博客。

<ul class="lab-resource-list">
  <li v-for="resource in learningResources" :key="resource.href">
    <a :href="resource.href" rel="noreferrer">{{ resource.title }}</a>
    <span>{{ resource.author }} · {{ resource.topic }} · 外部资源</span>
    <p>{{ resource.description }}</p>
  </li>
</ul>
