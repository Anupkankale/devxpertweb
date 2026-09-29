<script setup lang="ts">
const { brand } = useAppConfig()
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-[.55em] font-mono font-bold tracking-[.02em]">
    <span class="text-wp-soft">&lt;</span>{{ brand }}<span class="text-wp-soft">/&gt;</span>
  </NuxtLink>
</template>
