import { queryCollection } from '@nuxt/content/server'

/**
 * llms.txt (https://llmstxt.org): a plain-markdown summary of the site for
 * AI answer engines, generated from the same content files as the page.
 */
export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const [site, stack, projects, contributions, faq, posts, insights] = await Promise.all([
    queryCollection(event, 'site').first(),
    queryCollection(event, 'stack').order('order', 'ASC').all(),
    queryCollection(event, 'projects').order('order', 'ASC').all(),
    queryCollection(event, 'contributions').order('order', 'ASC').all(),
    queryCollection(event, 'faq').order('order', 'ASC').all(),
    queryCollection(event, 'blog').where('draft', '=', false).order('date', 'DESC').all(),
    queryCollection(event, 'insights').where('draft', '=', false).order('date', 'DESC').all(),
  ])
  if (!site) throw createError({ statusCode: 500, statusMessage: 'Missing site content' })

  const out = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is run by ${site.person.name}, ${site.person.jobTitle} based in ${site.organization.city}, India (${site.person.url}).`,
    '',
    '## Pages',
    '',
    `- [Home](${siteUrl}/): overview of the lab`,
    `- [What we do](${siteUrl}/about/what-we-do): services and how the lab works`,
    `- [Who we are](${siteUrl}/about/who-we-are): the developer behind the lab`,
    `- [Insights](${siteUrl}/about/insights): case studies, projects and contributions`,
    `- [Blog](${siteUrl}/blog): articles ([RSS](${siteUrl}/blog/rss.xml))`,
    `- [Contact](${siteUrl}/contact): project enquiries`,
    '',
    '## What the lab builds',
    '',
    ...stack.map(s => `- **${s.title}**: ${s.body}`),
    '',
    '## Projects',
    '',
    ...projects.map(p => `- [${p.title}](${p.link?.href ?? siteUrl}): ${p.body}`),
    '',
    '## Open-source contributions',
    '',
    ...contributions.map(c => `- [${c.title}](${c.link.href}): ${c.body}`),
    '',
    ...(insights.length ? ['## Case studies', '', ...insights.map(e => `- [${e.title}](${siteUrl}${e.path}): ${e.description ?? ''}`), ''] : []),
    ...(posts.length ? ['## Blog posts', '', ...posts.map(e => `- [${e.title}](${siteUrl}${e.path}): ${e.description ?? ''}`), ''] : []),
    '## FAQ',
    '',
    ...faq.flatMap(f => [`### ${f.question}`, '', f.answer, '']),
    '## Contact',
    '',
    `- Website: ${siteUrl}`,
    `- Email: ${site.organization.email}`,
    `- Phone / WhatsApp: ${site.organization.telephone}`,
    ...site.person.sameAs.map(u => `- ${u}`),
    '',
  ]

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return out.join('\n')
})
