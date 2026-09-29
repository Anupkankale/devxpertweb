<script setup lang="ts">
defineProps<{ more?: { label: string, to: string } }>()

const { data } = await useAsyncData('stack', () => Promise.all([
  queryCollection('sections').where('stem', '=', 'sections/stack').first(),
  queryCollection('stack').order('order', 'ASC').all(),
]))
const head = computed(() => data.value?.[0])
const items = computed(() => data.value?.[1] ?? [])
</script>

<template>
  <UiSectionShell id="lab" :more="more" :eyebrow="head?.eyebrow" :title="head?.title" :lead="head?.lead">
    <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-px overflow-hidden rounded-[14px] border border-line-soft bg-line-soft">
      <div
        v-for="item in items"
        :key="item.id"
        class="group relative bg-panel px-[26px] pb-[34px] pt-[30px] transition-colors duration-200 hover:bg-panel-hover"
        data-reveal="block"
      >
        <span class="absolute right-4 top-4 -translate-y-1 rounded-md border border-line px-[7px] py-0.5 font-mono text-[.7rem] text-muted opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-y-0 group-hover:opacity-100">⋮⋮ block</span>
        <span class="font-mono text-[.72rem] tracking-[.1em] text-wp-soft">{{ String(item.order).padStart(2, '0') }}</span>
        <h3 class="mb-2 mt-3.5 font-display text-[1.15rem] font-medium">{{ item.title }}</h3>
        <p class="m-0 text-[.94rem] text-muted">{{ item.body }}</p>
      </div>
    </div>
  </UiSectionShell>
</template>
