import type { PageCollections } from '@nuxt/content'

type Entry = 'blog' | 'insights'

/** Drafts are visible while developing (`pnpm dev`) and excluded from builds. */
export const showDrafts = import.meta.dev

/** Published entries of a long-form collection, newest first. */
export function useEntries<C extends Entry>(collection: C, options: { limit?: number, key?: string } = {}) {
  return useAsyncData(options.key ?? `${collection}-list-${options.limit ?? 'all'}`, () => {
    let query = queryCollection(collection).order('date', 'DESC')
    if (!showDrafts) query = query.where('draft', '=', false)
    if (options.limit) query = query.limit(options.limit)
    return query.all() as Promise<PageCollections[C][]>
  })
}

/** A single entry by route path; 404s for missing (or, in builds, draft) entries. */
export async function useEntry<C extends Entry>(collection: C, path: string) {
  const { data } = await useAsyncData(`${collection}-${path}`, () =>
    queryCollection(collection).path(path).first() as Promise<PageCollections[C] | null>)
  const item = data.value as { draft?: boolean } | null
  if (!item || (item.draft && !showDrafts)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }
  return data as Ref<PageCollections[C]>
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
