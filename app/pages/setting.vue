<script lang="ts" setup>
useSeoMeta({
  title: 'Setting - Juru Tani',
  description: 'Stay updated with the latest Setting from Juru Tani.',
  ogTitle: 'Setting - Juru Tani',
  ogDescription: 'Stay updated with the latest Setting from Juru Tani.',
})
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="lg:pt-20 p-6">
    <NuxtPage />
  </div>
</template>
