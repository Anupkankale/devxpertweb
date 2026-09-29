<script setup lang="ts">
const [{ data: page }, { data: site }, { data: about }] = await Promise.all([
  usePageContent('who-we-are'),
  useSite(),
  useAsyncData('about', () => queryCollection('about').first()),
])
const ids = useSchemaIds()

usePageSeo(() => page.value && {
  title: page.value.seoTitle,
  description: page.value.seoDescription,
  schemaType: ['AboutPage', 'ProfilePage'],
  crumbs: [{ label: 'About', to: '/about' }, { label: 'Who we are', to: '/about/who-we-are' }],
  mainEntity: ids.person,
})
</script>

<template>
  <div>
    <template v-if="page && site">
      <UiPageHero v-bind="page" :crumbs="[{ label: 'About', to: '/about' }, { label: 'Who we are', to: '/about/who-we-are' }]" />

      <section class="relative z-[1] pb-10" aria-label="The story">
        <div class="wrap grid grid-cols-[1.4fr_1fr] items-start gap-12 max-md:grid-cols-1">
          <ContentRenderer v-if="about" :value="about" class="prose-lab" data-reveal="card" />

          <aside class="rounded-2xl border border-line bg-panel p-8 md:sticky md:top-24" data-reveal="card" aria-label="Profile">
            <div class="grid size-16 place-items-center rounded-2xl bg-wp/15 font-display text-2xl font-semibold text-wp-soft" aria-hidden="true">AK</div>
            <h2 class="mt-5 font-display text-[1.4rem] font-semibold">{{ site.person.name }}</h2>
            <p class="m-0 mt-1 text-muted">{{ site.person.jobTitle }}</p>
            <p class="mt-3 flex items-center gap-2 font-mono text-[.74rem] text-muted"><UiAppIcon name="pin" class="size-3.5 text-wp-soft" /> {{ site.organization.city }}, India</p>
            <ul class="m-0 mt-6 list-none space-y-2 border-t border-line-soft p-0 pt-6">
              <li v-for="url in site.person.sameAs" :key="url">
                <a :href="url" target="_blank" rel="noopener me" class="font-mono text-[.78rem] text-wp-soft hover:text-text">{{ url.replace(/^https?:\/\/(www\.|in\.)?/, '') }} ↗</a>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <SectionsWhySection />
      <SectionsGivingSection />
      <UiCtaBanner title="Want to build something together?" />
    </template>
  </div>
</template>
