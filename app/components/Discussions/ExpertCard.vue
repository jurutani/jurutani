<template>
    <div class="p-4 border rounded-lg shadow hover:shadow-md transition">
      <h3 class="text-lg font-semibold text-green-700">{{ expert.name }}</h3>
      <p class="text-sm text-gray-600">{{ expert.category }}</p>
      <p class="text-sm text-gray-600">Kecamatan: {{ expert.district }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Expert {
    name: string
    category: string
    district: string
  }
  
  defineProps<{
    expert: Expert
  }>()
  </script>
  