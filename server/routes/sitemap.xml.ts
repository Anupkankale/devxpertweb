import { queryCollection } from '@nuxt/content/server'

/** Static pages; long-form entries are added from their collections. */
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/about/what-we-do', priority: '0.9', changefreq: 'monthly' },
  { path: '/about/who-we-are', priority: '0.8', changefreq: 'monthly' },
  { path: '/about/insights', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
]

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const today = new Date().toISOString().slice(0, 10)

  const [posts, insights] = await Promise.all([
    queryCollection(event, 'blog').where('draft', '=', false).order('date', 'DESC').all(),
    queryCollection(event, 'insights').where('draft', '=', false).order('date', 'DESC').all(),
  ])

  const urls = [
    ...STATIC_PAGES.map(p => ({ ...p, lastmod: today })),
    ...[...posts, ...insights].map(e => ({
      path: e.path,
      lastmod: ('updated' in e && e.updated) || e.date,
      changefreq: 'yearly',
      priority: '0.6',
    })),
  ]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${siteUrl}${u.path}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
})
