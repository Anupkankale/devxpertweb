<script setup lang="ts">
import type { EntryType } from '~/composables/useEntries'

const [{ data: page }, { data: feed }] = await Promise.all([usePageContent('insights'), useInsightsFeed()])
const ids = useSchemaIds()
const route = useRoute()
const crumbs = [{ label: 'What we think', to: '/what-we-think' }]

const filters: { label: string, type?: EntryType }[] = [
  { label: 'All' },
  { label: 'Articles', type: 'article' },
  { label: 'Case studies', type: 'case-study' },
]
const active = computed(() => filters.find(f => f.type === route.query.type)?.type)
const entries = computed(() => (feed.value ?? []).filter(e => !active.value || e.type === active.value))
const available = computed(() => filters.filter(f => !f.type || feed.value?.some(e => e.type === f.type)))

usePageSeo(() => page.value && {
  title: page.value.seoTitle,
  description: page.value.seoDescription,
  schemaType: ['CollectionPage', 'Blog'],
  crumbs,
  nodes: () => [{
    '@type': 'ItemList',
    'itemListElement': (feed.value ?? []).filter(e => !e.draft).map((e, i) => ({
      '@type': 'ListItem', 'position': i + 1, 'url': ids.siteUrl + e.path, 'name': e.title,
    })),
  }],
})
useHead({ link: [{ rel: 'alternate', type: 'application/rss+xml', title: 'DevXpert Labs · What we think', href: '/what-we-think/rss.xml' }] })
</script>

<template>
  <div>
    <template v-if="page">
      <UiPageHero v-bind="page" :crumbs="crumbs">
        <div class="flex flex-wrap items-center gap-2">
          <template v-if="available.length > 2">
            <NuxtLink
              v-for="f in available"
              :key="f.label"
              :to="{ path: '/what-we-think', query: f.type ? { type: f.type } : {} }"
              class="rounded-full border px-3.5 py-1.5 font-mono text-[.72rem] transition-colors"
              :class="active === f.type ? 'border-wp bg-wp/15 text-text' : 'border-line text-muted hover:text-text'"
            >{{ f.label }}</NuxtLink>
          </template>
          <a href="/what-we-think/rss.xml" class="ml-auto inline-flex items-center gap-1.5 font-mono text-[.72rem] text-muted hover:text-wp-soft"><UiAppIcon name="rss" class="size-3.5" /> RSS</a>
        </div>
      </UiPageHero>

      <section class="relative z-[1] pb-6" aria-label="Articles and case studies">
        <div class="wrap">
          <div v-if="entries.length" class="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <UiEntryCard
              v-for="(e, i) in entries"
              :key="e.path"
              :to="e.path"
              :title="e.title"
              :description="e.description"
              :date="e.date"
              :kicker="entryLabel(e)"
              :tags="e.type === 'article' ? e.tags : e.services"
              :reading-time="e.readingTime"
              :draft="e.draft"
              :featured="i === 0 && !active"
            />
          </div>
          <div v-else class="rounded-2xl border border-dashed border-line px-8 py-16 text-center">
            <p class="eyebrow justify-center">On the bench</p>
            <h2 class="mt-4 font-display text-[1.6rem] font-semibold">The first write-ups are being written.</h2>
            <p class="mx-auto mt-3 max-w-[44ch] text-muted">Subscribe to the <a href="/what-we-think/rss.xml" class="text-wp-soft underline underline-offset-4">RSS feed</a> to catch them when they ship. Meanwhile, here's what the lab has built.</p>
          </div>
        </div>
      </section>

      <SectionsProjectsSection />
      <SectionsGivingSection />
      <UiCtaBanner title="Want to be the next case study?" />
    </template>
  </div>
</template>
