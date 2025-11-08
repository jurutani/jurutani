<script setup lang="ts">
import { useHead } from '#imports'

// Minimal global head setup - SEO details ditangani oleh seo.ts per page
useHead({
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  ],
})
</script>


<template>
    <NuxtLoadingIndicator />
    <FirstVisitModal />
    <AppModal /> <!-- ⬅️ Tambahkan di sini juga bisa -->
    <AppToast /> <!-- ⬅️ Tambahkan di sini juga bisa -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
</template>