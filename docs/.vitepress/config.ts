import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'PinableLab',
  description: 'PinableLab 官方网站，提供个人 AI 工作台、团队协作、游戏研发流程和 AI 学习资源。',

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
    siteTitle: 'PinableLab',

    nav: [
      { text: '首页', link: '/' },
      { text: '个人工作台', link: '/about' },
      { text: '团队工作台', link: '/#loop' },
      { text: '游戏研发', link: '/#game-dev' },
      { text: 'AI 学习', link: '/aihero' },
      { text: '下载', link: '/downloads' },
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
      message: '工具与方法，服务真实的研发。',
      copyright: 'Copyright © 2026 PinableLab',
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
