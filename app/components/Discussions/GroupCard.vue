<template>
    <div
      class="p-4 border rounded-lg shadow hover:shadow-md transition cursor-pointer"
      @click="emit('join', group.id)"
    >
      <h3 class="text-lg font-semibold text-green-700">{{ group.name }}</h3>
      <p class="text-sm text-gray-600">Kategori: {{ group.category }}</p>
      <p class="text-sm text-gray-600">Wilayah: {{ group.district }}</p>
      <p class="text-xs text-gray-500">Anggota: {{ group.members_count }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Group {
    id: string
    name: string
    category: string
    district: string
    members_count: number
  }
  
  defineProps<{
    group: Group
  }>()
  
  const emit = defineEmits<{
    (e: 'join', id: string): void
  }>()
  </script>
  