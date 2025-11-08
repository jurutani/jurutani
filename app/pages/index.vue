<script setup lang="ts">
definePageMeta({
  layout: 'default',
  navOrder: 1,
  icon: 'i-mdi-home'
})

// SEO Optimization
useSeoOptimized('home')
</script>

<template>
      <HeroSection />
      <WeatherSection class="mt-16" />
      <LaunchSale class="mt-16" />
      <HotDeals class="mt-16" />
      <FeatureSection class="mt-16" />
      <HomeSponsorship class="mt-16" />
      <ChatbotJurutani />
</template>


<style scoped></style>
