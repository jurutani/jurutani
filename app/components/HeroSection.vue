<script setup lang="ts">
import { useHeroData } from '~/composables/useHeroData'
import { useCarousel } from '~/composables/useCarousel'

// Use hero data composable
const { carouselItems, error, loading, isInitialized, getImageUrl, fetchHeroData } = useHeroData()

// Computed for items count
const itemsCount = computed(() => carouselItems.value.length)

// Use carousel composable
const {
  currentSlide,
  isTransitioning,
  isMobile,
  goToSlide,
  handleTouchStart,
  handleTouchEnd,
  handleClick,
  handleMouseEnter,
  handleMouseLeave
} = useCarousel(itemsCount)

// Fetch data on client side only
onMounted(async () => {
  if (!process.client) return
  
  try {
    // console.log('Fetching hero data...')
    await fetchHeroData()
    // console.log('Hero data loaded:', carouselItems.value.length, 'items')
  } catch (err) {
    // console.error('Failed to fetch hero data:', err)
  }
})
</script>

<template>
  <section class="relative overflow-hidden select-none">
    <!-- Loading State -->
    <CarouselLoadingState v-if="loading" />

    <!-- Error State -->
    <CarouselErrorState
      v-else-if="error"
      :error="error"
      :on-retry="fetchHeroData"
    />

    <!-- Empty State - Only show after initialization -->
    <CarouselEmptyState v-else-if="isInitialized && carouselItems.length === 0" />

    <!-- Carousel Container -->
    <div
      v-else-if="carouselItems.length > 0"
      class="relative w-full h-screen max-h-screen cursor-pointer select-none"
      :class="{ 'cursor-default': isMobile }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <!-- Background Container -->
      <CarouselBackground
        :items="carouselItems"
        :current-slide="currentSlide"
        :get-image-url="getImageUrl"
      />

      <!-- Carousel Items -->
      <div
        v-for="(item, index) in carouselItems"
        :key="item.id"
        class="absolute inset-0 transition-all duration-1000 ease-out"
        :class="[currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0']"
      >
        <CarouselSlideContent
          :item="item"
          :index="index"
          :current-slide="currentSlide"
          :is-transitioning="isTransitioning"
        />
      </div>

      <!-- Dots Indicators -->
      <CarouselDots
        v-if="carouselItems.length > 1"
        :total-slides="carouselItems.length"
        :current-slide="currentSlide"
        :on-slide-change="goToSlide"
      />

      <!-- Navigation Hint -->
      <CarouselNavigationHint v-if="carouselItems.length > 1" />
    </div>
  </section>
</template>

<style scoped>
/* Hardware acceleration for smoother animations */
.transition-all,
.transition-transform,
.transition-opacity {
  will-change: transform, opacity;
  transform: translateZ(0);
}
</style>
