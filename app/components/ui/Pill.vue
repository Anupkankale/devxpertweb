<script setup lang="ts">
defineProps<{ variant: 'core' | 'live' | 'oss' }>()

const styles = {
  core: 'bg-wp text-white',
  live: 'bg-filament text-ink',
  oss: 'border border-line text-muted',
}
</script>

<template>
  <span
    class="whitespace-nowrap rounded-[20px] px-[11px] py-[5px] font-mono text-[.62rem] font-bold uppercase tracking-[.08em]"
    :class="styles[variant]"
  >
    <slot />
  </span>
</template>
