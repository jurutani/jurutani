<script setup lang="ts">
  import siteMeta from '@/site'
  const { title } = siteMeta
</script>
<template>
  <NuxtLink data-pg-name="Logo" class="flex items-center sm:flex-row" to="/">
    <NuxtImg src="/LOGO02.png" alt="Logo" class="h-10" />
  </NuxtLink>
</template>
<style scoped></style>