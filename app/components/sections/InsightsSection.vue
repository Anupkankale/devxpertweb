<script setup lang="ts">
const [{ data: head }, { data: entries }] = await Promise.all([
  useAsyncData('insights-head', () => queryCollection('sections').where('stem', '=', 'sections/insights').first()),
  useInsightsFeed({ limit: 3 }),
])
</script>

<template>
  <!-- Hidden until at least one article or case study is published -->
  <UiSectionShell
    v-if="entries?.length"
    id="insights"
    :eyebrow="head?.eyebrow"
    :title="head?.title"
    :lead="head?.lead"
    :more="{ label: 'Read our thinking', to: '/what-we-think' }"
  >
    <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
      <UiEntryCard
        v-for="e in entries"
        :key="e.path"
        :to="e.path"
        :title="e.title"
        :description="e.description"
        :date="e.date"
        :kicker="entryLabel(e)"
        :tags="e.type === 'article' ? e.tags : e.services"
        :reading-time="e.readingTime"
        :draft="e.draft"
      />
    </div>
  </UiSectionShell>
</template>
