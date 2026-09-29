<script setup lang="ts">
const { data: site } = await useSite()
</script>

<template>
  <section v-if="site" id="top" aria-labelledby="hero-title" class="relative z-[1] overflow-hidden pb-18 pt-22 max-md:pb-12 max-md:pt-15">
    <div class="wrap grid grid-cols-[1.05fr_.95fr] items-center gap-14 max-md:grid-cols-1 max-md:gap-10">
      <div>
        <span class="eyebrow" data-hero-reveal="0">{{ site.hero.eyebrow }}</span>
        <h1
          id="hero-title"
          class="mt-[22px] font-display text-[clamp(2.3rem,5.4vw,4.1rem)] font-semibold leading-[1.04] tracking-[-.02em]"
          data-hero-reveal="1"
        >
          {{ site.hero.title }} <em class="not-italic text-wp-soft">{{ site.hero.titleEmphasis }}</em>
        </h1>
        <p class="mt-[22px] max-w-[34ch] text-[1.08rem] text-muted" data-hero-reveal="2">{{ site.hero.lead }}</p>
        <div class="mt-8 flex flex-wrap gap-3.5" data-hero-reveal="3">
          <UiBaseButton :href="site.hero.primaryCta.href">{{ site.hero.primaryCta.label }}</UiBaseButton>
          <UiBaseButton :href="site.hero.secondaryCta.href" variant="ghost">{{ site.hero.secondaryCta.label }}</UiBaseButton>
        </div>
      </div>

      <HeroPluginCard v-bind="site.pluginCard" />
    </div>
  </section>
</template>
