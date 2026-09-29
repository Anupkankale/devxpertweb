<template>
  <div>
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-wp focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-white"
    >Skip to content</a>
    <LayoutParticleCanvas />
    <LayoutAppHeader />
    <main id="main">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>
