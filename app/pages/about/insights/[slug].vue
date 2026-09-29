<script setup lang="ts">
const { entry, prev, next, trail } = await useArticle('insights', [
  { label: 'About', to: '/about' },
  { label: 'Insights', to: '/about/insights' },
])
</script>

<template>
  <UiArticleView :entry="entry" :crumbs="trail" :kicker="entry.kind" :prev="prev" :next="next" />
</template>
