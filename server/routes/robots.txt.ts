export default defineEventHandler((event) => {
  const { siteUrl, indexable } = useRuntimeConfig(event).public
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  // Staging / preview builds: keep everything out of search and answer engines.
  if (!indexable) return 'User-agent: *\nDisallow: /\n'

  // Search engines and AI answer engines (GPTBot, ClaudeBot, PerplexityBot…) are all welcome.
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})
