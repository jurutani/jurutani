<script setup lang="ts">
// Props
const props = defineProps({
  message: {
    type: String,
    default: 'Terjadi kesalahan saat memuat data produk.'
  },
  showRetry: {
    type: Boolean,
    default: true
  }
});

// Emits
const emit = defineEmits(['retry']);

// Methods
const handleRetry = () => {
  emit('retry');
};
</script>

<template>
  <UAlert
    icon="i-heroicons-exclamation-triangle"
    color="red"
    variant="soft"
    title="Oops! Ada masalah di kebun 🌧️"
    :description="message"
  >
    <template #actions>
      <UButton 
        v-if="showRetry"
        @click="handleRetry"
        color="green" 
        variant="outline" 
        size="xs"
        icon="i-heroicons-arrow-path"
      >
        Coba Lagi
      </UButton>
    </template>
  </UAlert>
</template>