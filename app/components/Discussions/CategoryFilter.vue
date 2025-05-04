<template>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="category in categories"
        :key="category"
        @click="() => emit('update:modelValue', category)"
        :class="[
          'px-3 py-1 rounded-full text-sm',
          modelValue === category
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-green-100'
        ]"
      >
        {{ category }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: string
    categories: string[]
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
  </script>
  