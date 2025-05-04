<template>
    <div class="w-full">
      <input
        type="text"
        :value="modelValue"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Cari penyuluh, kelompok, atau kata kunci..."
        @input="(e) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
      >
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: string
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
  </script>
  