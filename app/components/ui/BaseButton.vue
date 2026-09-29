<script setup lang="ts">
const props = withDefaults(defineProps<{
  href: string
  variant?: 'primary' | 'ghost'
}>(), { variant: 'primary' })

const external = computed(() => /^(https?:|mailto:|tel:)/.test(props.href))
const classes = computed(() => [
  'inline-flex items-center gap-[.6em] rounded-[10px] border px-[22px] py-[13px] font-mono text-[.85rem] transition-[translate,background-color,border-color] duration-200 hover:-translate-y-0.5',
  props.variant === 'primary' ? 'border-wp bg-wp text-white hover:bg-wp-hover' : 'border-line text-text hover:border-wp-soft',
])
</script>

<template>
  <!-- In-page anchors stay plain links; everything else goes through the router. -->
  <a v-if="href.startsWith('#')" :href="href" :class="classes"><slot /></a>
  <NuxtLink v-else :to="href" :external="external" :target="/^https?:/.test(href) ? '_blank' : undefined" :class="classes"><slot /></NuxtLink>
</template>
