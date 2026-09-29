<script setup lang="ts">
defineProps<{ more?: { label: string, to: string } }>()

const { data } = await useAsyncData('giving', () => Promise.all([
  queryCollection('sections').where('stem', '=', 'sections/giving').first(),
  queryCollection('contributions').order('order', 'ASC').all(),
]))
const head = computed(() => data.value?.[0])
const items = computed(() => data.value?.[1] ?? [])
</script>

<template>
  <UiSectionShell id="giving" :more="more" :eyebrow="head?.eyebrow" :title="head?.title" :lead="head?.lead">
    <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
      <UiBaseCard v-for="item in items" :key="item.id" class="px-[26px] pb-[26px] pt-7" data-reveal="give">
        <div class="mb-4 flex items-center justify-between gap-3">
          <span class="font-mono text-[.68rem] uppercase tracking-[.14em] text-wp-soft">{{ item.kicker }}</span>
          <UiPill :variant="item.pill.variant">{{ item.pill.label }}</UiPill>
        </div>
        <h3 class="mb-2 font-display text-[1.22rem] font-semibold leading-[1.2]">{{ item.title }}</h3>
        <p class="mb-[22px] flex-1 text-[.94rem] text-muted">{{ item.body }}</p>
        <UiIconLink v-bind="item.link" class="text-[.78rem]" />
      </UiBaseCard>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -- escaped by inlineBold -->
    <p v-if="head?.note" class="mb-4 mt-6 max-w-[64ch] text-[1rem] text-muted [&_b]:font-medium [&_b]:text-filament" v-html="inlineBold(head.note)" />
  </UiSectionShell>
</template>
