<script setup lang="ts">
defineProps<{ more?: { label: string, to: string } }>()

const { data } = await useAsyncData('projects', () => Promise.all([
  queryCollection('sections').where('stem', '=', 'sections/projects').first(),
  queryCollection('projects').order('order', 'ASC').all(),
]))
const head = computed(() => data.value?.[0])
const items = computed(() => data.value?.[1] ?? [])
</script>

<template>
  <UiSectionShell id="workbench" :more="more" :eyebrow="head?.eyebrow" :title="head?.title" :lead="head?.lead">
    <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
      <UiBaseCard v-for="item in items" :key="item.id" class="px-[26px] py-7" data-reveal="proj">
        <span class="font-mono text-[.7rem] uppercase tracking-[.14em] text-filament">{{ item.tag }}</span>
        <h3 class="mb-2.5 mt-3.5 font-display text-[1.3rem] font-semibold">{{ item.title }}</h3>
        <p class="mb-[22px] flex-1 text-[.96rem] text-muted">{{ item.body }}</p>
        <UiIconLink v-if="item.link" v-bind="item.link" />
      </UiBaseCard>
    </div>
  </UiSectionShell>
</template>
