interface Point { x: number, y: number, vx: number, vy: number, r: number }

/**
 * Full-viewport particle network that links nearby points and the cursor.
 * Returns a cleanup function that stops the loop and removes listeners.
 */
export function startParticles(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const mouse = { x: -9999, y: -9999 }
  let W = 0
  let H = 0
  let pts: Point[] = []
  let raf: number | null = null

  function build() {
    W = window.innerWidth
    H = window.innerHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    const count = Math.max(24, Math.min(80, Math.round(W * H / 15000)))
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 0.6,
    }))
  }

  // Lines are grouped into a few opacity buckets so each frame issues a
  // handful of stroke() calls instead of one per pair. Visually equivalent,
  // but far cheaper on low-end devices.
  const BUCKETS = 6
  const linkPaths: Path2D[] = []
  const mousePaths: Path2D[] = []

  function frame() {
    ctx!.clearRect(0, 0, W, H)
    for (let k = 0; k < BUCKETS; k++) {
      linkPaths[k] = new Path2D()
      mousePaths[k] = new Path2D()
    }
    const dots = new Path2D()

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i]!
      a.x += a.vx
      a.y += a.vy
      if (a.x < 0 || a.x > W) a.vx *= -1
      if (a.y < 0 || a.y > H) a.vy *= -1
      dots.moveTo(a.x + a.r, a.y)
      dots.arc(a.x, a.y, a.r, 0, 6.283)

      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j]!
        const dx = a.x - b.x
        const dy = a.y - b.y
        const d = dx * dx + dy * dy
        if (d < 12000) {
          const path = linkPaths[Math.min(BUCKETS - 1, Math.floor((1 - d / 12000) * BUCKETS))]!
          path.moveTo(a.x, a.y)
          path.lineTo(b.x, b.y)
        }
      }
      const mx = a.x - mouse.x
      const my = a.y - mouse.y
      const md = mx * mx + my * my
      if (md < 22000) {
        const path = mousePaths[Math.min(BUCKETS - 1, Math.floor((1 - md / 22000) * BUCKETS))]!
        path.moveTo(a.x, a.y)
        path.lineTo(mouse.x, mouse.y)
      }
    }

    ctx!.fillStyle = 'rgba(169,139,255,0.55)'
    ctx!.fill(dots)
    ctx!.lineWidth = 1
    for (let k = 0; k < BUCKETS; k++) {
      const strength = (k + 0.5) / BUCKETS
      ctx!.strokeStyle = 'rgba(94,23,235,' + strength * 0.22 + ')'
      ctx!.stroke(linkPaths[k]!)
      ctx!.strokeStyle = 'rgba(169,139,255,' + strength * 0.5 + ')'
      ctx!.stroke(mousePaths[k]!)
    }
    raf = requestAnimationFrame(frame)
  }

  const start = () => { if (!raf) raf = requestAnimationFrame(frame) }
  const pause = () => { if (raf) { cancelAnimationFrame(raf); raf = null } }
  const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
  const onOut = (e: MouseEvent) => { if (!e.relatedTarget) { mouse.x = -9999; mouse.y = -9999 } }
  const onVisibility = () => (document.hidden ? pause() : start())

  window.addEventListener('resize', build)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseout', onOut)
  document.addEventListener('visibilitychange', onVisibility)
  build()
  // Defer the animation until the page has loaded and the main thread is idle.
  const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200))
  let cancelled = false
  const begin = () => idle(() => { if (!cancelled && !document.hidden) start() })
  if (document.readyState === 'complete') begin()
  else window.addEventListener('load', begin, { once: true })

  return () => {
    cancelled = true
    window.removeEventListener('load', begin)
    pause()
    window.removeEventListener('resize', build)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseout', onOut)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
