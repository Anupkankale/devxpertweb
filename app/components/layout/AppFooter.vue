<script setup lang="ts">
const { nav } = useAppConfig()
const { data: site } = await useSite()
const { data: contacts } = await useAsyncData('footer-contacts', () => queryCollection('contacts').order('order', 'ASC').all())
const { open } = useTrackerGate()
const route = useRoute()

const aboutLinks = computed(() => nav.items.find(i => i.children)?.children ?? [])
const pageLinks = computed(() => nav.items.filter(i => !i.children))
const socials = computed(() => (contacts.value ?? []).filter(c => /^https?:/.test(c.href)))

function openTracker() {
  if (route.path === '/') open()
  else navigateTo({ path: '/', hash: '#tracker' })
}
</script>

<template>
  <footer class="relative z-[1] mt-5 border-t border-line-soft">
    <div class="wrap grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 py-14 max-md:grid-cols-2 max-[520px]:grid-cols-1">
      <div class="max-md:col-span-2 max-[520px]:col-span-1">
        <LayoutBrandMark class="text-[.95rem]" />
        <p class="mt-4 max-w-[36ch] text-[.92rem] text-muted">{{ site?.ogDescription }}</p>
        <p class="mt-4 flex items-center gap-2 font-mono text-[.72rem] text-muted">
          <UiAppIcon name="pin" class="size-3.5 text-wp-soft" /> {{ site?.organization.city }}, India
        </p>
      </div>

      <nav aria-label="Footer: pages">
        <h2 class="eyebrow mb-4">Explore</h2>
        <ul class="m-0 list-none space-y-2.5 p-0 text-[.92rem]">
          <li v-for="item in pageLinks" :key="item.to"><NuxtLink :to="item.to" class="text-muted transition-colors hover:text-text">{{ item.label }}</NuxtLink></li>
          <li><a href="/blog/rss.xml" class="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-text"><UiAppIcon name="rss" class="size-3.5" /> RSS feed</a></li>
        </ul>
      </nav>

      <nav aria-label="Footer: about">
        <h2 class="eyebrow mb-4">About</h2>
        <ul class="m-0 list-none space-y-2.5 p-0 text-[.92rem]">
          <li v-for="item in aboutLinks" :key="item.to"><NuxtLink :to="item.to" class="text-muted transition-colors hover:text-text">{{ item.label }}</NuxtLink></li>
        </ul>
      </nav>

      <div>
        <h2 class="eyebrow mb-4">Elsewhere</h2>
        <ul class="m-0 list-none space-y-2.5 p-0 text-[.92rem]">
          <li v-for="c in socials" :key="c.id">
            <a :href="c.href" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-muted transition-colors hover:text-text">
              <UiAppIcon :name="c.icon" class="size-3.5" /> {{ c.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-line-soft">
      <div class="wrap flex flex-wrap items-center justify-between gap-4 py-6">
        <span class="font-mono text-[.72rem] tracking-[.04em] text-muted">{{ site?.footer.meta }}</span>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-[.45em] p-0 font-mono text-[.72rem] text-muted transition-colors duration-200 hover:text-wp-soft"
          @click="openTracker"
        >
          <UiAppIcon name="lock" class="size-[11px]" /> Private tracker
        </button>
      </div>
    </div>
  </footer>
</template>
