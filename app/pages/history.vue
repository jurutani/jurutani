<script lang="ts" setup>
useSeoMeta({
  title: 'History - Juru Tani',
  description: 'Stay updated with the latest History from Juru Tani.',
  ogTitle: 'History - Juru Tani',
  ogDescription: 'Stay updated with the latest History from Juru Tani.',
})
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="lg:pt-24 pt-20">
    <NuxtPage />
  </div>
</template>
