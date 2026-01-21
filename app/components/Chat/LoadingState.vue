<template>
  <div class="flex-1 flex items-center justify-center">
    <div class="text-center p-8">

      <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
        Memuat JuruTani Chat
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