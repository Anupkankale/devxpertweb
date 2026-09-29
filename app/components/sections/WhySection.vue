<script setup lang="ts">
defineProps<{ more?: { label: string, to: string } }>()

const { data } = await useAsyncData('why', () => Promise.all([
  queryCollection('sections').where('stem', '=', 'sections/why').first(),
  queryCollection('timeline').order('order', 'ASC').all(),
]))
const head = computed(() => data.value?.[0])
const steps = computed(() => data.value?.[1] ?? [])
</script>

<template>
  <UiSectionShell id="why" :more="more" :eyebrow="head?.eyebrow" :title="head?.title">
    <div class="grid grid-cols-2 items-start gap-14 max-md:grid-cols-1 max-md:gap-[38px]">
      <div>
        <p v-for="(para, i) in head?.paragraphs" :key="i" class="mt-4 text-[1.03rem] text-muted">{{ para }}</p>
      </div>
      <div class="relative pl-[26px] before:absolute before:bottom-1.5 before:left-1.5 before:top-1.5 before:w-px before:bg-line">
        <div
          v-for="step in steps"
          :key="step.id"
          class="relative pb-[26px] last:pb-0 before:absolute before:-left-6 before:top-1 before:size-[11px] before:rounded-full before:border-2 before:border-wp before:bg-ink"
          data-reveal="timeline"
        >
          <div class="font-mono text-[.7rem] tracking-[.1em] text-wp-soft">{{ step.kicker }}</div>
          <h3 class="mb-1 mt-1.5 font-display text-[1.1rem] font-medium">{{ step.title }}</h3>
          <p class="m-0 text-[.94rem] text-muted">{{ step.body }}</p>
        </div>
      </div>
    </div>
  </UiSectionShell>
</template>
