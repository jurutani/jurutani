<script setup lang="ts">
  import siteMeta from '@/site'
  const { title, logo } = siteMeta
</script>

<template>
  <ULink data-pg-name="Logo" class="flex items-center" to="/">
    <div class="flex items-center text-4xl font-bold">
      <!-- Juru text in orange -->
      <span class="text-orange-500">Juru</span>
      
      <!-- Logo image from the center of the design -->
      <img src="/jurutani.png" alt="JuruTani Logo" class="w-12 h-12 mx-2">
      
      <!-- Tani text in dark green/teal -->
      <span class="text-teal-700">Tani</span>
    </div>
  </ULink>
</template>

<style scoped></style>