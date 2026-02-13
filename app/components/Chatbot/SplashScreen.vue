<script setup lang="ts">
defineProps<{
  onStart: () => void
}>()
</script>

<template>
  <UCard 
    class="w-80 border-2 border-green-400 shadow-2xl dark:border-green-400 dark:bg-gray-900"
    :ui="{ 
      base: 'transform transition-all duration-500',
      body: { padding: 'p-6' }
    }"
  >
    <div class="text-center space-y-4">
      <!-- Logo -->
      <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg dark:bg-green-900">
        <NuxtImg
          src="/jurutani.png" 
          alt="Chatbot" 
          class="w-10 h-10 text-green-600 dark:text-green-300"
      />
      </div>
      
      <!-- Title -->
      <div>
        <h1 class="text-xl font-bold text-green-700 mb-2 dark:text-green-300">
          JuruTani AI
        </h1>
        <p class="text-gray-600 text-sm dark:text-gray-300">
          Asisten Penyuluh JuruTani
        </p>
      </div>

      <!-- Description -->
      <p class="text-gray-700 text-sm leading-relaxed dark:text-gray-300">
        Konsultasi pertanian, peternakan, dan pembangunan. 
        Mari mulai percakapan untuk solusi terbaik!
      </p>

      <!-- Start Button -->
      <UButton
        color="success"
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
