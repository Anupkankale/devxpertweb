<script setup lang="ts">
const { nav } = useAppConfig()
const route = useRoute()

const openMenu = ref<string | null>(null) // desktop dropdown
const mobileOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | undefined

const isActive = (to: string) => to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(to + '/')

function show(label: string) {
  clearTimeout(closeTimer)
  openMenu.value = label
}
function hide() {
  closeTimer = setTimeout(() => { openMenu.value = null }, 120)
}
function toggle(label: string) {
  openMenu.value = openMenu.value === label ? null : label
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    openMenu.value = null
    mobileOpen.value = false
  }
}
function onDocClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('[data-dropdown]')) openMenu.value = null
}

// Close menus on navigation; lock page scroll while the mobile menu is open.
watch(() => route.fullPath, () => {
  openMenu.value = null
  mobileOpen.value = false
})
watch(mobileOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDocClick)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line-soft bg-ink/80 backdrop-blur-[10px]">
    <div class="wrap flex h-[66px] items-center justify-between gap-6">
      <LayoutBrandMark class="text-[.95rem]" />

      <!-- Desktop -->
      <nav aria-label="Primary" class="max-md:hidden">
        <ul class="m-0 flex list-none items-center gap-[30px] p-0">
          <li
            v-for="item in nav.items"
            :key="item.to"
            class="relative"
            :data-dropdown="item.children ? '' : undefined"
            @mouseenter="item.children && show(item.label)"
            @mouseleave="item.children && hide()"
          >
            <NuxtLink
              v-if="!item.children"
              :to="item.to"
              class="text-[.9rem] transition-colors duration-200 hover:text-text"
              :class="isActive(item.to) ? 'text-text' : 'text-muted'"
              :aria-current="route.path === item.to ? 'page' : undefined"
            >{{ item.label }}</NuxtLink>

            <template v-else>
              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1.5 text-[.9rem] transition-colors duration-200 hover:text-text"
                :class="isActive(item.to) || openMenu === item.label ? 'text-text' : 'text-muted'"
                :aria-expanded="openMenu === item.label"
                :aria-controls="`menu-${item.label}`"
                @click="toggle(item.label)"
              >
                {{ item.label }}
                <UiAppIcon name="chevron-down" class="size-3 transition-transform duration-200" :class="{ 'rotate-180': openMenu === item.label }" />
              </button>

              <Transition
                enter-from-class="opacity-0 -translate-y-1"
                enter-active-class="transition duration-150"
                leave-to-class="opacity-0 -translate-y-1"
                leave-active-class="transition duration-100"
              >
                <div
                  v-show="openMenu === item.label"
                  :id="`menu-${item.label}`"
                  class="absolute left-1/2 top-full w-[340px] -translate-x-1/2 pt-4"
                >
                  <div class="overflow-hidden rounded-[14px] border border-line bg-panel/95 p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] backdrop-blur-md">
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.to"
                      :to="child.to"
                      class="group block rounded-[10px] px-4 py-3 transition-colors duration-150 hover:bg-editor"
                      :class="{ 'bg-editor': isActive(child.to) }"
                    >
                      <span class="flex items-center justify-between font-display text-[.98rem] font-medium text-text">
                        {{ child.label }}
                        <span class="font-mono text-xs text-wp-soft opacity-0 transition-opacity group-hover:opacity-100">→</span>
                      </span>
                      <span class="mt-0.5 block text-[.82rem] leading-snug text-muted">{{ child.description }}</span>
                    </NuxtLink>
                    <NuxtLink :to="item.to" class="mt-1 block border-t border-line-soft px-4 pb-2 pt-3 font-mono text-[.72rem] uppercase tracking-[.14em] text-wp-soft hover:text-text">
                      {{ item.label }} overview →
                    </NuxtLink>
                  </div>
                </div>
              </Transition>
            </template>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <NuxtLink
          :to="nav.cta.to"
          class="rounded-lg border border-line px-4 py-[9px] font-mono text-[.8rem] text-text transition-colors duration-200 hover:border-wp hover:bg-wp/15 max-[420px]:hidden"
        >{{ nav.cta.label }}</NuxtLink>

        <!-- Mobile toggle -->
        <button
          type="button"
          class="relative grid size-10 cursor-pointer place-items-center rounded-lg border border-line md:hidden"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="absolute h-[1.5px] w-[18px] bg-text transition-transform duration-200" :class="mobileOpen ? 'rotate-45' : '-translate-y-[5px]'" />
          <span class="absolute h-[1.5px] w-[18px] bg-text transition-opacity duration-200" :class="{ 'opacity-0': mobileOpen }" />
          <span class="absolute h-[1.5px] w-[18px] bg-text transition-transform duration-200" :class="mobileOpen ? '-rotate-45' : 'translate-y-[5px]'" />
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile menu: kept outside <header>, whose backdrop-filter would trap position:fixed -->
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
      leave-active-class="transition-opacity duration-150"
    >
      <nav
        v-show="mobileOpen"
        id="mobile-menu"
        aria-label="Mobile"
        class="fixed inset-x-0 bottom-0 top-[66px] z-50 overflow-y-auto border-t border-line-soft bg-ink px-6 pb-10 pt-4 md:hidden"
      >
        <ul class="m-0 list-none p-0">
          <li v-for="item in nav.items" :key="item.to" class="border-b border-line-soft">
            <NuxtLink
              :to="item.to"
              class="flex items-center justify-between py-4 font-display text-[1.35rem] font-medium"
              :class="isActive(item.to) ? 'text-wp-soft' : 'text-text'"
            >{{ item.label }} <span class="font-mono text-sm text-muted">→</span></NuxtLink>
            <ul v-if="item.children" class="m-0 mb-4 list-none space-y-1 p-0 pl-3">
              <li v-for="child in item.children" :key="child.to">
                <NuxtLink
                  :to="child.to"
                  class="block rounded-lg border-l border-line py-2 pl-4 text-[.98rem]"
                  :class="isActive(child.to) ? 'border-wp text-text' : 'text-muted'"
                >{{ child.label }}</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
        <UiBaseButton :href="nav.cta.to" class="mt-8 w-full justify-center">{{ nav.cta.label }} →</UiBaseButton>
      </nav>
    </Transition>
</template>
