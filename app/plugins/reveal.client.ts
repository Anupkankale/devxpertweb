/** Stagger (seconds) between items of the same `data-reveal` group entering together. */
const stagger: Record<string, number> = {
  head: 0,
  give: 0.09,
  block: 0.06,
  proj: 0.09,
  timeline: 0.08,
  contact: 0.05,
  faq: 0.06,
  card: 0.08,
}

const PENDING = '[data-reveal]:not([data-shown])'

/**
 * Scroll reveals: `data-reveal="<group>"` elements stay hidden (see main.css)
 * until they enter the viewport, then get `data-shown`, which plays a CSS
 * entrance.
 *
 * A MutationObserver picks up reveal elements whenever they're inserted
 * (first load, page navigation, v-if, async data), so nothing depends on
 * the timing of page or transition hooks. IntersectionObserver never touches
 * the scroll position, so this can't interfere with scroll restoration.
 */
export default defineNuxtPlugin(() => {
  const root = document.documentElement
  if (!root.classList.contains('anim-ready')) return

  const show = (el: HTMLElement, delay = 0) => {
    el.style.animationDelay = `${delay}s`
    el.setAttribute('data-shown', '')
  }

  if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) {
    document.querySelectorAll<HTMLElement>(PENDING).forEach(el => show(el))
    return
  }

  const io = new IntersectionObserver((entries) => {
    const counts: Record<string, number> = {}
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const el = entry.target as HTMLElement
      const group = el.dataset.reveal ?? ''
      const index = counts[group] = (counts[group] ?? -1) + 1
      show(el, index * (stagger[group] ?? 0.06))
      io.unobserve(el)
    }
  }, { rootMargin: '0px 0px -8% 0px' })

  const observed = new WeakSet<Element>()
  const scan = () => {
    document.querySelectorAll<HTMLElement>(PENDING).forEach((el) => {
      if (observed.has(el)) return
      observed.add(el)
      io.observe(el)
    })
  }

  // Batch DOM changes into one scan per frame; stop observing removed elements.
  let queued = false
  new MutationObserver((records) => {
    for (const record of records) {
      record.removedNodes.forEach((node) => {
        if (!(node instanceof Element)) return
        const els = node.matches('[data-reveal]') ? [node, ...node.querySelectorAll('[data-reveal]')] : node.querySelectorAll('[data-reveal]')
        els.forEach((el) => {
          io.unobserve(el)
          observed.delete(el)
        })
      })
    }
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      scan()
    })
  }).observe(document.body, { childList: true, subtree: true })

  scan()
})
