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
import SiteFooter from './components/SiteFooter.vue'

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
    const route = useRoute()
    const isLanding = () => route.path === '/'

    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(AdSlot),
      'home-hero-actions-after': () => (isLanding() ? h(HeroDownloads) : null),
      'home-hero-after': () => h(HeroMeta),
      'layout-bottom': () => h('div', null, [h(SectionRail), h(SiteFooter)]),
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('FunctionCarousel', FunctionCarousel)
    app.component('FeaturesSection', FeaturesSection)
    app.component('HomeExperience', HomeExperience)
    app.component('HeroDownloads', HeroDownloads)
    app.component('SectionShell', SectionShell)
  },
} satisfies Theme
