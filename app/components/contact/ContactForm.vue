<script setup lang="ts">
const props = defineProps<{ topics: string[], email: string }>()
const { web3formsKey } = useRuntimeConfig().public

const form = reactive({ name: '', email: '', topic: '', message: '', botcheck: false })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMessage = ref('')
const touched = ref(false)

const errors = computed(() => ({
  name: !form.name.trim() ? 'Please tell us your name.' : '',
  email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Please enter a valid email address.' : '',
  message: form.message.trim().length < 10 ? 'A sentence or two about the project helps (10+ characters).' : '',
}))
const valid = computed(() => !Object.values(errors.value).some(Boolean))

async function submit() {
  touched.value = true
  if (!valid.value || status.value === 'sending') return
  if (form.botcheck) return // honeypot filled: silently drop

  const subject = `[DevXpert Labs] ${form.topic || 'New enquiry'} from ${form.name}`

  // No access key configured: fall back to the visitor's email client.
  if (!web3formsKey) {
    const body = `${form.message}\n\n${form.name} <${form.email}>`
    window.location.href = `mailto:${props.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    return
  }

  status.value = 'sending'
  try {
    const res = await $fetch<{ success: boolean, message?: string }>('https://api.web3forms.com/submit', {
      method: 'POST',
      body: {
        access_key: web3formsKey,
        subject,
        from_name: 'DevXpert Labs website',
        name: form.name,
        email: form.email,
        topic: form.topic || 'Not specified',
        message: form.message,
        botcheck: form.botcheck,
      },
    })
    if (!res.success) throw new Error(res.message)
    status.value = 'sent'
  }
  catch (e) {
    status.value = 'error'
    errorMessage.value = e instanceof Error && e.message ? e.message : 'Something went wrong.'
  }
}

const field = 'w-full rounded-[10px] border bg-editor px-4 py-3 text-[.95rem] text-text placeholder:text-muted/70 focus:border-wp focus:outline-none'
</script>

<template>
  <div class="rounded-2xl border border-line bg-panel p-8 max-md:p-6" data-reveal="card">
    <div v-if="status === 'sent'" class="py-10 text-center" role="status">
      <div class="mx-auto grid size-14 place-items-center rounded-2xl bg-active/15 text-active">
        <UiAppIcon name="check" class="size-6" />
      </div>
      <h2 class="mt-5 font-display text-[1.5rem] font-semibold">Message received.</h2>
      <p class="mx-auto mt-2 max-w-[40ch] text-muted">
        Thanks, {{ form.name.split(' ')[0] }}. Your note is on the bench, and you'll get a reply at {{ form.email }}.
      </p>
    </div>

    <form v-else novalidate @submit.prevent="submit">
      <h2 class="font-display text-[1.4rem] font-semibold">Tell the lab about your project</h2>
      <p class="mb-7 mt-1 text-[.94rem] text-muted">Fields marked * are required.</p>

      <div class="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
        <div>
          <label for="cf-name" class="mb-2 block font-mono text-[.72rem] uppercase tracking-[.12em] text-muted">Name *</label>
          <input
            id="cf-name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            required
            :class="[field, touched && errors.name ? 'border-danger' : 'border-line']"
            :aria-invalid="touched && !!errors.name"
            aria-describedby="cf-name-err"
          >
          <p v-if="touched && errors.name" id="cf-name-err" class="mt-1.5 text-[.8rem] text-danger">{{ errors.name }}</p>
        </div>
        <div>
          <label for="cf-email" class="mb-2 block font-mono text-[.72rem] uppercase tracking-[.12em] text-muted">Email *</label>
          <input
            id="cf-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            inputmode="email"
            required
            :class="[field, touched && errors.email ? 'border-danger' : 'border-line']"
            :aria-invalid="touched && !!errors.email"
            aria-describedby="cf-email-err"
          >
          <p v-if="touched && errors.email" id="cf-email-err" class="mt-1.5 text-[.8rem] text-danger">{{ errors.email }}</p>
        </div>
      </div>

      <fieldset class="mt-6 border-0 p-0">
        <legend class="mb-3 font-mono text-[.72rem] uppercase tracking-[.12em] text-muted">What's it about?</legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="t in topics" :key="t" class="cursor-pointer">
            <input v-model="form.topic" type="radio" name="topic" :value="t" class="peer sr-only">
            <span class="block rounded-full border border-line px-3.5 py-1.5 font-mono text-[.74rem] text-muted transition-colors hover:text-text peer-checked:border-wp peer-checked:bg-wp/15 peer-checked:text-text peer-focus-visible:outline-2 peer-focus-visible:outline-wp-soft">{{ t }}</span>
          </label>
        </div>
      </fieldset>

      <div class="mt-6">
        <label for="cf-message" class="mb-2 block font-mono text-[.72rem] uppercase tracking-[.12em] text-muted">Message *</label>
        <textarea
          id="cf-message"
          v-model="form.message"
          rows="6"
          required
          placeholder="What are you trying to solve? Any links, deadlines or constraints?"
          :class="[field, 'resize-y', touched && errors.message ? 'border-danger' : 'border-line']"
          :aria-invalid="touched && !!errors.message"
          aria-describedby="cf-message-err"
        />
        <p v-if="touched && errors.message" id="cf-message-err" class="mt-1.5 text-[.8rem] text-danger">{{ errors.message }}</p>
      </div>

      <!-- Honeypot: hidden from people, tempting for bots -->
      <input v-model="form.botcheck" type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

      <div class="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          class="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-wp bg-wp px-6 py-3 font-mono text-[.85rem] text-white transition hover:-translate-y-0.5 hover:bg-wp-hover disabled:cursor-wait disabled:opacity-60"
          :disabled="status === 'sending'"
        >
          <UiAppIcon name="send" class="size-4" /> {{ status === 'sending' ? 'Sending…' : web3formsKey ? 'Send message' : 'Send via email' }}
        </button>
        <p class="m-0 text-[.8rem] text-muted">
          Or email <a :href="`mailto:${email}`" class="text-wp-soft underline underline-offset-4">{{ email }}</a>
        </p>
      </div>
      <p v-if="status === 'error'" class="mt-4 text-[.88rem] text-danger" role="alert">
        Couldn't send: {{ errorMessage }} Please email {{ email }} directly.
      </p>
    </form>
  </div>
</template>
