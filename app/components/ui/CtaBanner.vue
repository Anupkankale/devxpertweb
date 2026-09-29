<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  lead?: string
  href?: string
  label?: string
}>(), {
  title: 'Have something worth testing?',
  lead: 'A client project, a plugin idea, or a "could we actually build this?" Bring it to the bench.',
  href: '/contact',
  label: 'Start a conversation →',
})
</script>

<template>
  <section class="relative z-[1] py-20 max-md:py-15" aria-label="Get in touch">
    <div class="wrap">
      <div
        class="relative overflow-hidden rounded-2xl border border-line bg-panel px-12 py-14 max-md:px-7 max-md:py-10"
        data-reveal="card"
      >
        <div aria-hidden="true" class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-wp/25 blur-3xl" />
        <div class="relative flex flex-wrap items-center justify-between gap-8">
          <div class="max-w-[46ch]">
            <span class="eyebrow">Work with the lab</span>
            <h2 class="mt-3 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] font-semibold leading-[1.1] tracking-[-.015em]">{{ title }}</h2>
            <p class="mt-3 text-muted">{{ lead }}</p>
          </div>
          <UiBaseButton :href="href">{{ label }}</UiBaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
