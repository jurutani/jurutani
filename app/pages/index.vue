<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Juru Tani Reborn | Solusi Pertanian Modern & Digital',
  description: 'Juru Tani Reborn adalah inovasi terbaru dari Politeknik Pembangunan Pertanian Yogyakarta Magelang untuk membantu petani Indonesia secara digital.',
  navOrder: 1,
  icon: 'i-mdi-home'
})

// SEO Meta Tags
useSeoMeta({
  // Basic Meta
  title: 'Juru Tani Reborn | Solusi Pertanian Modern & Digital',
  description: 'Juru Tani Reborn adalah platform inovatif dari Politeknik Pembangunan Pertanian Yogyakarta Magelang yang mendukung petani lokal dan pertanian berkelanjutan di Indonesia.',
  keywords: 'juru tani, pertanian digital, inovasi pertanian, polbangtan yogyakarta, petani indonesia, teknologi pertanian',
  author: 'Juru Tani Reborn Team',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  ogTitle: 'Juru Tani Reborn | Solusi Pertanian Modern & Digital',
  ogDescription: 'Platform pertanian digital dari Politeknik Pembangunan Pertanian Yogyakarta Magelang, membantu petani untuk masa depan Indonesia.',
  ogType: 'website',
  ogUrl: 'https://jurutani.com',
  ogSiteName: 'Juru Tani Reborn',
  ogImage: 'https://jurutani.com/jurutani.png',
  ogLocale: 'id_ID',

  // Twitter Cards
  twitterCard: 'summary_large_image',
  twitterSite: '@jurutani',
  twitterCreator: '@jurutani',
  twitterTitle: 'Juru Tani Reborn | Solusi Pertanian Modern & Digital',
  twitterDescription: 'Inovasi digital dari Polbangtan Yogyakarta Magelang untuk mendukung pertanian Indonesia.',
  twitterImage: 'https://jurutani.com/jurutani.png'
})
</script>

<template>
  <div class="m-0 p-0">
    <div class="m-0 p-0">
      <HeroSection />
      <WeatherSection class="mt-16" />
      <LaunchSale class="mt-16" />
      <HotDeals class="mt-16" />
      <FeatureSection class="mt-16" />
      <HomeSponsorship class="mt-16" />
      <ChatbotJurutani />
    </div>
  </div>
</template>


<style scoped></style>
