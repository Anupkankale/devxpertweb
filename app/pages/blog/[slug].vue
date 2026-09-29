<script setup lang="ts">
const { entry, prev, next, trail } = await useArticle('blog', [{ label: 'Blog', to: '/blog' }])
</script>

<template>
  <UiArticleView :entry="entry" :crumbs="trail" kicker="Blog" :prev="prev" :next="next" />
</template>
