<script setup lang="ts">
import type { Crumb } from '~/composables/usePageSeo'

interface TocLink { id: string, text: string, depth: number, children?: TocLink[] }

const props = defineProps<{
  entry: {
    title: string
    description?: string
    date: string
    updated?: string
    readingTime?: number
    draft?: boolean
    tags?: string[]
    kind?: string
    client?: string
    services?: string[]
    outcome?: string
    link?: { href: string, label: string, icon?: string }
    body?: { toc?: { links?: TocLink[] } }
  }
  crumbs: Crumb[]
  kicker: string
  prev?: { path: string, title: string } | null
  next?: { path: string, title: string } | null
}>()

const toc = computed(() => props.entry.body?.toc?.links ?? [])
const facts = computed(() => [
  props.entry.client && { k: 'Client', v: props.entry.client },
  props.entry.services?.length && { k: 'Services', v: props.entry.services.join(', ') },
  props.entry.outcome && { k: 'Outcome', v: props.entry.outcome },
].filter(Boolean) as { k: string, v: string }[])
</script>

<template>
  <article>
    <UiPageHero :eyebrow="kicker" :title="entry.title" :lead="entry.description" :crumbs="crumbs">
      <div class="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[.74rem] text-muted">
        <span v-if="entry.draft" class="rounded-full border border-danger/60 px-2.5 py-0.5 uppercase tracking-[.12em] text-danger">Draft · hidden in production</span>
        <span>By Anup Kankale</span>
        <time :datetime="entry.date">{{ formatDate(entry.date) }}</time>
        <span v-if="entry.updated">Updated <time :datetime="entry.updated">{{ formatDate(entry.updated) }}</time></span>
        <span v-if="entry.readingTime" class="inline-flex items-center gap-1.5"><UiAppIcon name="clock" class="size-3.5" /> {{ entry.readingTime }} min read</span>
      </div>
    </UiPageHero>

    <div class="relative z-[1] pb-10">
      <div class="wrap grid grid-cols-[minmax(0,1fr)_280px] items-start gap-14 max-md:grid-cols-1">
        <ContentRenderer :value="entry" class="prose-lab" />

        <aside class="flex flex-col gap-5 md:sticky md:top-24 max-md:order-first" aria-label="Article details">
          <div v-if="facts.length || entry.link" class="rounded-[14px] border border-line bg-panel p-6">
            <dl class="m-0 space-y-4">
              <div v-for="f in facts" :key="f.k">
                <dt class="font-mono text-[.68rem] uppercase tracking-[.14em] text-muted">{{ f.k }}</dt>
                <dd class="m-0 mt-1 text-[.95rem]">{{ f.v }}</dd>
              </div>
            </dl>
            <UiIconLink v-if="entry.link" v-bind="entry.link" class="mt-5" />
          </div>

          <nav v-if="toc.length" class="rounded-[14px] border border-line bg-panel p-6 max-md:hidden" aria-label="Table of contents">
            <h2 class="eyebrow mb-3">On this page</h2>
            <ul class="m-0 list-none space-y-2 p-0 text-[.9rem]">
              <li v-for="l in toc" :key="l.id">
                <a :href="`#${l.id}`" class="text-muted transition-colors hover:text-text">{{ l.text }}</a>
                <ul v-if="l.children?.length" class="m-0 mt-2 list-none space-y-2 p-0 pl-3">
                  <li v-for="c in l.children" :key="c.id"><a :href="`#${c.id}`" class="text-muted hover:text-text">{{ c.text }}</a></li>
                </ul>
              </li>
            </ul>
          </nav>

          <ul v-if="entry.tags?.length" class="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Tags">
            <li v-for="tag in entry.tags" :key="tag" class="rounded-full border border-line px-3 py-1 font-mono text-[.68rem] text-muted">{{ tag }}</li>
          </ul>
        </aside>
      </div>

      <nav v-if="prev || next" class="wrap mt-16 grid grid-cols-2 gap-5 max-[560px]:grid-cols-1" aria-label="More articles">
        <NuxtLink v-if="prev" :to="prev.path" class="group rounded-[14px] border border-line bg-panel p-6 transition-colors hover:border-wp">
          <span class="inline-flex items-center gap-1.5 font-mono text-[.7rem] uppercase tracking-[.14em] text-muted"><UiAppIcon name="arrow-left" class="size-3" /> Newer</span>
          <span class="mt-2 block font-display text-[1.05rem] font-medium">{{ prev.title }}</span>
        </NuxtLink>
        <span v-else />
        <NuxtLink v-if="next" :to="next.path" class="group rounded-[14px] border border-line bg-panel p-6 text-right transition-colors hover:border-wp">
          <span class="inline-flex items-center gap-1.5 font-mono text-[.7rem] uppercase tracking-[.14em] text-muted">Older <UiAppIcon name="arrow-right" class="size-3" /></span>
          <span class="mt-2 block font-display text-[1.05rem] font-medium">{{ next.title }}</span>
        </NuxtLink>
      </nav>
    </div>

    <UiCtaBanner />
  </article>
</template>
