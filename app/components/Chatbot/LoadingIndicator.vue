<script setup lang="ts">
defineProps<{
  maxWidth: string
}>()
</script>

<template>
  <div class="flex justify-start animate-fade-in">
    <div
      :class="[
        maxWidth,
        'px-3 py-2 rounded-lg bg-white text-gray-800 mr-4 border border-gray-200 shadow-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
      ]"
    >
      <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center border border-green-200 dark:bg-green-900 dark:border-green-800">
          <NuxtImg 
            src="/jurutani.png" 
            alt="Chatbot" 
            class="w-3 h-3 text-green-600 dark:text-green-300"
          />
        </div>
        <div class="flex items-center space-x-2">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
            <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.1s" />
            <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.2s" />
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-300">Mengetik...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
