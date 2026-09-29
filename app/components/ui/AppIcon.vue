<script setup lang="ts">
const props = defineProps<{ name: string }>()
const icon = computed(() => icons[props.name])
</script>

<template>
  <svg
    v-if="icon"
    :viewBox="icon.viewBox"
    :fill="icon.mode === 'fill' ? 'currentColor' : 'none'"
    :stroke="icon.mode === 'stroke' ? 'currentColor' : undefined"
    :stroke-width="icon.strokeWidth"
    :stroke-linecap="icon.mode === 'stroke' ? 'round' : undefined"
    :stroke-linejoin="icon.mode === 'stroke' ? 'round' : undefined"
    aria-hidden="true"
    v-html="icon.body"
  />
</template>
