<script lang="ts" setup>
useSeoMeta({
  title: 'Profile - Juru Tani',
  description: 'Stay updated with the latest Profile from Juru Tani.',
  ogTitle: 'Profile - Juru Tani',
  ogDescription: 'Stay updated with the latest Profile from Juru Tani.',
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
