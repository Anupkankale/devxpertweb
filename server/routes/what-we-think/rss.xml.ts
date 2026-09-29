import { queryCollection } from '@nuxt/content/server'

const escape = (s: string) => s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;' })[c]!)

/** RSS feed of What we think: articles and case studies, newest first. */
export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const [site, articles, studies] = await Promise.all([
    queryCollection(event, 'site').first(),
    queryCollection(event, 'blog').where('draft', '=', false).all(),
    queryCollection(event, 'insights').where('draft', '=', false).all(),
  ])

  const entries = [
    ...articles.map(a => ({ title: a.title, path: a.path, date: a.date, description: a.description, categories: a.tags ?? [] })),
    ...studies.map(s => ({ title: s.title, path: s.path, date: s.date, description: s.description, categories: [s.kind, ...(s.services ?? [])] })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20)

  const items = entries.map(e => `    <item>
      <title>${escape(e.title)}</title>
      <link>${siteUrl}${e.path}</link>
      <guid isPermaLink="true">${siteUrl}${e.path}</guid>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
      <description>${escape(e.description ?? '')}</description>
${e.categories.map(c => `      <category>${escape(c)}</category>`).join('\n')}
    </item>`).join('\n')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site?.name ?? 'DevXpert Labs')} · What we think</title>
    <link>${siteUrl}/what-we-think</link>
    <atom:link href="${siteUrl}/what-we-think/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escape(site?.ogDescription ?? '')}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
})
