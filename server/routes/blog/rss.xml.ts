import { queryCollection } from '@nuxt/content/server'

const escape = (s: string) => s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;' })[c]!)

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const [site, posts] = await Promise.all([
    queryCollection(event, 'site').first(),
    queryCollection(event, 'blog').where('draft', '=', false).order('date', 'DESC').limit(20).all(),
  ])

  const items = posts.map(p => `    <item>
      <title>${escape(p.title)}</title>
      <link>${siteUrl}${p.path}</link>
      <guid isPermaLink="true">${siteUrl}${p.path}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escape(p.description ?? '')}</description>
${(p.tags ?? []).map(t => `      <category>${escape(t)}</category>`).join('\n')}
    </item>`).join('\n')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site?.name ?? 'DevXpert Labs')} · Blog</title>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escape(site?.ogDescription ?? '')}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
})
