<script setup lang="ts">
import siteMeta from '@/site'
const { title } = siteMeta
</script>

<template>
  <NuxtLink 
    to="/" 
    class="flex items-center transition-transform duration-300 hover:scale-105"
    aria-label="Kembali ke beranda"
  >
    <NuxtImg 
      src="/jurutani.png" 
      alt="Logo Juru Tani" 
      class="h-10 w-auto"
      loading="eager"
    />
  </NuxtLink>
</template>

<style scoped></style>
