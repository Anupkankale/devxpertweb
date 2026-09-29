import type { gsap as GSAP } from 'gsap'

/** Stagger (seconds) per `data-reveal` group. */
const groups: Record<string, number> = {
  head: 0,
  give: 0.09,
  block: 0.06,
  proj: 0.09,
  timeline: 0.08,
  contact: 0.05,
  faq: 0.06,
  card: 0.08,
}

/**
 * Scroll-triggered GSAP reveals for `data-reveal="<group>"` elements.
 * (The hero entrance is pure CSS; see `[data-hero-reveal]` in main.css.)
 * Runs after every page render; elements stay hidden via `.anim-ready`
 * until revealed, and are shown immediately if GSAP fails to load.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let ctx: ReturnType<typeof GSAP.context> | undefined

  async function run() {
    const root = document.documentElement
    if (!root.classList.contains('anim-ready')) return

    try {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx?.revert()
      ctx = gsap.context(() => {
        for (const [group, stagger] of Object.entries(groups)) {
          const els = gsap.utils.toArray<HTMLElement>(`[data-reveal="${group}"]`)
          if (!els.length) continue
          gsap.set(els, { y: 24 })
          ScrollTrigger.batch(els, {
            start: 'top 92%',
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger, overwrite: true }),
          })
        }
      })
      ScrollTrigger.refresh()
    }
    catch {
      // GSAP failed to load: show everything rather than leave it hidden.
      root.classList.remove('anim-ready')
    }
  }

  nuxtApp.hook('page:finish', () => { requestAnimationFrame(() => { run() }) })
})
