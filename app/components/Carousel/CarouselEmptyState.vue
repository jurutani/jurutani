<script setup lang="ts">
// Empty props - pure presentation component
</script>

<template>
  <UCard
    class="absolute inset-0 w-full h-screen max-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 border-0 shadow-none bg-opacity-0"
  >
    <template #header>
      <div class="text-center max-w-md mx-auto px-4">
        <div class="flex justify-center mb-4">
          <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-xl font-semibold text-white dark:text-gray-100 mb-2">
          Belum Ada Konten
        </h3>
        <p class="text-gray-300 dark:text-gray-400">
          Konten hero sedang tidak tersedia.
        </p>
      </div>
    </template>
  </UCard>
</template>
