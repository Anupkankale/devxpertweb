import type { Crumb } from './usePageSeo'

/**
 * Loads one blog post / insight by the current route and wires its SEO:
 * meta tags, BlogPosting/Article JSON-LD, breadcrumbs and prev/next links.
 */
export async function useArticle<C extends 'blog' | 'insights'>(collection: C, crumbs: Crumb[]) {
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  const ids = useSchemaIds()
  const path = route.path.replace(/\/$/, '')

  const [entry, { data: all }] = await Promise.all([
    useEntry(collection, path),
    useEntries(collection),
  ])

  const index = computed(() => (all.value ?? []).findIndex(e => e.path === path))
  const prev = computed(() => index.value > 0 ? all.value![index.value - 1] : null)
  const next = computed(() => index.value >= 0 ? all.value![index.value + 1] ?? null : null)
  const trail = computed(() => [...crumbs, { label: entry.value.title, to: path }])

  // Composables after an await need the Nuxt context restored.
  nuxtApp.runWithContext(() => usePageSeo(() => ({
    title: entry.value.title,
    description: entry.value.description,
    crumbs: trail.value,
    article: {
      published: entry.value.date,
      modified: 'updated' in entry.value ? entry.value.updated : undefined,
      tags: 'tags' in entry.value ? entry.value.tags ?? [] : undefined,
    },
    nodes: () => [{
      '@type': collection === 'blog' ? 'BlogPosting' : 'Article',
      '@id': `${ids.siteUrl}${path}#article`,
      'headline': entry.value.title,
      'description': entry.value.description,
      'datePublished': entry.value.date,
      'dateModified': ('updated' in entry.value && entry.value.updated) || entry.value.date,
      'author': { '@id': ids.person },
      'publisher': { '@id': ids.org },
      'image': `${ids.siteUrl}/og-image.png`,
      'mainEntityOfPage': { '@id': `${ids.siteUrl}${path}#webpage` },
      'inLanguage': 'en',
      ...('tags' in entry.value && entry.value.tags?.length ? { keywords: entry.value.tags.join(', ') } : {}),
      ...(entry.value.readingTime ? { timeRequired: `PT${entry.value.readingTime}M` } : {}),
    }],
  })))

  if (entry.value.draft) nuxtApp.runWithContext(() => useSeoMeta({ robots: 'noindex, nofollow' }))

  return { entry, prev, next, trail }
}
