<script setup lang="ts">
// Note: SEO meta ditangani di level page component menggunakan functions dari seo.ts
// - useSeoOptimized() untuk static pages
// - useSeoAuth() untuk auth pages
// - useSeoDetail() untuk dynamic pages
//
// Layout hanya handle UI/layout, bukan SEO
useOgImage()
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Background gradient -->
    <div
      class="absolute inset-0 z-0 bg-gradient-to-b from-green-50 via-green-100 to-blue-50 dark:from-green-950 dark:via-green-800 dark:to-green-950"
    />

    <!-- Decorative blur circles -->
    <div class="absolute top-20 left-10 w-72 h-72 bg-green-200 dark:bg-green-800 rounded-full opacity-20 blur-3xl"/>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl"/>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-100 dark:bg-green-700 rounded-full opacity-10 blur-2xl"/>

    <!-- Main content -->
    <div
      class="relative z-10 min-h-screen flex flex-col bg-transparent text-green-900 dark:text-green-100"
    >
      <NavBar />
      <main>
        <slot />
      </main>
      <TheFooter />
    </div>
  </div>
</template>

<style scoped>
/* Optional: smooth transition for color changes */
body {
  transition: background-color 0.5s, color 0.5s;
}
</style>
