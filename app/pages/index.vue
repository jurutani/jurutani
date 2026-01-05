<script setup lang="ts">
import { getHomePageSchemas, useJsonLdSchemas } from '@/composables/useJsonLdSchema'

definePageMeta({
  layout: 'default',
  navOrder: 1,
  icon: 'mdi:home'
})

// SEO Optimization with Publisher & Author
useSeoOptimized('home')

// Inject JSON-LD Schemas untuk improved SEO
const schemas = getHomePageSchemas()
useJsonLdSchemas(schemas)
</script>

<template>
  <div>
    <HeroSection />
    <WeatherSection class="mt-16" />
    <LaunchSale class="mt-16" />
    <HotDeals class="mt-16" />
    <FeatureSection class="mt-16" />
    <HomeSponsorship class="mt-16" />
    <HomeTestimoni />
    <ChatbotJurutani />
  </div>
</template>


<style scoped></style>
