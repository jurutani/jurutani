<script setup lang="ts">
interface Props {
  error: string
  onRetry: () => void
}

defineProps<Props>()
</script>

<template>
  <UCard
    class="absolute inset-0 w-full h-screen max-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-orange-900 dark:from-red-950 dark:via-red-900 dark:to-orange-950 border-0 shadow-none bg-opacity-0"
  >
    <template #header>
      <div class="text-center max-w-md mx-auto px-4">
        <div class="flex justify-center mb-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 dark:text-red-300" />
        </div>
        <h3 class="text-xl font-semibold text-white dark:text-gray-100 mb-2">
          Terjadi Kesalahan
        </h3>
        <p class="text-red-200 dark:text-red-300">{{ error }}</p>
      </div>
    </template>

    <div class="flex justify-center">
      <UButton
        @click="onRetry"
        color="red"
        size="md"
        class="px-6"
      >
        Coba Lagi
      </UButton>
    </div>
  </UCard>
</template>
