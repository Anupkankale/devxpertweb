<script setup lang="ts">
const { entry, prev, next, trail } = await useArticle()
</script>

<template>
  <UiArticleView :entry="entry" :crumbs="trail" :kicker="entryLabel(entry)" :prev="prev" :next="next" />
</template>
