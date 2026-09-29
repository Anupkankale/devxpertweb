<script setup lang="ts">
const [{ data: page }, { data: site }, { data: lists }] = await Promise.all([
  usePageContent('contact'),
  useSite(),
  useAsyncData('contact-page', () => Promise.all([
    queryCollection('contacts').order('order', 'ASC').all(),
    queryCollection('stack').order('order', 'ASC').all(),
  ])),
])
const contacts = computed(() => lists.value?.[0] ?? [])
const topics = computed(() => [...(lists.value?.[1] ?? []).map(s => s.title), 'Something else'])
const ids = useSchemaIds()

usePageSeo(() => page.value && {
  title: page.value.seoTitle,
  description: page.value.seoDescription,
  schemaType: 'ContactPage',
  crumbs: [{ label: 'Contact', to: '/contact' }],
  mainEntity: ids.org,
})

const isExternal = (href: string) => /^https?:\/\//.test(href)
</script>

<template>
  <div>
    <template v-if="page && site">
      <UiPageHero v-bind="page" :crumbs="[{ label: 'Contact', to: '/contact' }]" />

      <section class="relative z-[1] pb-20" aria-label="Contact options">
        <div class="wrap grid grid-cols-[1.5fr_1fr] items-start gap-8 max-md:grid-cols-1">
          <ContactForm :topics="topics" :email="site.organization.email" />

          <aside class="flex flex-col gap-5" aria-label="Other ways to reach the lab">
            <div class="rounded-2xl border border-line bg-panel p-7" data-reveal="card">
              <h2 class="eyebrow mb-5">Direct lines</h2>
              <ul class="m-0 list-none space-y-2 p-0">
                <li v-for="c in contacts" :key="c.id">
                  <a
                    :href="c.href"
                    :target="isExternal(c.href) ? '_blank' : undefined"
                    :rel="isExternal(c.href) ? 'noopener' : undefined"
                    class="group flex items-center gap-3.5 rounded-[10px] px-2 py-2 transition-colors hover:bg-editor"
                  >
                    <span
                      class="grid size-10 shrink-0 place-items-center rounded-[10px] transition-colors"
                      :class="c.variant === 'whatsapp' ? 'bg-whatsapp/14 text-whatsapp group-hover:bg-whatsapp group-hover:text-ink' : 'bg-wp/12 text-wp-soft group-hover:bg-wp group-hover:text-white'"
                    ><UiAppIcon :name="c.icon" class="size-[18px]" /></span>
                    <span class="min-w-0">
                      <span class="block font-mono text-[.68rem] uppercase tracking-[.12em] text-muted">{{ c.label }}</span>
                      <span class="block truncate text-[.92rem]">{{ c.href.replace(/^(mailto:|tel:|https?:\/\/(www\.|in\.)?)/, '') }}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="rounded-2xl border border-line bg-panel p-7" data-reveal="card">
              <h2 class="eyebrow mb-3">Based in</h2>
              <p class="m-0 flex items-center gap-2 font-display text-[1.15rem] font-medium"><UiAppIcon name="pin" class="size-4 text-wp-soft" /> {{ site.organization.city }}, {{ site.organization.region }}, India</p>
              <p class="m-0 mt-2 text-[.9rem] text-muted">Working with clients remotely, wherever they are.</p>
            </div>

            <NuxtLink to="/#faq" class="group rounded-2xl border border-line bg-panel p-7 transition-colors hover:border-wp" data-reveal="card">
              <span class="eyebrow">Before you write</span>
              <span class="mt-3 flex items-center justify-between font-display text-[1.1rem] font-medium">Read the FAQ <UiAppIcon name="arrow-right" class="size-4 text-wp-soft transition-transform group-hover:translate-x-1" /></span>
            </NuxtLink>
          </aside>
        </div>
      </section>
    </template>
  </div>
</template>
