import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PinableAgents',
  description: '面向游戏行业的 AI 研发协作平台，统一编排与多后端执行，让功能交付可控、可复用、可追踪。',

  lang: 'zh-CN',
  base: '/',

  cleanUrls: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Varela+Round&family=Nunito+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap' }],
    ['script', { async: '', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3137049467355939', crossorigin: 'anonymous' }],
  ],

  themeConfig: {
    logo: '/assets/images/logo.png',
    siteTitle: 'PinableAgents',

    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about' },
      { text: '联系', link: '/contact' },
    ],

    sidebar: {
      '/': [
        {
          text: '快速链接',
          items: [
            { text: '首页', link: '/' },
            { text: '关于', link: '/about' },
          ]
        },
      ],
      '/wiki/': [
        {
          text: '入门指南',
          items: [
            { text: '快速入门', link: '/wiki/getting-started' },
            { text: '第一个工作流', link: '/wiki/first-workflow' },
            { text: '系统要求', link: '/wiki/system-requirements' },
          ]
        },
        {
          text: '核心引擎',
          items: [
            { text: 'pinable 执行引擎', link: '/wiki/pinable' },
            { text: '会话管理与调度', link: '/wiki/session-management' },
            { text: '多后端 AI 执行', link: '/wiki/multi-backend' },
            { text: '并行任务执行', link: '/wiki/parallel-execution' },
            { text: 'Git Worktree 隔离', link: '/wiki/worktree-isolation' },
          ]
        },
        {
          text: '工作流详解',
          items: [
            { text: 'pinable-auto 自动开发', link: '/wiki/workflow-auto' },
            { text: 'do 工作流', link: '/wiki/workflow-do' },
            { text: 'omo 智能路由编排', link: '/wiki/workflow-omo' },
            { text: 'bmad 企业级敏捷开发', link: '/wiki/workflow-bmad' },
            { text: 'sparv 精确开发', link: '/wiki/workflow-sparv' },
            { text: 'requirements 轻量级流程', link: '/wiki/workflow-requirements' },
            { text: '工作流选择指南', link: '/wiki/workflow-comparison' },
          ]
        },
        {
          text: '技能系统',
          items: [
            { text: 'pinable 多后端执行', link: '/wiki/skill-pinable' },
            { text: 'dev 端到端开发', link: '/wiki/skill-dev' },
            { text: 'harness 长时运行框架', link: '/wiki/skill-harness' },
            { text: 'sync-func 功能同步', link: '/wiki/skill-sync-func' },
            { text: 'code-review 代码审查', link: '/wiki/skill-code-review' },
            { text: 'game-dev-skills 实战', link: '/wiki/game-dev-use-cases' },
          ]
        },
        {
          text: '桌面端',
          items: [
            { text: '模块管理', link: '/wiki/desktop-modules' },
            { text: 'Gateway 多通道网关', link: '/wiki/desktop-gateway' },
            { text: 'Scheduled Tasks 定时任务', link: '/wiki/desktop-scheduled-tasks' },
          ]
        },
        {
          text: '高级进阶',
          items: [
            { text: '智能体系统', link: '/wiki/agent-system' },
            { text: '技能系统', link: '/wiki/skill-system' },
            { text: '质量门控', link: '/wiki/quality-gates' },
            { text: '团队协作最佳实践', link: '/wiki/best-practices-team' },
            { text: '常见问题与排错', link: '/wiki/troubleshooting' },
          ]
        },
      ],
    },

    search: {
      provider: 'local',
      options: {
        detailedView: true,
      }
    },

    footer: {
      message: 'Workflows / Orchestration / Execution',
      copyright: 'Copyright © 2026 PinableAgents · PinableLab',
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: false,
  },

  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
})
