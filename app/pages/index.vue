<script setup lang="ts">
definePageMeta({
  layout: 'default', // pastikan ini ada
  title: 'Home - Juru Tani',
  description: 'Juru Tani',
  navOrder: 1,
  icon: 'i-mdi-home',
})
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
    <UContainer class="pt-8">
      <HomeSponsorship class="mt-8" />
    </UContainer>
    <ChatbotJurutani />
  </div>
</template>

<style scoped></style>
