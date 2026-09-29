<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  /** animate in on scroll */
  reveal?: boolean
  headingId?: string
}>(), { align: 'left', reveal: true })
</script>

<template>
  <div
    :data-reveal="reveal ? 'head' : undefined"
    :class="align === 'center' ? 'mx-auto mb-11 max-w-[44ch] text-center' : 'mb-11 max-w-[52ch]'"
  >
    <span v-if="eyebrow" class="eyebrow" :class="{ 'justify-center': align === 'center' }">{{ eyebrow }}</span>
    <h2
      :id="headingId"
      class="mt-4 font-display font-semibold"
      :class="align === 'center'
        ? 'text-[clamp(2rem,4vw,3rem)] tracking-[-.02em]'
        : 'text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.1] tracking-[-.015em]'"
    >
      {{ title }}
    </h2>
    <p v-if="lead" class="mt-3.5 text-muted" :class="{ 'text-[1.03rem]': align === 'left' }">{{ lead }}</p>
  </div>
</template>
