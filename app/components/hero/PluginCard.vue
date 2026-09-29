<script setup lang="ts">
const props = defineProps<{
  name: string
  by: string
  filename: string
  hint: string
  header: { key: string, value: string, url?: boolean }[]
}>()

const active = ref(true)

// Align values like a real plugin header: pad keys to a common column.
const lines = computed(() => props.header.map(h => ({
  ...h,
  pad: ' '.repeat(Math.max(1, 13 - h.key.length)),
})))

const delay = (i: number) => ({ animationDelay: `${0.2 + i * 0.06}s` })
</script>

<template>
  <div class="overflow-hidden rounded-[14px] border border-line bg-editor shadow-[0_30px_60px_-30px_rgba(0,0,0,.75)]">
    <div class="flex items-center gap-3.5 border-b border-line-soft bg-wp/9 px-[18px] py-3.5">
      <span class="flex-1 font-display text-[1rem] font-semibold">
        {{ name }}<small class="block font-body text-[.78rem] font-normal text-muted">{{ by }}</small>
      </span>
      <span
        class="flex items-center gap-[.5em] font-mono text-[.72rem] uppercase tracking-[.12em]"
        :class="active ? 'text-active' : 'text-muted'"
      >
        <span
          class="size-2 rounded-full"
          :class="active ? 'bg-active shadow-[0_0_10px_var(--color-active)]' : 'bg-muted'"
        />{{ active ? 'Active' : 'Inactive' }}
      </span>
      <button
        type="button"
        class="relative h-6 w-11 shrink-0 cursor-pointer rounded-[20px] p-0 transition-colors duration-[250ms]"
        :class="active ? 'bg-wp' : 'bg-toggle-off'"
        aria-label="Toggle plugin active state"
        :aria-pressed="active"
        @click="active = !active"
      >
        <span
          class="absolute left-[3px] top-[3px] size-[18px] rounded-full bg-white transition-transform duration-[250ms]"
          :class="{ 'translate-x-5': !active }"
        />
      </button>
    </div>

    <div
      class="overflow-x-auto px-[22px] pb-6 pt-5 font-mono text-[.82rem] leading-[1.85] transition-[opacity,filter] duration-300"
      :class="{ 'opacity-40 saturate-[.4]': !active }"
      aria-label="WordPress plugin header"
    >
      <span class="code-ln" :style="delay(0)"><span class="text-c-tag">&lt;?php</span></span>
      <span class="code-ln" :style="delay(1)"><span class="text-c-comment">/**</span></span>
      <span v-for="(line, i) in lines" :key="line.key" class="code-ln" :style="delay(i + 2)"><span class="text-c-comment"> * </span><span class="text-c-key">{{ line.key }}</span><span>{{ line.pad }}</span><span :class="{ 'text-c-str': line.url }">{{ line.value }}</span></span>
      <span class="code-ln" :style="delay(lines.length + 2)"><span class="text-c-comment"> */</span></span>
    </div>

    <div class="flex flex-wrap justify-between gap-2 border-t border-line-soft px-[22px] pb-[18px] pt-3.5 font-mono text-[.7rem] text-muted">
      <span>{{ hint }}</span>
      <span>{{ filename }}</span>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.code-ln {
  @apply block translate-y-1 whitespace-pre opacity-0 animate-line-in;
}

@media (prefers-reduced-motion: reduce) {
  .code-ln { opacity: 1; translate: none; }
}
</style>
