<script setup lang="ts">
const props = defineProps<{ trackerKey: string, title: string, url: string, seeds: string[] }>()

const { tasks, done, percent, add, toggle, remove } = useTracker(props.trackerKey, props.seeds)
const draft = ref('')
const input = ref<HTMLInputElement>()

function submit() {
  add(draft.value)
  draft.value = ''
  input.value?.focus()
}

const host = computed(() => props.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))
</script>

<template>
  <div class="rounded-2xl border border-line bg-panel px-6 py-[26px]">
    <div class="mb-1.5 flex items-start justify-between gap-3.5">
      <div>
        <h3 class="m-0 font-display text-[1.16rem] font-semibold">{{ title }}</h3>
        <a :href="url" target="_blank" rel="noopener" class="mt-1.5 inline-flex items-center gap-[.4em] font-mono text-[.72rem] text-wp-soft">
          <UiAppIcon name="arrow-out" class="size-3" /> {{ host }}
        </a>
      </div>
      <span class="whitespace-nowrap font-mono text-[.72rem] text-muted">{{ done }}/{{ tasks.length }} done</span>
    </div>

    <div class="mb-[18px] mt-3 h-[5px] overflow-hidden rounded bg-line">
      <span class="block h-full bg-filament transition-[width] duration-300" :style="{ width: percent + '%' }" />
    </div>

    <ul class="m-0 mb-3.5 flex list-none flex-col gap-0.5 p-0">
      <li
        v-for="(task, i) in tasks"
        :key="i + task.t"
        class="group flex items-start gap-[11px] rounded-lg px-1.5 py-[9px] transition-colors duration-150 hover:bg-editor"
      >
        <button
          type="button"
          aria-label="Toggle done"
          class="mt-px grid size-[18px] shrink-0 cursor-pointer place-items-center rounded-[5px] border-[1.5px] transition-colors duration-150"
          :class="task.d ? 'border-active bg-active' : 'border-line bg-transparent'"
          @click="toggle(i)"
        >
          <UiAppIcon name="check" class="size-[11px] text-ink" :class="task.d ? 'opacity-100' : 'opacity-0'" />
        </button>
        <span
          class="flex-1 cursor-pointer break-words text-[.92rem] leading-[1.4]"
          :class="task.d ? 'text-muted line-through' : 'text-text'"
          @click="toggle(i)"
        >{{ task.t }}</span>
        <button
          type="button"
          aria-label="Delete task"
          class="shrink-0 cursor-pointer px-0.5 text-[1.1rem] leading-none text-muted opacity-0 transition duration-150 group-hover:opacity-70 hover:!opacity-100 hover:text-danger"
          @click="remove(i)"
        >&times;</button>
      </li>
    </ul>

    <form class="flex gap-2" @submit.prevent="submit">
      <input
        ref="input"
        v-model="draft"
        type="text"
        placeholder="Add a task…"
        aria-label="Add a task"
        class="flex-1 rounded-[9px] border border-line bg-editor px-3 py-[9px] font-body text-[.88rem] text-text focus:border-wp focus:outline-none"
      >
      <button type="submit" class="cursor-pointer rounded-[9px] border border-line bg-transparent px-3.5 font-mono text-[.78rem] text-wp-soft transition duration-200 hover:border-wp">
        Add
      </button>
    </form>
  </div>
</template>
