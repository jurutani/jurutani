<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Juru Tani - Solusi Penyuluhan Modern',
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://jurutani.com/' }
  ],
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Juru Tani adalah solusi modern untuk penyuluhan dan pertanian digital di Indonesia.' },

    // SEO
    { name: 'keywords', content: 'Juru Tani, pertanian, penyuluhan, digital, polbangtan, petani, modern' },
    { name: 'author', content: 'Tim Juru Tani' },

    // Open Graph (untuk Facebook, WhatsApp, dsb)
    { property: 'og:title', content: 'Juru Tani - Solusi Penyuluhan Modern' },
    { property: 'og:description', content: 'Juru Tani membantu penyuluhan pertanian digital di seluruh Indonesia.' },
    { property: 'og:image', content: 'https://jurutani.com/og-image.png' },
    { property: 'og:url', content: 'https://jurutani.com/' },
    { property: 'og:type', content: 'website' },

    // Twitter Cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Juru Tani - Solusi Penyuluhan Modern' },
    { name: 'twitter:description', content: 'Platform digital untuk penyuluhan pertanian modern.' },
    { name: 'twitter:image', content: 'https://jurutani.com/og-image.png' },
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