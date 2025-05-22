<script setup lang="ts">
  import siteMeta from '@/site'
  const { title, logo } = siteMeta
</script>
<template>
  <ULink data-pg-name="Logo" class="flex items-center sm:flex-row" to="/">
    <img src="/jurutani.png" alt="Logo" class="w-10 h-10" >
    <div class="text-2xl font-bold flex space-x-1">
      <span class="text-green-700">Juru</span>
      <span class="text-lime-400">Tani</span>
    </div>

  </ULink>
</template>
<style scoped></style>
