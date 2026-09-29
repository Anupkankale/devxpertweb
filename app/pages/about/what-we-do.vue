<script setup lang="ts">
const [{ data: page }, { data: site }, { data: lists }] = await Promise.all([
  usePageContent('what-we-do'),
  useSite(),
  useAsyncData('what-we-do', () => Promise.all([
    queryCollection('stack').order('order', 'ASC').all(),
    queryCollection('process').order('order', 'ASC').all(),
    queryCollection('sections').where('stem', '=', 'sections/process').first(),
  ])),
])
const services = computed(() => lists.value?.[0] ?? [])
const steps = computed(() => lists.value?.[1] ?? [])
const processHead = computed(() => lists.value?.[2])
const ids = useSchemaIds()

usePageSeo(() => page.value && {
  title: page.value.seoTitle,
  description: page.value.seoDescription,
  crumbs: [{ label: 'About', to: '/about' }, { label: 'What we do', to: '/about/what-we-do' }],
  nodes: () => [{
    '@type': 'ItemList',
    'name': 'Services',
    'itemListElement': services.value.map((s, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': { '@type': 'Service', 'name': s.title, 'description': s.body, 'provider': { '@id': ids.org }, 'areaServed': 'Worldwide' },
    })),
  }],
})
</script>

<template>
  <div>
    <template v-if="page">
      <UiPageHero v-bind="page" :crumbs="[{ label: 'About', to: '/about' }, { label: 'What we do', to: '/about/what-we-do' }]">
        <UiBaseButton href="/contact">Discuss a project →</UiBaseButton>
      </UiPageHero>

      <section class="relative z-[1] pb-16" aria-label="Services">
        <div class="wrap grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          <UiBaseCard v-for="s in services" :key="s.id" tag="article" class="p-8" data-reveal="card">
            <span class="font-mono text-[.72rem] tracking-[.1em] text-wp-soft">{{ String(s.order).padStart(2, '0') }}</span>
            <h2 class="mb-3 mt-5 font-display text-[1.35rem] font-semibold">{{ s.title }}</h2>
            <p class="m-0 text-muted">{{ s.body }}</p>
          </UiBaseCard>
        </div>
      </section>

      <UiSectionShell id="process" :eyebrow="processHead?.eyebrow" :title="processHead?.title" :lead="processHead?.lead">
        <ol class="m-0 grid list-none grid-cols-4 gap-px overflow-hidden rounded-[14px] border border-line-soft bg-line-soft p-0 max-md:grid-cols-2 max-[520px]:grid-cols-1">
          <li v-for="step in steps" :key="step.id" class="bg-panel px-6 pb-8 pt-7" data-reveal="block">
            <span class="grid size-9 place-items-center rounded-lg bg-wp/15 font-mono text-[.8rem] text-wp-soft">{{ step.order }}</span>
            <h3 class="mb-2 mt-5 font-display text-[1.1rem] font-medium">{{ step.title }}</h3>
            <p class="m-0 text-[.94rem] text-muted">{{ step.body }}</p>
          </li>
        </ol>
      </UiSectionShell>

      <section v-if="site" class="relative z-[1] pb-6" aria-labelledby="tools-title">
        <div class="wrap">
          <h2 id="tools-title" class="eyebrow mb-5">Tools & expertise</h2>
          <ul class="m-0 flex list-none flex-wrap gap-2.5 p-0">
            <li v-for="t in site.person.knowsAbout" :key="t" class="rounded-full border border-line px-4 py-2 font-mono text-[.76rem] text-muted">{{ t }}</li>
          </ul>
        </div>
      </section>

      <UiCtaBanner title="Got a problem worth solving?" />
    </template>
  </div>
</template>
