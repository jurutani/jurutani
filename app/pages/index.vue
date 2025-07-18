<script setup lang="ts">
definePageMeta({
  layout: 'default', // pastikan ini ada
  title: 'Home - Juru Tani Reborn',
  description: 'Juru Tani Reborn',
  navOrder: 1,
  icon: 'i-mdi-home',
})
</script>

<template>
  <div>
    <HeroSection />
    <UContainer class="py-8 gap">
      <WeatherSection class="mt-16"/>
      <LaunchSale class="mt-16" />
      <HotDeals class="mt-16" />
      <FeatureSection class="mt-16" />
      <HomeSponsorship class="mt-16" />
    </UContainer>
    <ChatbotJurutani />
  </div>
</template>

<style scoped></style>
