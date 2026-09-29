import tailwindcss from '@tailwindcss/vite'

const GOOGLE_FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: true },

  modules: ['@nuxt/content'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Override per environment, e.g. NUXT_PUBLIC_SITE_URL=https://staging.devxpertlabs.com
      siteUrl: 'https://www.devxpertlabs.com',
      // Set NUXT_PUBLIC_INDEXABLE=false on staging/preview builds to noindex them.
      indexable: true,
      // Web3Forms access key for the contact form (public by design). Set NUXT_PUBLIC_WEB3FORMS_KEY.
      web3formsKey: '',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0B0C0F' },
        { name: 'color-scheme', content: 'dark' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM-friendly site summary' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Fonts load without blocking first paint (font-display: swap handles the switch).
        { rel: 'preload', as: 'style', href: GOOGLE_FONTS },
      ],
      script: [
        // Appended by script (not a managed <link>) so hydration can't reset it.
        { innerHTML: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='${GOOGLE_FONTS}';document.head.appendChild(l)})()` },
      ],
      noscript: [
        { innerHTML: `<link rel="stylesheet" href="${GOOGLE_FONTS}">` },
      ],
    },
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: { theme: 'github-dark', langs: ['php', 'js', 'ts', 'vue', 'bash', 'json', 'css', 'html', 'yaml'] },
        toc: { depth: 3 },
      },
    },
  },

  hooks: {
    // Add a reading-time estimate (minutes) to long-form content.
    'content:file:afterParse'({ file, content, collection }) {
      if (!['blog', 'insights'].includes(collection.name)) return
      const words = String(file.body ?? '').replace(/^---[\s\S]*?---/, '').split(/\s+/).filter(Boolean).length
      content.readingTime = Math.max(1, Math.round(words / 220))
    },
  },

  nitro: {
    prerender: {
      routes: ['/', '/sitemap.xml', '/robots.txt', '/llms.txt', '/what-we-think/rss.xml'],
      crawlLinks: true,
    },
  },
})
