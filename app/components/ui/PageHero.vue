<script setup lang="ts">
import type { Crumb } from '~/composables/usePageSeo'

defineProps<{
  eyebrow?: string
  title: string
  titleEmphasis?: string
  lead?: string
  crumbs?: Crumb[]
}>()
</script>

<template>
  <section class="relative z-[1] pb-14 pt-16 max-md:pb-10 max-md:pt-10" aria-labelledby="page-title">
    <div class="wrap">
      <nav v-if="crumbs?.length" aria-label="Breadcrumb" class="mb-8" data-hero-reveal="0">
        <ol class="m-0 flex list-none flex-wrap items-center gap-2 p-0 font-mono text-[.72rem] text-muted">
          <li><NuxtLink to="/" class="hover:text-text">Home</NuxtLink></li>
          <template v-for="(crumb, i) in crumbs" :key="crumb.to">
            <li aria-hidden="true" class="text-line">/</li>
            <li>
              <NuxtLink v-if="i < crumbs.length - 1" :to="crumb.to" class="hover:text-text">{{ crumb.label }}</NuxtLink>
              <span v-else aria-current="page" class="text-wp-soft">{{ crumb.label }}</span>
            </li>
          </template>
        </ol>
      </nav>
      <span v-if="eyebrow" class="eyebrow" data-hero-reveal="1">{{ eyebrow }}</span>
      <h1
        id="page-title"
        class="mt-5 max-w-[20ch] font-display text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.05] tracking-[-.02em]"
        data-hero-reveal="2"
      >
        {{ title }}<template v-if="titleEmphasis">
          {{ ' ' }}<em class="not-italic text-wp-soft">{{ titleEmphasis }}</em>
        </template>
      </h1>
      <p v-if="lead" class="mt-6 max-w-[58ch] text-[1.08rem] text-muted" data-hero-reveal="3">{{ lead }}</p>
      <div v-if="$slots.default" class="mt-8" data-hero-reveal="4"><slot /></div>
    </div>
  </section>
</template>
