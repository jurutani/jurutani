<script lang="ts" setup>
useSeoMeta({
  title: 'Security - Juru Tani',
  description: 'Stay updated with the latest Security from Juru Tani.',
  ogTitle: 'Security - Juru Tani',
  ogDescription: 'Stay updated with the latest Security from Juru Tani.',
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
