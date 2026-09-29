<script setup lang="ts">
defineProps<{ href: string, label: string, icon?: string }>()
</script>

<template>
  <a :href="href" target="_blank" rel="noopener" class="inline-flex items-center gap-[.5em] font-mono text-[.8rem] text-wp-soft">
    <UiAppIcon v-if="icon" :name="icon" class="size-3.5" />
    {{ label }}
  </a>
</template>
