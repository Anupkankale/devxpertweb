<script setup lang="ts">
const { data: about } = await useAsyncData('about', () => queryCollection('about').first())
</script>

<template>
  <UiSectionShell v-if="about" id="about" aria-labelledby="about-title">
    <div class="rounded-2xl border border-line bg-panel p-12 max-md:p-[34px]">
      <div class="max-w-[760px]">
        <span class="eyebrow">{{ about.eyebrow }}</span>
        <h2 id="about-title" class="mt-3.5 font-display text-[1.9rem] font-semibold tracking-[-.01em]">{{ about.title }}</h2>
        <ContentRenderer :value="about" class="[&_p]:mt-4 [&_p]:text-muted" />
        <p v-if="about.cta" class="mt-[22px]">
          <UiBaseButton :href="about.cta.href" variant="ghost">{{ about.cta.label }}</UiBaseButton>
        </p>
      </div>
    </div>
  </UiSectionShell>
</template>
