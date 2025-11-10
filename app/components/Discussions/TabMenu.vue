<template>
    <div class="flex gap-2 overflow-x-auto">
      <UButton
        v-for="tab in tabs"
        :key="tab"
        :variant="modelValue === tab ? 'solid' : 'outline'"
        size="sm"
        class="rounded-full whitespace-nowrap px-4 py-2"
        @click="() => emit('update:modelValue', tab)"
      >
        {{ tab }}
      </UButton>
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
  