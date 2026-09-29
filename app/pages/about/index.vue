<script setup lang="ts">
const { nav } = useAppConfig()
const [{ data: page }, { data: site }] = await Promise.all([usePageContent('about'), useSite()])

const sections = computed(() => nav.items.find(i => i.to === '/about')?.children ?? [])
const facts = computed(() => site.value
  ? [
      { k: 'Based in', v: `${site.value.organization.city}, India` },
      { k: 'Core contributor', v: 'WordPress 7.0 "Armstrong"' },
      { k: 'Free plugin', v: 'Live on WordPress.org · 5 stars' },
      { k: 'Foundations', v: '5 years of Computer Science' },
    ]
  : [])

usePageSeo(() => page.value && {
  title: page.value.seoTitle,
  description: page.value.seoDescription,
  schemaType: ['AboutPage', 'CollectionPage'],
  crumbs: [{ label: 'About', to: '/about' }],
})
</script>

<template>
  <div>
    <template v-if="page">
      <UiPageHero v-bind="page" :crumbs="[{ label: 'About', to: '/about' }]" />

      <section class="relative z-[1] pb-10" aria-label="About sections">
        <div class="wrap grid grid-cols-3 gap-5 max-md:grid-cols-1">
          <UiBaseCard v-for="(s, i) in sections" :key="s.to" tag="article" class="group relative p-8" data-reveal="card">
            <span class="font-mono text-[.72rem] tracking-[.1em] text-wp-soft">{{ String(i + 1).padStart(2, '0') }}</span>
            <h2 class="mt-5 font-display text-[1.5rem] font-semibold">
              <NuxtLink :to="s.to" class="after:absolute after:inset-0 after:content-['']">{{ s.label }}</NuxtLink>
            </h2>
            <p class="mb-8 mt-2 flex-1 text-muted">{{ s.description }}</p>
            <span class="inline-flex items-center gap-1.5 font-mono text-[.8rem] text-wp-soft">Explore <UiAppIcon name="arrow-right" class="size-3.5 transition-transform group-hover:translate-x-1" /></span>
          </UiBaseCard>
        </div>
      </section>

      <section class="relative z-[1] py-14" aria-labelledby="glance-title">
        <div class="wrap">
          <h2 id="glance-title" class="eyebrow mb-6">At a glance</h2>
          <dl class="m-0 grid grid-cols-4 gap-px overflow-hidden rounded-[14px] border border-line-soft bg-line-soft max-md:grid-cols-2 max-[480px]:grid-cols-1">
            <div v-for="f in facts" :key="f.k" class="bg-panel px-6 py-6" data-reveal="block">
              <dt class="font-mono text-[.7rem] uppercase tracking-[.12em] text-muted">{{ f.k }}</dt>
              <dd class="m-0 mt-2 font-display text-[1.1rem] font-medium">{{ f.v }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <UiCtaBanner />
    </template>
  </div>
</template>
