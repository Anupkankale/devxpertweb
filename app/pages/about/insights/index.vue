<script setup lang="ts">
const [{ data: page }, { data: studies }] = await Promise.all([usePageContent('insights'), useEntries('insights')])
const crumbs = [{ label: 'About', to: '/about' }, { label: 'Insights', to: '/about/insights' }]

usePageSeo(() => page.value && {
  title: page.value.seoTitle,
  description: page.value.seoDescription,
  schemaType: 'CollectionPage',
  crumbs,
})
</script>

<template>
  <div>
    <template v-if="page">
      <UiPageHero v-bind="page" :crumbs="crumbs" />

      <section v-if="studies?.length" class="relative z-[1] pb-6" aria-labelledby="case-studies-title">
        <div class="wrap">
          <h2 id="case-studies-title" class="eyebrow mb-6">Case studies</h2>
          <div class="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <UiEntryCard
              v-for="s in studies"
              :key="s.path"
              :to="s.path"
              :title="s.title"
              :description="s.description"
              :date="s.date"
              :kicker="s.kind"
              :tags="s.services"
              :reading-time="s.readingTime"
              :draft="s.draft"
            />
          </div>
        </div>
      </section>

      <SectionsProjectsSection />
      <SectionsGivingSection />
      <UiCtaBanner title="Want to be the next case study?" />
    </template>
  </div>
</template>
