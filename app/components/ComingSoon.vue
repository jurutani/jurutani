<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-gradient-to-b from-green-50 via-green-100 to-white dark:from-green-950 dark:via-green-900 dark:to-green-950">
    <div class="mb-6">
      <UIcon name="i-twemoji:seedling" class="w-16 h-16 text-green-500 mb-4" />
      <h1 class="text-4xl font-extrabold text-green-700 dark:text-green-300 mb-2">
        Coming Soon 🌱
      </h1>
      <p class="text-green-800 dark:text-green-400 text-lg max-w-xl mx-auto">
        This page is growing... Just like a young seedling, it needs a bit more time. Stay tuned for updates from Juru Tani!
      </p>
    </div>
    <UButton
      label="Back to Home"
      to="/"
      color="green"
      variant="solid"
      size="lg"
      class="mt-4"
    />
  </div>
</template>
