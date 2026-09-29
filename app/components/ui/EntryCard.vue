<script setup lang="ts">
defineProps<{
  to: string
  title: string
  description?: string
  date: string
  kicker?: string
  tags?: string[]
  readingTime?: number
  draft?: boolean
  featured?: boolean
}>()
</script>

<template>
  <UiBaseCard tag="article" class="group relative p-7" :class="{ 'md:col-span-2 md:p-10': featured }" data-reveal="card">
    <div class="flex flex-wrap items-center gap-3 font-mono text-[.7rem] uppercase tracking-[.14em]">
      <span v-if="kicker" class="text-filament">{{ kicker }}</span>
      <time :datetime="date" class="text-muted">{{ formatDate(date) }}</time>
      <span v-if="readingTime" class="inline-flex items-center gap-1 text-muted"><UiAppIcon name="clock" class="size-3" /> {{ readingTime }} min read</span>
      <span v-if="draft" class="rounded-full border border-danger/60 px-2 py-0.5 text-danger">Draft</span>
    </div>
    <h3
      class="mt-4 font-display font-semibold leading-[1.2]"
      :class="featured ? 'text-[clamp(1.5rem,2.6vw,2rem)]' : 'text-[1.3rem]'"
    >
      <!-- Whole card is clickable via the stretched link -->
      <NuxtLink :to="to" class="after:absolute after:inset-0 after:rounded-[14px] after:content-['']">{{ title }}</NuxtLink>
    </h3>
    <p v-if="description" class="mb-6 mt-3 flex-1 text-[.96rem] text-muted" :class="{ 'max-w-[62ch] text-[1.02rem]': featured }">{{ description }}</p>
    <div class="mt-auto flex flex-wrap items-center justify-between gap-3">
      <ul v-if="tags?.length" class="m-0 flex list-none flex-wrap gap-2 p-0">
        <li v-for="tag in tags" :key="tag" class="rounded-full border border-line px-2.5 py-1 font-mono text-[.66rem] text-muted">{{ tag }}</li>
      </ul>
      <span class="inline-flex items-center gap-1.5 font-mono text-[.78rem] text-wp-soft">Read <UiAppIcon name="arrow-right" class="size-3.5 transition-transform group-hover:translate-x-1" /></span>
    </div>
  </UiBaseCard>
</template>
