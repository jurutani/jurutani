<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Data untuk carousel
const carouselItems = [
  {
    id: 1,
    imageUrl: '/hero/bertani.jpg',
    caption: 'Pertanian Modern',
    title: 'Penyuluhan Digital',
    description: 'Ikuti penyuluhan digital seputar pertanian modern berbasis teknologi.',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '/discussions'
  },
  {
    id: 2,
    imageUrl: '/hero/pembelajaran-pertanian.jpg',
    caption: 'Bibit Unggul',
    title: 'Edukasi Pertanian',
    description: 'Pelajari teknik budidaya dan perawatan tanaman melalui edukasi pertanian berkualitas.',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '/courses'
  },
  {
    id: 3,
    imageUrl: '/hero/penjualan.jpg',
    caption: 'Alat Canggih',
    title: 'Marketplace Jurutani',
    description: 'Jelajahi berbagai produk pertanian di marketplace Jurutani.',
    buttonText: 'Kunjungi Marketplace',
    buttonLink: '/markets'
  },
  {
    id: 4,
    imageUrl: '/hero/diskusi-pertanian.jpg',
    caption: 'Update Terkini',
    title: 'Berita Terkini',
    description: 'Dapatkan informasi terbaru seputar dunia pertanian dan inovasi teknologi.',
    buttonText: 'Lihat Berita',
    buttonLink: '/news'
  },
  {
    id: 5,
    imageUrl: '/hero/pelatihan-pertanian.jpg',
    caption: 'Program Pelatihan',
    title: 'Pelatihan Jurutani',
    description: 'Ikuti pelatihan eksklusif dari Jurutani untuk meningkatkan keahlianmu.',
    buttonText: 'Ikuti Pelatihan',
    buttonLink: '/educations'
  },
  {
    id: 6,
    imageUrl: '/hero/pakar-pertanian.jpg',
    caption: 'Bersama Ahli',
    title: 'Konsultasi Pakar',
    description: 'Dapatkan solusi langsung dari pakar pertanian melalui sesi konsultasi.',
    buttonText: 'Konsultasikan Sekarang',
    buttonLink: '/discussions/expert'
  }
]

// State untuk carousel
const currentSlide = ref(0)
const autoplayInterval = ref(null)
const isTransitioning = ref(false)

// Touch/Swipe states - Simplified
const isSwiping = ref(false)
const startX = ref(0)
const startY = ref(0)
const swipeThreshold = 50

// Fungsi untuk mengatur slide
const goToSlide = (index) => {
  if (isTransitioning.value) return
  currentSlide.value = index
  triggerContentAnimation()
}

const nextSlide = () => {
  if (isTransitioning.value) return
  currentSlide.value = (currentSlide.value + 1) % carouselItems.length
  triggerContentAnimation()
}

const prevSlide = () => {
  if (isTransitioning.value) return
  currentSlide.value = (currentSlide.value - 1 + carouselItems.length) % carouselItems.length
  triggerContentAnimation()
}

// Animation trigger
const triggerContentAnimation = () => {
  isTransitioning.value = true
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

// Simplified Touch/Swipe events
const handleTouchStart = (e) => {
  if (isTransitioning.value) return
  
  isSwiping.value = true
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  stopAutoplay()
}

const handleTouchEnd = (e) => {
  if (!isSwiping.value) return
  
  const endX = e.changedTouches[0].clientX
  const endY = e.changedTouches[0].clientY
  const deltaX = endX - startX.value
  const deltaY = endY - startY.value
  
  isSwiping.value = false
  
  // Check if it's a horizontal swipe (not vertical scroll)
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0) {
      prevSlide() // Swipe right -> previous
    } else {
      nextSlide() // Swipe left -> next
    }
  }
  
  setTimeout(() => startAutoplay(), 100)
}

// Click handlers for desktop
const handleClick = (e) => {
  if (isTransitioning.value) return
  
  const rect = e.currentTarget.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const containerWidth = rect.width
  
  // Left half = previous, right half = next
  if (clickX < containerWidth / 2) {
    prevSlide()
  } else {
    nextSlide()
  }
}

// Autoplay functions
const startAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
  autoplayInterval.value = setInterval(() => {
    if (!isSwiping.value && !isTransitioning.value) {
      nextSlide()
    }
  }, 4000)
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
  setTimeout(() => startAutoplay(), 200)
}

onMounted(() => {
  startAutoplay()
  triggerContentAnimation()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<template>
  <section class="relative overflow-hidden select-none">
    <!-- Carousel Container -->
    <div 
      class="relative w-full h-screen max-h-screen cursor-pointer select-none"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <!-- Carousel Items -->
      <div 
        v-for="(item, index) in carouselItems" 
        :key="item.id"
        class="absolute inset-0 transition-all duration-1000 ease-out"
        :class="[
          currentSlide === index ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
        ]"
      >
        <!-- Background Image with Parallax Effect -->
        <div 
          class="w-full h-full bg-cover bg-center transition-transform duration-1000"
          :style="{ backgroundImage: `url(${item.imageUrl})` }"
          :class="[
            currentSlide === index ? 'scale-100' : 'scale-110'
          ]"
        >
          <!-- Modern Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
        </div>

        <!-- Content Box with Enhanced Animations -->
        <div class="absolute inset-0 flex items-center justify-center px-4">
          <div 
            class="text-center px-8 py-12 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl max-w-2xl w-full transform transition-all duration-1000"
            :class="[
              currentSlide === index && !isTransitioning 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-95'
            ]"
          >
            <!-- Caption with slide animation -->
            <p 
              class="text-green-400 font-semibold uppercase tracking-widest text-sm mb-3 transition-all duration-700 delay-200"
              :class="[
                currentSlide === index && !isTransitioning 
                  ? 'translate-x-0 opacity-100' 
                  : index % 2 === 0 ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'
              ]"
            >
              {{ item.caption }}
            </p>
            
            <!-- Title with opposite slide animation -->
            <h2 
              class="text-white text-5xl font-bold mb-6 leading-tight transition-all duration-700 delay-300"
              :class="[
                currentSlide === index && !isTransitioning 
                  ? 'translate-x-0 opacity-100' 
                  : index % 2 === 0 ? 'translate-x-8 opacity-0' : '-translate-x-8 opacity-0'
              ]"
            >
              {{ item.title }}
            </h2>
            
            <!-- Description with slide animation -->
            <p 
              class="text-gray-200 text-lg mb-8 leading-relaxed transition-all duration-700 delay-400"
              :class="[
                currentSlide === index && !isTransitioning 
                  ? 'translate-x-0 opacity-100' 
                  : index % 2 === 0 ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'
              ]"
            >
              {{ item.description }}
            </p>
            
            <!-- Button with scale animation -->
            <div 
              class="transition-all duration-700 delay-500"
              :class="[
                currentSlide === index && !isTransitioning 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-4 opacity-0 scale-95'
              ]"
            >
              <UButton
                :label="item.buttonText"
                :to="item.buttonLink"
                variant="outline"
                color="white"
                size="xl"
                class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg px-8 py-4 text-lg font-semibold rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Dots Indicators -->
      <div class="absolute bottom-8 inset-x-0 flex justify-center gap-3 z-20">
        <button
          v-for="(_, index) in carouselItems"
          :key="index"
          class="relative overflow-hidden rounded-full transition-all duration-500 hover:scale-110"
          :class="[
            currentSlide === index 
              ? 'w-12 h-3 bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
              : 'w-3 h-3 bg-white/40 hover:bg-white/60 backdrop-blur-sm'
          ]"
          @click="goToSlide(index)"
        >
          <!-- Active indicator glow effect -->
          <div 
            v-if="currentSlide === index"
            class="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"
          />
        </button>
      </div>

      <!-- Swipe/Click Indicators -->
      <div class="absolute bottom-24 inset-x-0 flex justify-center z-20">
        <div class="text-white/60 text-sm font-medium flex items-center gap-4 bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full">
          <!-- Mobile indicator -->
          <div class="flex items-center gap-2 md:hidden">
            <svg class="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3L8.59 4.41l5.17 5.17H2v2h11.76l-5.17 5.17L10 18l8-8-8-8z"/>
            </svg>
            Geser kiri/kanan
            <svg class="w-4 h-4 animate-pulse rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3L8.59 4.41l5.17 5.17H2v2h11.76l-5.17 5.17L10 18l8-8-8-8z"/>
            </svg>
          </div>
          <!-- Desktop indicator -->
          <div class="hidden md:flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
            Klik kiri/kanan untuk navigasi
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Modern glassmorphism effects */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Smooth cursor */
.cursor-pointer {
  cursor: pointer;
}

/* Prevent text selection during interaction */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Enhanced animations */
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Smooth transitions for better performance */
* {
  will-change: transform, opacity;
}

/* Button hover effects */
.UButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Enhanced glow effect for active dot */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
  }
}

.animate-pulse {
  animation: glow 2s ease-in-out infinite;
}
</style>