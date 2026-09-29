/**
 * Loads the What-we-think entry (article or case study) for the current route and
 * wires its SEO: meta tags, BlogPosting/Article JSON-LD, breadcrumbs and
 * newer/older links across the whole What-we-think feed.
 */
export async function useArticle() {
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const ids = useSchemaIds()
  const path = route.path.replace(/\/$/, '')

  const [entry, { data: feed }] = await Promise.all([useInsightEntry(path), useInsightsFeed()])

  const index = computed(() => (feed.value ?? []).findIndex(e => e.path === path))
  const prev = computed(() => index.value > 0 ? feed.value![index.value - 1] : null)
  const next = computed(() => index.value >= 0 ? feed.value![index.value + 1] ?? null : null)
  const trail = computed(() => [{ label: 'What we think', to: '/what-we-think' }, { label: entry.value.title, to: path }])

  const tags = computed(() => entry.value.type === 'article' ? entry.value.tags ?? [] : entry.value.services ?? [])
  const updated = computed(() => entry.value.type === 'article' ? entry.value.updated : undefined)

  // Composables after an await need the Nuxt context restored.
  nuxtApp.runWithContext(() => usePageSeo(() => ({
    title: entry.value.title,
    description: entry.value.description,
    crumbs: trail.value,
    article: { published: entry.value.date, modified: updated.value, tags: tags.value },
    nodes: () => [{
      '@type': entry.value.type === 'article' ? 'BlogPosting' : 'Article',
      '@id': `${ids.siteUrl}${path}#article`,
      'headline': entry.value.title,
      'description': entry.value.description,
      'datePublished': entry.value.date,
      'dateModified': updated.value || entry.value.date,
      'author': { '@id': ids.person },
      'publisher': { '@id': ids.org },
      'image': `${ids.siteUrl}/og-image.png`,
      'mainEntityOfPage': { '@id': `${ids.siteUrl}${path}#webpage` },
      'inLanguage': 'en',
      ...(tags.value.length ? { keywords: tags.value.join(', ') } : {}),
      ...(entry.value.readingTime ? { timeRequired: `PT${entry.value.readingTime}M` } : {}),
    }],
  })))

  if (entry.value.draft) nuxtApp.runWithContext(() => useSeoMeta({ robots: 'noindex, nofollow' }))

  return { entry, prev, next, trail }
}
