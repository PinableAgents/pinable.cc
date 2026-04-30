import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import FunctionCarousel from './components/FunctionCarousel.vue'
import ContactQRCode from './components/ContactQRCode.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import HomeExperience from './components/HomeExperience.vue'
import './style.css'

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
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(AdSlot),
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('FunctionCarousel', FunctionCarousel)
    app.component('ContactQRCode', ContactQRCode)
    app.component('FeaturesSection', FeaturesSection)
    app.component('HomeExperience', HomeExperience)
  },
} satisfies Theme
