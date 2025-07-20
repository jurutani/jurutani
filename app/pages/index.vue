<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Beranda - Juru Tani Reborn',
  description: 'Juru Tani Reborn adalah inovasi pertanian dari Politeknik Pembangunan dan Pertanian Yogyakarta Magelang, membantu petani untuk Indonesia.',
  navOrder: 1,
  icon: 'i-mdi-home'
})

// SEO Meta Tags
useSeoMeta({
  title: 'Beranda - Juru Tani Reborn',
  description: 'Juru Tani Reborn adalah inovasi pertanian dari Politeknik Pembangunan dan Pertanian Yogyakarta Magelang, membantu petani untuk Indonesia.',
  keywords: 'juru tani, pertanian indonesia, petani digital, inovasi pertanian, polbangtan yogyakarta, polbangtan magelang, teknologi petani',
  author: 'Juru Tani Reborn Team',
  robots: 'index, follow',

  ogTitle: 'Beranda - Juru Tani Reborn',
  ogDescription: 'Inovasi pertanian dari Politeknik Pembangunan dan Pertanian Yogyakarta Magelang, membantu petani untuk Indonesia.',
  ogType: 'website',
  ogUrl: 'https://jurutani.com',
  ogSiteName: 'Juru Tani Reborn',
  ogImage: 'https://jurutani.com/logo/sponsor1.png',

  twitterCard: 'summary_large_image',
  twitterSite: '@jurutani',
  twitterCreator: '@jurutani',
  twitterTitle: 'Beranda - Juru Tani Reborn',
  twitterDescription: 'Inovasi pertanian dari Politeknik Pembangunan dan Pertanian Yogyakarta Magelang, membantu petani untuk Indonesia.',
  twitterImage: 'https://jurutani.com/logo/sponsor1.png'
})
</script>

<template>
  <div>
    <HeroSection />
    <div class="py-8 gap">
      <WeatherSection class="mt-16"/>
      <LaunchSale class="mt-16" />
      <HotDeals class="mt-16" />
      <FeatureSection class="mt-16" />
      <HomeSponsorship class="mt-16" />
    </div>
    <ChatbotJurutani />
  </div>
</template>

<style scoped></style>
