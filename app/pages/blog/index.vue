<script setup lang="ts">
const [{ data: page }, { data: posts }] = await Promise.all([usePageContent('blog'), useEntries('blog')])
const ids = useSchemaIds()

const route = useRoute()
const activeTag = computed(() => typeof route.query.tag === 'string' ? route.query.tag : null)
const tags = computed(() => [...new Set((posts.value ?? []).flatMap(p => p.tags ?? []))].sort())
const filtered = computed(() => (posts.value ?? []).filter(p => !activeTag.value || p.tags?.includes(activeTag.value)))

usePageSeo(() => page.value && {
  title: page.value.seoTitle,
  description: page.value.seoDescription,
  schemaType: ['CollectionPage', 'Blog'],
  crumbs: [{ label: 'Blog', to: '/blog' }],
  nodes: () => [{
    '@type': 'ItemList',
    'itemListElement': (posts.value ?? []).filter(p => !p.draft).map((p, i) => ({
      '@type': 'ListItem', 'position': i + 1, 'url': ids.siteUrl + p.path, 'name': p.title,
    })),
  }],
})
useHead({ link: [{ rel: 'alternate', type: 'application/rss+xml', title: 'DevXpert Labs blog', href: '/blog/rss.xml' }] })
</script>

<template>
  <div>
    <template v-if="page">
      <UiPageHero v-bind="page" :crumbs="[{ label: 'Blog', to: '/blog' }]">
        <div class="flex flex-wrap items-center gap-2">
          <template v-if="tags.length">
            <NuxtLink
              to="/blog"
              class="rounded-full border px-3.5 py-1.5 font-mono text-[.72rem] transition-colors"
              :class="!activeTag ? 'border-wp bg-wp/15 text-text' : 'border-line text-muted hover:text-text'"
            >All</NuxtLink>
            <NuxtLink
              v-for="tag in tags"
              :key="tag"
              :to="{ path: '/blog', query: { tag } }"
              class="rounded-full border px-3.5 py-1.5 font-mono text-[.72rem] transition-colors"
              :class="activeTag === tag ? 'border-wp bg-wp/15 text-text' : 'border-line text-muted hover:text-text'"
            >{{ tag }}</NuxtLink>
          </template>
          <a href="/blog/rss.xml" class="ml-auto inline-flex items-center gap-1.5 font-mono text-[.72rem] text-muted hover:text-wp-soft"><UiAppIcon name="rss" class="size-3.5" /> RSS</a>
        </div>
      </UiPageHero>

      <section class="relative z-[1] pb-10" aria-label="Posts">
        <div class="wrap">
          <div v-if="filtered.length" class="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <UiEntryCard
              v-for="(post, i) in filtered"
              :key="post.path"
              :to="post.path"
              :title="post.title"
              :description="post.description"
              :date="post.date"
              :tags="post.tags"
              :reading-time="post.readingTime"
              :draft="post.draft"
              :featured="i === 0 && !activeTag"
            />
          </div>
          <div v-else class="rounded-2xl border border-dashed border-line px-8 py-16 text-center">
            <p class="eyebrow justify-center">On the bench</p>
            <h2 class="mt-4 font-display text-[1.6rem] font-semibold">The first posts are being written.</h2>
            <p class="mx-auto mt-3 max-w-[44ch] text-muted">Subscribe to the <a href="/blog/rss.xml" class="text-wp-soft underline underline-offset-4">RSS feed</a> to catch them when they ship.</p>
          </div>
        </div>
      </section>

      <UiCtaBanner />
    </template>
  </div>
</template>
