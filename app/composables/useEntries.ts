import type { BlogCollectionItem, InsightsCollectionItem } from '@nuxt/content'

/** Drafts are visible while developing (`pnpm dev`) and excluded from builds. */
export const showDrafts = import.meta.dev

export type EntryType = 'article' | 'case-study'

/** One item of the What-we-think feed: a blog article or a case study. */
export type FeedEntry =
  | (BlogCollectionItem & { type: 'article' })
  | (InsightsCollectionItem & { type: 'case-study' })

export const entryLabel = (e: FeedEntry) => e.type === 'article' ? 'Article' : e.kind

function published<T extends { draft?: boolean }>(items: T[]) {
  return showDrafts ? items : items.filter(i => !i.draft)
}

/** Articles + case studies, newest first (drafts only in dev). */
export function useInsightsFeed(options: { limit?: number } = {}) {
  return useAsyncData(`insights-feed-${options.limit ?? 'all'}`, async () => {
    const [articles, studies] = await Promise.all([
      queryCollection('blog').order('date', 'DESC').all(),
      queryCollection('insights').order('date', 'DESC').all(),
    ])
    const feed: FeedEntry[] = [
      ...published(articles).map(a => ({ ...a, type: 'article' as const })),
      ...published(studies).map(s => ({ ...s, type: 'case-study' as const })),
    ].sort((a, b) => b.date.localeCompare(a.date))
    return options.limit ? feed.slice(0, options.limit) : feed
  })
}

/** The article or case study at `path`; 404s if missing (or a draft, in builds). */
export async function useInsightEntry(path: string) {
  const { data } = await useAsyncData(`insight-${path}`, async () => {
    const [article, study] = await Promise.all([
      queryCollection('blog').path(path).first(),
      queryCollection('insights').path(path).first(),
    ])
    if (article) return { ...article, type: 'article' as const } as FeedEntry
    if (study) return { ...study, type: 'case-study' as const } as FeedEntry
    return null
  })
  if (!data.value || (data.value.draft && !showDrafts)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }
  // Snapshot: Nuxt clears async data when the page is left, but the old page is
  // still rendered during the out-in transition and must keep its entry.
  return shallowRef(data.value) as Readonly<Ref<FeedEntry>>
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
