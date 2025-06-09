<script setup lang="ts">
  import { heroImageUrl } from '@/utils/hero'

  definePageMeta({
    title: 'Home',
    description: 'Juru Tani',
    navOrder: 1,
    icon: 'i-mdi-home',
  })

  const { optimizeImage } = useOptimizeImage()
  const heroImageOptimized = {
    alt: `hero`,
    cover: true,
    ...optimizeImage(
      heroImageUrl,
      {
      },
      true /* return bgStyles */,
    ),
  }

  const heroImage = heroImageOptimized.src
  const bgStyles = heroImageOptimized.bgStyles
</script>
<template>
  <div>
    <HeroSection />
    <UContainer class="pt-8">
       <WeatherSection />
     </UContainer>
    <UContainer class="pt-8">
      <LaunchSale class="mt-8" />
      <HotDeals class="mt-8" />
    </UContainer>
    <UContainer class="pt-8">
      <FeatureSection class="mt-8" />
    </UContainer>
  </div>
</template>
<style scoped></style>
