<script setup lang="ts">
withDefaults(defineProps<{ tag?: string }>(), { tag: 'div' })
</script>

<template>
  <component
    :is="tag"
    class="flex flex-col rounded-[14px] border border-line bg-panel transition-[translate,border-color] duration-200 hover:-translate-y-[3px] hover:border-wp"
  >
    <slot />
  </component>
</template>
