<script setup lang="ts">
const [{ data: head }, { data: posts }] = await Promise.all([
  useAsyncData('blog-head', () => queryCollection('sections').where('stem', '=', 'sections/blog').first()),
  useEntries('blog', { limit: 3 }),
])
</script>

<template>
  <!-- Hidden until at least one post is published -->
  <UiSectionShell
    v-if="posts?.length"
    id="blog"
    :eyebrow="head?.eyebrow"
    :title="head?.title"
    :lead="head?.lead"
    :more="{ label: 'All posts', to: '/blog' }"
  >
    <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
      <UiEntryCard
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :tags="post.tags"
        :reading-time="post.readingTime"
        :draft="post.draft"
      />
    </div>
  </UiSectionShell>
</template>
