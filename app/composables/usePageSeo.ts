import type { MaybeRefOrGetter } from 'vue'

/** "Blog" -> "Blog · DevXpert Labs"; titles already containing the brand are left alone. */
export function withBrand(title: string) {
  return title.includes('DevXpert Labs') ? title : `${title} · DevXpert Labs`
}

export interface Crumb { label: string, to: string }

interface PageSeoOptions {
  title: string
  description: string
  /** schema.org type(s) of this page, e.g. 'AboutPage', 'ContactPage', 'CollectionPage' */
  schemaType?: string | string[]
  /** Breadcrumb trail after Home, e.g. [{ label: 'About', to: '/about' }] */
  crumbs?: Crumb[]
  /** @id of the entity this page is primarily about */
  mainEntity?: string
  article?: { published: string, modified?: string, tags?: string[] }
  /** Extra JSON-LD nodes for this page (FAQPage, BlogPosting…) */
  nodes?: () => object[]
}

/**
 * Per-page meta tags + page-level JSON-LD (WebPage, BreadcrumbList and any
 * extra nodes). Site-wide entities come from useBaseSchema() in app.vue.
 */
export function usePageSeo(options: MaybeRefOrGetter<PageSeoOptions | null | undefined>) {
  const ids = useSchemaIds()
  const route = useRoute()
  const url = computed(() => ids.siteUrl + (route.path === '/' ? '/' : route.path.replace(/\/$/, '')))
  const opts = computed(() => toValue(options))

  useSeoMeta({
    title: () => opts.value?.title,
    description: () => opts.value?.description,
    ogTitle: () => opts.value && withBrand(opts.value.title),
    ogDescription: () => opts.value?.description,
    twitterTitle: () => opts.value && withBrand(opts.value.title),
    twitterDescription: () => opts.value?.description,
    ogType: () => opts.value?.article ? 'article' : 'website',
    articlePublishedTime: () => opts.value?.article?.published,
    articleModifiedTime: () => opts.value?.article?.modified ?? opts.value?.article?.published,
    articleTag: () => opts.value?.article?.tags,
  })

  const graph = computed(() => {
    const o = opts.value
    if (!o) return null
    const pageId = `${url.value}#webpage`
    const crumbs = [{ label: 'Home', to: '/' }, ...(o.crumbs ?? [])]
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': o.schemaType ?? 'WebPage',
          '@id': pageId,
          'url': url.value,
          'name': withBrand(o.title),
          'description': o.description,
          'inLanguage': 'en',
          'isPartOf': { '@id': ids.website },
          'about': { '@id': ids.org },
          ...(o.mainEntity ? { mainEntity: { '@id': o.mainEntity } } : {}),
          ...(crumbs.length > 1 ? { breadcrumb: { '@id': `${url.value}#breadcrumb` } } : {}),
        },
        ...(crumbs.length > 1
          ? [{
              '@type': 'BreadcrumbList',
              '@id': `${url.value}#breadcrumb`,
              'itemListElement': crumbs.map((c, i) => ({
                '@type': 'ListItem',
                'position': i + 1,
                'name': c.label,
                'item': ids.siteUrl + (c.to === '/' ? '/' : c.to),
              })),
            }]
          : []),
        ...(o.nodes?.() ?? []),
      ],
    }
  })

  useHead({
    script: [{ key: 'ld-page', type: 'application/ld+json', innerHTML: () => graph.value ? JSON.stringify(graph.value) : '' }],
  })

  return { url }
}

/** Page hero + SEO copy from content/pages/<key>.yml */
export function usePageContent(key: string) {
  return useAsyncData(`page-${key}`, () => queryCollection('pages').where('stem', '=', `pages/${key}`).first())
}
