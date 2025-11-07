<script setup lang="ts">
defineProps<{
  onClick: () => void
}>()
</script>

<template>
  <UButton
    class="w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden border-2 border-green-400"
    @click="onClick"
  >
    <img 
      src="/chatbot.png" 
      alt="Chatbot" 
      class="w-full h-full object-cover"
    >
  </UButton>
  <!-- Notification dot -->
  <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"/>
</template>
