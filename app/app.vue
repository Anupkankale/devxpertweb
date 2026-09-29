<script setup lang="ts">
const { data: site } = await useSite()
const { siteUrl, indexable } = useRuntimeConfig().public
const route = useRoute()

// Canonical URLs have no trailing slash (except the home page).
const canonical = computed(() => siteUrl + (route.path === '/' ? '/' : route.path.replace(/\/$/, '')))
const ogImage = computed(() => site.value ? siteUrl + site.value.ogImage : undefined)

useSeoMeta({
  // Defaults; pages override title/description through usePageSeo().
  description: () => site.value?.description,
  author: () => site.value?.author,
  robots: indexable
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, nofollow',

  ogSiteName: () => site.value?.name,
  ogLocale: () => site.value?.locale,
  ogUrl: canonical,
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogImageAlt: () => site.value?.ogImageAlt,

  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
  twitterImageAlt: () => site.value?.ogImageAlt,
})

useHead({
  titleTemplate: (title?: string) => title ? withBrand(title) : site.value?.title ?? '',
  link: [{ rel: 'canonical', href: canonical }],
  script: [{
    // Hide reveal targets before hydration so GSAP can animate them in without a flash.
    key: 'anim-ready',
    tagPosition: 'head',
    innerHTML: `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('anim-ready')}catch(e){}`,
  }],
})

useBaseSchema()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
