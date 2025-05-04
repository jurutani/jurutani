<template>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="district in districts"
        :key="district"
        @click="() => emit('update:modelValue', district)"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium',
          modelValue === district
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-green-100'
        ]"
      >
        {{ district }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: string
    districts: string[]
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
  </script>
  