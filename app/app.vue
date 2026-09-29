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
    // - hide reveal targets until they're revealed (see plugins/reveal.client.ts)
    // - on refresh/back with a saved scroll position (or an #anchor), keep the page hidden
    //   until the first-paint script below has scrolled there, so the top never flashes
    key: 'anim-ready',
    tagPosition: 'head',
    innerHTML: `(function(){try{var d=document.documentElement;
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('anim-ready');
var n=performance.getEntriesByType('navigation')[0],t=n&&n.type;
if(location.hash||((t==='reload'||t==='back_forward')&&+sessionStorage.getItem('dxl-scroll:'+location.pathname+location.search)>0)){
d.classList.add('restoring');setTimeout(function(){d.classList.remove('restoring')},3000)}
}catch(e){}})()`,
  }, {
    // Runs once the server-rendered HTML is parsed, before the app boots:
    // 1. restores the scroll position on refresh/back (instantly, no jump from the top)
    // 2. marks reveal elements already on screen as shown, so they don't wait for the app to boot
    key: 'first-paint',
    tagPosition: 'bodyClose',
    innerHTML: `(function(){try{
var key=function(){return 'dxl-scroll:'+location.pathname+location.search};
addEventListener('pagehide',function(){try{sessionStorage.setItem(key(),String(scrollY))}catch(e){}});
var nav=performance.getEntriesByType('navigation')[0],type=nav&&nav.type;
if(location.hash){var el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(el)el.scrollIntoView({behavior:'instant'})}
else if(type==='reload'||type==='back_forward'){var y=+sessionStorage.getItem(key());if(y)scrollTo({top:y,behavior:'instant'})}
if(document.documentElement.classList.contains('anim-ready')){var h=innerHeight;document.querySelectorAll('[data-reveal]').forEach(function(e){var r=e.getBoundingClientRect();if(r.top<h&&r.bottom>0)e.setAttribute('data-shown','')})}
}catch(e){}document.documentElement.classList.remove('restoring')})()`,
  }],
})

useBaseSchema()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
