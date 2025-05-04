<template>
    <div class="p-4 border rounded-lg shadow hover:shadow-md transition">
      <h3 class="text-lg font-semibold text-green-700">{{ penyuluh.name }}</h3>
      <p class="text-sm text-gray-600">Wilayah: {{ penyuluh.district }}</p>
      <p class="text-sm text-gray-600">Kategori: {{ penyuluh.category }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Penyuluh {
    name: string
    district: string
    category: string
  }
  
  defineProps<{
    penyuluh: Penyuluh
  }>()
  </script>
  