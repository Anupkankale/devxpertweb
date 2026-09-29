<script setup lang="ts">
const { check } = usePasscode()

const input = ref<HTMLInputElement>()
const box = ref<HTMLElement>()
const code = ref('')
const error = ref(false)

function submit() {
  if (check(code.value)) {
    error.value = false
    return
  }
  error.value = true
  // restart the shake animation
  box.value?.classList.remove('animate-shake')
  void box.value?.offsetWidth
  box.value?.classList.add('animate-shake')
  input.value?.select()
}

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div ref="box" class="mx-auto max-w-[440px] rounded-2xl border border-line bg-panel px-[34px] py-10 text-center">
    <div class="mx-auto mb-[18px] grid size-[46px] place-items-center rounded-xl bg-wp/14 text-wp-soft">
      <UiAppIcon name="lock" class="size-6" />
    </div>
    <h3 class="mb-1.5 font-display text-[1.3rem] font-semibold">This area is private</h3>
    <p class="mb-[22px] text-[.94rem] text-muted">Enter the passcode to view live project progress.</p>
    <form class="flex gap-2.5" @submit.prevent="submit">
      <input
        ref="input"
        v-model="code"
        type="password"
        inputmode="numeric"
        placeholder="Passcode"
        aria-label="Passcode"
        autocomplete="off"
        class="flex-1 rounded-[10px] border border-line bg-editor px-3.5 py-3 font-mono text-[.95rem] tracking-[.05em] text-text focus:border-wp focus:outline-none"
      >
      <button type="submit" class="cursor-pointer rounded-[10px] bg-wp px-5 font-mono text-[.82rem] text-white transition-[filter] duration-200 hover:brightness-[1.12]">
        Unlock
      </button>
    </form>
    <div class="mt-3 min-h-[1em] font-mono text-[.78rem] text-danger" :class="error ? 'opacity-100' : 'opacity-0'" role="alert">
      Incorrect passcode.
    </div>
  </div>
</template>
