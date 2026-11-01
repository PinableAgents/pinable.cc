import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PinableAgents',
  description: '面向超级个体与 AI Power User 的软件交付工作台，统一管理多 AI Runtime 与可安装能力，让个人研发可控、可复用、可追踪。',

  lang: 'zh-CN',
  base: '/',

  appearance: 'light',

  cleanUrls: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@500;600;700&display=swap' }],
    ['script', { async: '', src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3137049467355939', crossorigin: 'anonymous' }],
  ],

  themeConfig: {
    logo: '/assets/images/logo.png',
    siteTitle: 'PinableAgents',

    nav: [
      { text: '首页', link: '/' },
      { text: '产品', link: '/about' },
      { text: '功能', link: '/#capabilities' },
      { text: '下载', link: '/downloads' },
      { text: '联系', link: '/contact' },
    ],

    sidebar: {
      '/': [
        {
          text: '快速链接',
          items: [
            { text: '首页', link: '/' },
            { text: '产品', link: '/about' },
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
