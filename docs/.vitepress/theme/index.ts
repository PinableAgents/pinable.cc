import { h } from 'vue'
import { useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import FunctionCarousel from './components/FunctionCarousel.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HomeExperience from './components/HomeExperience.vue'
import HeroDownloads from './components/HeroDownloads.vue'
import HeroMeta from './components/HeroMeta.vue'
import SectionRail from './components/SectionRail.vue'
import SectionShell from './components/SectionShell.vue'

// tokens defines; docs and landing consume. Order is load-bearing.
import './tokens.css'
import './docs.css'
import './landing.css'

const AdSlot = () => {
  return h('div', { class: 'ad-slot-container' }, [
    h('ins', {
      class: 'adsbygoogle',
      style: 'display:block',
      'data-ad-client': 'ca-pub-3137049467355939',
      'data-ad-slot': '9080158217',
      'data-ad-format': 'auto',
      'data-full-width-responsive': 'true',
    }),
    h('script', {}, '(adsbygoogle = window.adsbygoogle || []).push({})'),
  ])
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    // about.md and contact.md also use `layout: home`, so these hero slots fire
    // on all three pages.
    const route = useRoute()
    const isLanding = () => route.path === '/'

    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(AdSlot),
      // Download buttons are landing-only: /about and /contact carry their own
      // navigation actions in frontmatter instead.
      'home-hero-actions-after': () => (isLanding() ? h(HeroDownloads) : null),
      // The meta strip is generic product fact (backends, platforms, run root),
      // so it renders on all three — that keeps the three heroes structurally
      // identical instead of ending differently per page.
      'home-hero-after': () => h(HeroMeta),
      // Finds its own sections in the DOM and hides itself on short pages, so
      // it needs no route gating — /contact renders nothing.
      'layout-bottom': () => h(SectionRail),
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('FunctionCarousel', FunctionCarousel)
    app.component('FeaturesSection', FeaturesSection)
    app.component('HomeExperience', HomeExperience)
    app.component('SectionShell', SectionShell)
  },
} satisfies Theme
