<script setup lang="ts">
/**
 * Standard wrapper for every home-page section: anchor id, vertical rhythm,
 * centered container and an optional header. New sections only need to
 * provide their body through the default slot.
 */
withDefaults(defineProps<{
  id?: string
  eyebrow?: string
  title?: string
  lead?: string
  align?: 'left' | 'center'
  reveal?: boolean
  /** optional link shown beside the header, e.g. { label: 'All insights', to: '/about/insights' } */
  more?: { label: string, to: string }
}>(), { reveal: true })
</script>

<template>
  <section :id="id" :aria-labelledby="title && id ? `${id}-title` : undefined" class="relative z-[1] py-20 max-md:py-15">
    <div class="wrap">
      <div v-if="title && more" class="flex flex-wrap items-end justify-between gap-x-10">
        <UiSectionHeader :eyebrow="eyebrow" :title="title" :lead="lead" :align="align" :reveal="reveal" :heading-id="id ? `${id}-title` : undefined" />
        <NuxtLink
          :to="more.to"
          class="group mb-11 inline-flex items-center gap-2 font-mono text-[.8rem] text-wp-soft transition-colors hover:text-text max-md:-mt-6"
        >{{ more.label }} <UiAppIcon name="arrow-right" class="size-3.5 transition-transform group-hover:translate-x-1" /></NuxtLink>
      </div>
      <UiSectionHeader v-else-if="title" :eyebrow="eyebrow" :title="title" :lead="lead" :align="align" :reveal="reveal" :heading-id="id ? `${id}-title` : undefined" />
      <slot />
    </div>
  </section>
</template>
