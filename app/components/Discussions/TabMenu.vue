<template>
    <div class="flex gap-2 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="[
          'px-4 py-2 rounded-full whitespace-nowrap',
          modelValue === tab
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-green-100'
        ]"
        @click="() => emit('update:modelValue', tab)"
      >
        {{ tab }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: string
    tabs: string[]
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()
  </script>
  