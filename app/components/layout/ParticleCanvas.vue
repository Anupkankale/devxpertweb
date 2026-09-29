<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>()
let stop: (() => void) | undefined

onMounted(() => {
  if (!canvas.value || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  stop = startParticles(canvas.value)
})

onBeforeUnmount(() => stop?.())
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 z-0 size-full opacity-50 motion-reduce:hidden"
  />
</template>
