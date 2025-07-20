<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Juru Tani - Solusi Penyuluhan Modern',
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
  meta: [
    { charset: 'utf-8' },
    { name: 'og:image', content: 'https://jurutani.com/og-image.png' },
    { name: 'twitter:image', content: 'https://jurutani.com/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
    <NuxtLoadingIndicator />
    <AppModal /> <!-- ⬅️ Tambahkan di sini juga bisa -->
    <AppToast /> <!-- ⬅️ Tambahkan di sini juga bisa -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
</template>