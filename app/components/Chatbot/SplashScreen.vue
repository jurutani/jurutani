<script setup lang="ts">
defineProps<{
  onStart: () => void
}>()
</script>

<template>
  <UCard 
    class="w-80 border-2 border-green-400 shadow-2xl"
    :ui="{ 
      base: 'transform transition-all duration-500',
      body: { padding: 'p-6' }
    }"
  >
    <div class="text-center space-y-4">
      <!-- Logo -->
      <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
        <UIcon name="i-heroicons-microphone" class="w-10 h-10 text-green-600" />
      </div>
      
      <!-- Title -->
      <div>
        <h1 class="text-xl font-bold text-green-700 mb-2">
          Juru tani AI
        </h1>
        <p class="text-gray-600 text-sm">
          Asisten Penyuluh Juru tani
        </p>
      </div>

      <!-- Description -->
      <p class="text-gray-700 text-sm leading-relaxed">
        Konsultasi pertanian, peternakan, dan pembangunan. 
        Mari mulai percakapan untuk solusi terbaik!
      </p>

      <!-- Start Button -->
      <UButton
        color="green"
        size="lg"
        block
        class="hover:bg-green-700 transition-colors duration-200"
        @click="onStart"
      >
        Mulai Konsultasi
      </UButton>
    </div>
  </UCard>
</template>
