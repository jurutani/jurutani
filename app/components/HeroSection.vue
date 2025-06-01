<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Data untuk carousel
const carouselItems = [
  {
    id: 1,
    imageUrl: '/hero/pertanian.png',
    caption: 'Pertanian Modern',
    title: 'Teknologi Hidroponik',
    description: 'Tingkatkan hasil panen dengan metode pertanian modern tanpa tanah.',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '/news'
  },
  {
    id: 2,
    imageUrl: '/hero/bibit-pertanian.png',
    caption: 'Agrikultur Terbaik',
    title: 'Bibit Unggul',
    description: 'Dapatkan bibit tanaman unggul dengan kualitas terbaik untuk hasil maksimal.',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '/markets'
  },
  {
    id: 3,
    imageUrl: '/hero/alat-pertanian.png',
    caption: 'Alat Pertanian',
    title: 'Peralatan Modern',
    description: 'Tingkatkan efisiensi dengan alat pertanian berteknologi terkini.',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '/tools'
  },
  {
    id: 4,
    imageUrl: '/hero/pertanian2.png',
    caption: 'Pertanian Organik',
    title: 'Pupuk Organik Premium',
    description: 'Perkaya tanah dan pertumbuhan tanaman dengan nutrisi alami terbaik.',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '/markets'
  }
]

// State untuk carousel
const currentSlide = ref(0)
const autoplayInterval = ref(null)

// Fungsi untuk mengatur slide
const goToSlide = (index) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselItems.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + carouselItems.length) % carouselItems.length
}

// Autoplay functions
const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

// Mouse handlers for pausing autoplay on hover
const handleMouseEnter = () => {
  stopAutoplay()
}

const handleMouseLeave = () => {
  startAutoplay()
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Carousel Container -->
    <div 
      class="relative w-full h-screen max-h-screen"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Carousel Items -->
      <div 
        v-for="(item, index) in carouselItems" 
        :key="item.id"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-black"
        :class="[
          currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
        ]"
      >
        <!-- Background Image -->
        <div 
          class="w-full h-full bg-cover bg-center"
          :style="{ backgroundImage: `url(${item.imageUrl})` }"
        >
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-50"/>
        </div>

        <!-- Content Box - Always Visible -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center px-6 py-10 rounded-xl backdrop-blur-sm bg-black bg-opacity-30 border border-green-500 border-opacity-30 w-full max-w-lg">
            <p class="text-green-300 font-medium uppercase tracking-wider text-sm mb-2 animate-fadeIn">
              {{ item.caption }}
            </p>
            <h2 class="text-white text-4xl font-bold mb-4 animate-slideUp">
              {{ item.title }}
            </h2>
            <p class="text-gray-200 mb-6 animate-slideUp animation-delay-200">
              {{ item.description }}
            </p>
            <div class="animate-slideUp animation-delay-400">
              <UButton
                :label="item.buttonText"
                :to="item.buttonLink"
                variant="outline"
                color="white"
                size="xl"
                class="bg-green-600 hover:bg-green-700 border-none transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <div class="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-20 flex justify-between px-4">
        <button 
          class="w-12 h-12 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white flex items-center justify-center border border-white border-opacity-30 transition-all duration-300 hover:scale-110" 
          @click.prevent="prevSlide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          class="w-12 h-12 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white flex items-center justify-center border border-white border-opacity-30 transition-all duration-300 hover:scale-110" 
          @click.prevent="nextSlide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Dots Indicators -->
      <div class="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-20">
        <button
          v-for="(_, index) in carouselItems"
          :key="index"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="[
            currentSlide === index 
              ? 'bg-green-500 w-10' 
              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
          ]"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.8s ease-out;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  animation-fill-mode: both;
}
</style>