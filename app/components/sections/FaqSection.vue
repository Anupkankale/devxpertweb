<script setup lang="ts">
const { data } = await useAsyncData('faq', () => Promise.all([
  queryCollection('sections').where('stem', '=', 'sections/faq').first(),
  queryCollection('faq').order('order', 'ASC').all(),
]))
const head = computed(() => data.value?.[0])
const items = computed(() => data.value?.[1] ?? [])
</script>

<template>
  <UiSectionShell id="faq" :eyebrow="head?.eyebrow" :title="head?.title" :lead="head?.lead">
    <div class="grid max-w-[860px] gap-3">
      <details
        v-for="(item, i) in items"
        :key="item.id"
        class="group rounded-[14px] border border-line bg-panel transition-colors duration-200 open:border-wp/60 hover:border-wp"
        :open="i === 0"
        data-reveal="faq"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-6 px-[26px] py-5 [&::-webkit-details-marker]:hidden">
          <h3 class="m-0 font-display text-[1.1rem] font-medium">{{ item.question }}</h3>
          <span
            aria-hidden="true"
            class="grid size-7 shrink-0 place-items-center rounded-lg border border-line font-mono text-wp-soft"
          ><span class="transition-transform duration-200 group-open:rotate-45">+</span></span>
        </summary>
        <p class="m-0 max-w-[70ch] px-[26px] pb-6 text-[.96rem] text-muted">{{ item.answer }}</p>
      </details>
    </div>
  </UiSectionShell>
</template>
