import type { RouterConfig } from '@nuxt/schema'

/**
 * Scroll handling:
 * - first load / refresh: leave the position alone; the inline script in app.vue
 *   already restored it before the app booted (no jump from the top).
 * - back/forward: jump (not smooth-scroll) to the saved position once the new page is in.
 * - hash links: smooth-scroll to the anchor (scroll-padding clears the sticky header).
 * - everything else: start at the top.
 */
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (!from.matched.length) return false

    if (to.path === from.path) {
      return to.hash ? { el: to.hash, behavior: 'smooth' } : false
    }

    const nuxtApp = useNuxtApp()
    const router = useRouter()
    return new Promise((resolve) => {
      const scroll = () => requestAnimationFrame(() => {
        if (router.currentRoute.value.fullPath !== to.fullPath) return resolve(false) // navigated again meanwhile
        if (savedPosition) resolve({ ...savedPosition, behavior: 'instant' })
        else if (to.hash) resolve({ el: to.hash, behavior: 'smooth' })
        else resolve({ top: 0, behavior: 'instant' })
      })
      // Same timing as Nuxt's default: once the new page has loaded and the
      // out-in transition has finished, so the page is at its full height.
      nuxtApp.hooks.hookOnce('page:loading:end', () => {
        const transition = (nuxtApp as unknown as { '~transitionPromise'?: Promise<void> })['~transitionPromise']
        if (transition) transition.then(scroll)
        else scroll()
      })
    })
  },
}
