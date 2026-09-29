<script setup lang="ts">
const { data } = await useAsyncData('tracker', () => Promise.all([
  queryCollection('sections').where('stem', '=', 'sections/tracker').first(),
  queryCollection('tracker').order('order', 'ASC').all(),
]))
const head = computed(() => data.value?.[0])
const projects = computed(() => data.value?.[1] ?? [])

const { isOpen, open } = useTrackerGate()
const { unlocked } = usePasscode()
const section = ref<{ $el: HTMLElement }>()
const lock = ref<{ focus: () => void }>()

watch(isOpen, async (value) => {
  if (!value) return
  await nextTick()
  section.value?.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => lock.value?.focus(), 400)
})

// Landing on /#tracker opens the gate directly.
onMounted(() => {
  if (location.hash === '#tracker') open()
})
</script>

<template>
  <UiSectionShell
    v-show="isOpen"
    id="tracker"
    ref="section"
    class="scroll-mt-[90px]"
    :eyebrow="head?.eyebrow"
    :title="head?.title"
    :reveal="false"
  >
    <ClientOnly>
      <TrackerLock v-if="!unlocked" ref="lock" />
      <div v-else>
        <div class="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
          <TrackerPanel
            v-for="p in projects"
            :key="p.key"
            :tracker-key="p.key"
            :title="p.title"
            :url="p.url"
            :seeds="p.seeds"
          />
        </div>
        <p class="mt-[22px] text-center font-mono text-[.82rem] text-muted">Changes save to this browser only. // click text to toggle done</p>
      </div>
    </ClientOnly>
  </UiSectionShell>
</template>
