<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  title: 'Juru Tani Reborn | Selamat Datang',
  description: 'Selamat datang di Juru Tani Reborn | Platform terdepan untuk penyuluhan modern dan siap membantu pertanian yang berkelanjutan di Indonesia.',
  keywords: 'juru tani Reborn, pertanian, agriculture, farming, Indonesia, teknologi pertanian, penyuluhan',
  ogTitle: 'Selamat Datang di Juru Tani Reborn',
  ogDescription: 'Platform terdepan untuk penyuluhan modern dan siap membantu pertanian yang berkelanjutan di Indonesia.',
  ogImage: 'https://jurutani.com/jurutani.png',
  ogUrl: 'https://jurutani.com',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Selamat Datang di Juru Tani Reborn',
  twitterDescription: 'Platform terdepan untuk penyuluhan modern dan siap membantu pertanian yang berkelanjutan di Indonesia.',
  twitterImage: 'https://jurutani.com/jurutani.png',
})

// SEO Meta tags
useSeoMeta({
  title: 'Juru Tani Reborn | Selamat Datang',
  description: 'Selamat datang di Juru Tani Reborn | Platform terdepan untuk penyuluhan modern dan siap membantu pertanian yang berkelanjutan di Indonesia.',
  keywords: 'juru tani Reborn, pertanian, agriculture, farming, Indonesia, teknologi pertanian, penyuluhan',
  author: 'Juru Tani Reborn Team',
  robots: 'index, follow',
  ogTitle: 'Selamat Datang di Juru Tani Reborn',
  ogDescription: 'Platform terdepan untuk penyuluhan modern dan siap membantu pertanian yang berkelanjutan di Indonesia.',
  ogImage: 'https://jurutani.com/jurutani.png',
  twitterImage: 'https://jurutani.com/jurutani.png',
  ogUrl: 'https://jurutani.com',
  ogType: 'website',
  ogSiteName: 'Juru Tani Reborn',
  twitterCard: 'summary_large_image',
  twitterSite: '@jurutani',
  twitterCreator: '@jurutani',
  twitterTitle: 'Selamat Datang di Juru Tani Reborn',
  twitterDescription: 'Platform terdepan untuk penyuluhan modern dan siap membantu pertanian yang berkelanjutan di Indonesia.',
})

// Structured Data
useSchemaOrg([
  {
    '@type': 'WebSite',
    name: 'Juru Tani Reborn',
    url: 'https://jurutani.com',
    description: 'Platform terdepan untuk penyuluhan modern dan berkelanjutan di Indonesia.',
    publisher: {
      '@type': 'Organization',
      name: 'Politeknik Pembangunan Pertanian Yogyakarta Magelang'
    }
  },
  {
    '@type': 'Organization',
    name: 'Juru Tani Reborn',
    url: 'https://jurutani.com',
    logo: 'https://jurutani.com/jurutani.png',
    description: 'Platform terdepan untuk penyuluhan modern dan berkelanjutan di Indonesia.',
    foundingLocation: {
      '@type': 'Place',
      name: 'Yogyakarta, Magelang, Indonesia'
    }
  }
])
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gradient-to-br from-green-50 via-emerald-100 to-lime-50 py-8">
    <div class="max-w-md w-full space-y-6">
      <!-- Logo -->
      <div class="flex justify-center">
        <TheLogo class="h-24" />
      </div>

      <!-- Main Content -->
      <div class="space-y-4">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-emerald-800 leading-tight">
          Selamat Datang di Juru Tani!
        </h1>
        <p class="text-base md:text-lg text-gray-700 max-w-sm mx-auto">
          Terima kasih telah mengunjungi website kami.
        </p>
      </div>

      <!-- CTA Button -->
      <div class="pt-2">
        <NuxtLink
          to="/"
          class="inline-block px-8 py-3 bg-emerald-600 text-white text-sm md:text-base font-medium rounded-lg hover:bg-emerald-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Masuk ke Beranda
        </NuxtLink>
      </div>

      <!-- Sponsored by section -->
      <div class="pt-6 space-y-3">
        <p class="text-xs md:text-sm text-green-600/70 font-medium">
          Sponsored by:
        </p>
        <div class="flex justify-center">
          <img 
            src="/logo/sponsor1.png" 
            alt="Sponsor Logo" 
            class="h-12 md:h-16 lg:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
          >
        </div>
      </div>

      <!-- Powered by section -->
      <div class="pt-4 border-t border-green-200/30 text-center">
        <p class="text-xs md:text-sm text-green-600/60">
          Powered by : <br>
          <a 
            href="https://kairav-portfolio.vercel.app/" 
            target="_blank"
            class="font-medium hover:text-green-600 transition-colors underline decoration-dotted ml-1"
          >
            Politeknik Pembangunan Pertanian Yogyakarta Magelang
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

