<script setup lang="ts">
  import siteMeta from '@/site'
  const { title, logo } = siteMeta
</script>
<template>
  <ULink data-pg-name="Logo" class="flex items-center sm:flex-row" to="/">
    <img src="/jurutanicon.png" alt="Logo" class="w-10 h-10" >
    <h6
      class="text-primary-600 dark:text-primary-200 font-extrabold font-serif ml-2 mt-4 text-2xl"
    >
      {{ title }}
    </h6>
  </ULink>
</template>
<style scoped></style>
