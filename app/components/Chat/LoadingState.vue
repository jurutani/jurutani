<!-- components/chat/LoadingState.vue -->
<template>
  <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-green-25 to-emerald-25">
    <div class="text-center p-8">
      <div class="relative mb-6">
        <!-- Animated JuruTani logo/icon -->
        <div class="relative">
          <UIcon 
            name="i-heroicons-arrow-path" 
            class="w-12 h-12 animate-spin text-green-500 mx-auto"
          />
          <UIcon 
            name="i-heroicons-leaf" 
            class="w-6 h-6 text-green-400 absolute -top-1 -right-1 animate-pulse"
          />
        </div>
      </div>
      
      <h3 class="text-lg font-bold text-green-800 mb-2">
        Memuat Juru Tani Chat
      </h3>
      <p class="text-green-600 text-sm">
        Menyiapkan conversation dengan ahli pertanian...
      </p>
      
      <!-- Progress dots -->
      <div class="flex justify-center space-x-1 mt-4">
        <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce"/>
        <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"/>
        <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for loading state
</script>