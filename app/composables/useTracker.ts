export interface TrackerTask { t: string, d: boolean }

/**
 * Task list for one tracker project, persisted to localStorage under
 * `dxl_track_<key>` (same key as the original site, so saved tasks carry over).
 */
export function useTracker(key: string, seeds: string[]) {
  const storageKey = 'dxl_track_' + key
  const tasks = ref<TrackerTask[]>(seeds.map(t => ({ t, d: false })))

  onMounted(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) tasks.value = JSON.parse(raw)
    }
    catch {}
  })

  watch(tasks, (value) => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)) }
    catch {}
  }, { deep: true })

  const done = computed(() => tasks.value.filter(i => i.d).length)
  const percent = computed(() => tasks.value.length ? done.value / tasks.value.length * 100 : 0)

  function add(text: string) {
    const t = text.trim()
    if (t) tasks.value.push({ t, d: false })
  }
  const toggle = (i: number) => { tasks.value[i]!.d = !tasks.value[i]!.d }
  const remove = (i: number) => { tasks.value.splice(i, 1) }

  return { tasks, done, percent, add, toggle, remove }
}
