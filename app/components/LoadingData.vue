<script setup lang="ts">
// Props
const props = defineProps({
  message: {
    type: String,
    default: 'Memuat data produk pertanian...'
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <UIcon 
      name="i-heroicons-arrow-path" 
      class="w-8 h-8 text-green-600 animate-spin mb-4"
    />
    
    <div class="text-center space-y-2">
      <p class="text-green-800 font-medium flex items-center gap-2">
        <span>🌱</span>
        {{ message }}
      </p>
      <p class="text-green-600 text-sm">Mohon tunggu sebentar...</p>
    </div>
  </div>
</template>