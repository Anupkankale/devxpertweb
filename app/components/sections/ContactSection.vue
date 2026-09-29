<script setup lang="ts">
const { data } = await useAsyncData('contact', () => Promise.all([
  queryCollection('sections').where('stem', '=', 'sections/contact').first(),
  queryCollection('contacts').order('order', 'ASC').all(),
]))
const head = computed(() => data.value?.[0])
const items = computed(() => data.value?.[1] ?? [])

const isExternal = (href: string) => /^https?:\/\//.test(href)
</script>

<template>
  <UiSectionShell id="contact" :eyebrow="head?.eyebrow" :title="head?.title" :lead="head?.lead" align="center">
    <div class="grid grid-cols-[repeat(auto-fit,minmax(116px,1fr))] gap-3.5">
      <a
        v-for="item in items"
        :key="item.id"
        :href="item.href"
        :target="isExternal(item.href) ? '_blank' : undefined"
        :rel="isExternal(item.href) ? 'noopener' : undefined"
        :aria-label="item.label"
        :title="item.label"
        class="group flex flex-col items-center gap-3 rounded-[14px] border border-line bg-panel px-3.5 py-6 text-center transition-[border-color,background-color,translate] duration-200 hover:-translate-y-[3px] hover:border-wp hover:bg-panel-hover"
        data-reveal="contact"
      >
        <span
          class="grid size-11 place-items-center rounded-xl transition-colors duration-200"
          :class="item.variant === 'whatsapp'
            ? 'bg-whatsapp/14 text-whatsapp group-hover:bg-whatsapp group-hover:text-ink'
            : 'bg-wp/12 text-wp-soft group-hover:bg-wp group-hover:text-white'"
        >
          <UiAppIcon :name="item.icon" class="size-[21px]" />
        </span>
        <span class="font-mono text-[.7rem] uppercase tracking-[.1em] text-muted transition-colors duration-200 group-hover:text-text">{{ item.label }}</span>
      </a>
    </div>
  </UiSectionShell>
</template>
