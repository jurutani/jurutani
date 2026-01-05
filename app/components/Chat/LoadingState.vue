<template>
  <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
    <div class="text-center p-8">
      <div class="relative mb-6">
        <!-- Animated agricultural icon -->
        <div class="relative inline-block">
          <UIcon 
            name="i-heroicons-arrow-path" 
            class="w-16 h-16 animate-spin text-green-500 dark:text-green-400 mx-auto"
          />
          <UIcon 
            name="i-heroicons-sparkles" 
            class="w-8 h-8 text-green-400 dark:text-green-500 absolute -top-2 -right-2 animate-pulse"
          />
        </div>
      </div>
      
      <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
        Memuat Juru Tani Chat
      </h3>
      <p class="text-green-600 dark:text-green-400 text-sm mb-6">
        Menyiapkan conversation dengan ahli pertanian...
      </p>
      
      <!-- Progress dots with staggered animation -->
      <div class="flex justify-center gap-2 mt-4">
        <div 
          v-for="i in 3" 
          :key="i"
          class="w-2.5 h-2.5 bg-green-500 dark:bg-green-400 rounded-full animate-bounce"
          :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for loading state - pure presentational component
</script>