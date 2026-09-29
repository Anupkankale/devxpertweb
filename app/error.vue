<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => notFound.value ? 'Page not found · DevXpert Labs' : 'Something went wrong · DevXpert Labs',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <NuxtLayout>
    <section class="relative z-[1] py-32 max-md:py-20">
      <div class="wrap text-center">
        <span class="eyebrow justify-center">Error {{ error.statusCode }}</span>
        <h1 class="mt-5 font-display text-[clamp(2.3rem,5.4vw,4.1rem)] font-semibold leading-[1.04] tracking-[-.02em]">
          <template v-if="notFound">This experiment <em class="not-italic text-wp-soft">doesn't exist.</em></template>
          <template v-else>Something <em class="not-italic text-wp-soft">broke on the bench.</em></template>
        </h1>
        <p class="mx-auto mt-5 max-w-[44ch] text-[1.08rem] text-muted">
          {{ notFound ? 'The page you were looking for has moved or never shipped.' : 'An unexpected error occurred. Try again in a moment.' }}
        </p>
        <div class="mt-8 flex justify-center">
          <UiBaseButton href="/" @click.prevent="clearError({ redirect: '/' })">← Back to the lab</UiBaseButton>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
