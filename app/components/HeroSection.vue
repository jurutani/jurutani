<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'

// Data untuk carousel dengan multiple image sizes
const carouselItems = [
  {
    id: 1,
    imageUrl: {
      mobile: '/hero/bertani-mobile.webp',
      tablet: '/hero/bertani-tablet.webp',
      desktop: '/hero/bertani.webp',
      blur: '/hero/bertani-blur.webp' // Very small blur placeholder
    },
    caption: 'Pertanian Modern',
    title: 'Penyuluhan Digital',
    description: 'Ikuti penyuluhan digital seputar pertanian modern berbasis teknologi.',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '/discussions'
  },
  {
    id: 2,
    imageUrl: {
      mobile: '/hero/pembelajaran-pertanian-mobile.webp',
      tablet: '/hero/pembelajaran-pertanian-tablet.webp',
      desktop: '/hero/pembelajaran-pertanian.webp',
      blur: '/hero/pembelajaran-pertanian-blur.webp'
    },
    caption: 'Bibit Unggul',
    title: 'Edukasi Pertanian',
    description: 'Pelajari teknik budidaya dan perawatan tanaman melalui edukasi pertanian berkualitas.',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '/courses'
  },
  {
    id: 3,
    imageUrl: {
      mobile: '/hero/penjualan-mobile.webp',
      tablet: '/hero/penjualan-tablet.webp',
      desktop: '/hero/penjualan.webp',
      blur: '/hero/penjualan-blur.webp'
    },
    caption: 'Alat Canggih',
    title: 'Marketplace Jurutani',
    description: 'Jelajahi berbagai produk pertanian di marketplace Jurutani.',
    buttonText: 'Kunjungi Marketplace',
    buttonLink: '/markets'
  },
  {
    id: 4,
    imageUrl: {
      mobile: '/hero/diskusi-pertanian-mobile.webp',
      tablet: '/hero/diskusi-pertanian-tablet.webp',
      desktop: '/hero/diskusi-pertanian.webp',
      blur: '/hero/diskusi-pertanian-blur.webp'
    },
    caption: 'Update Terkini',
    title: 'Berita Terkini',
    description: 'Dapatkan informasi terbaru seputar dunia pertanian dan inovasi teknologi.',
    buttonText: 'Lihat Berita',
    buttonLink: '/news'
  },
  {
    id: 5,
    imageUrl: {
      mobile: '/hero/pelatihan-pertanian-mobile.webp',
      tablet: '/hero/pelatihan-pertanian-tablet.webp',
      desktop: '/hero/pelatihan-pertanian.webp',
      blur: '/hero/pelatihan-pertanian-blur.webp'
    },
    caption: 'Program Pelatihan',
    title: 'Pelatihan Jurutani',
    description: 'Ikuti pelatihan eksklusif dari Jurutani untuk meningkatkan keahlianmu.',
    buttonText: 'Ikuti Pelatihan',
    buttonLink: '/educations'
  },
  {
    id: 6,
    imageUrl: {
      mobile: '/hero/pakar-pertanian-mobile.webp',
      tablet: '/hero/pakar-pertanian-tablet.webp',
      desktop: '/hero/pakar-pertanian.webp',
      blur: '/hero/pakar-pertanian-blur.webp'
    },
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

// Image loading states
const loadedImages = ref(new Set())
const isSlowConnection = ref(false)
const connectionQuality = ref('high') // 'high', 'medium', 'low'

// Touch/Swipe states - Simplified
const isSwiping = ref(false)
const startX = ref(0)
const startY = ref(0)
const swipeThreshold = 50

// Device detection
const isMobile = ref(false)
const isTablet = ref(false)

// Detect connection quality
const detectConnectionQuality = () => {
  if ('connection' in navigator) {
    const conn = navigator.connection
    const effectiveType = conn.effectiveType
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      connectionQuality.value = 'low'
      isSlowConnection.value = true
    } else if (effectiveType === '3g') {
      connectionQuality.value = 'medium'
      isSlowConnection.value = false
    } else {
      connectionQuality.value = 'high'
      isSlowConnection.value = false
    }
  }
}

// Detect device type
const detectDevice = () => {
  const width = window.innerWidth
  isMobile.value = width < 768
  isTablet.value = width >= 768 && width < 1024
}

// Get appropriate image URL based on device and connection
const getOptimizedImageUrl = (imageUrls) => {
  if (isSlowConnection.value) {
    return imageUrls.blur
  }
  
  if (isMobile.value) {
    return imageUrls.mobile
  }
  
  if (isTablet.value) {
    return imageUrls.tablet
  }
  
  return imageUrls.desktop
}

// Preload critical images (current, next, previous)
const preloadCriticalImages = () => {
  const indicesToPreload = [
    currentSlide.value,
    (currentSlide.value + 1) % carouselItems.length,
    (currentSlide.value - 1 + carouselItems.length) % carouselItems.length
  ]
  
  indicesToPreload.forEach(index => {
    const item = carouselItems[index]
    const imageUrl = getOptimizedImageUrl(item.imageUrl)
    
    if (!loadedImages.value.has(imageUrl)) {
      const img = new Image()
      img.onload = () => {
        loadedImages.value.add(imageUrl)
      }
      img.src = imageUrl
    }
  })
}

// Lazy load images for visible slides
const lazyLoadImage = (imageUrls, index) => {
  const imageUrl = getOptimizedImageUrl(imageUrls)
  
  // Only load if not already loaded and if it's visible or adjacent
  const shouldLoad = index === currentSlide.value || 
                    index === (currentSlide.value + 1) % carouselItems.length ||
                    index === (currentSlide.value - 1 + carouselItems.length) % carouselItems.length
  
  if (shouldLoad && !loadedImages.value.has(imageUrl)) {
    const img = new Image()
    img.onload = () => {
      loadedImages.value.add(imageUrl)
    }
    img.onerror = () => {
      // Fallback to blur image if main image fails
      if (imageUrl !== imageUrls.blur) {
        const fallbackImg = new Image()
        fallbackImg.src = imageUrls.blur
        fallbackImg.onload = () => {
          loadedImages.value.add(imageUrls.blur)
        }
      }
    }
    img.src = imageUrl
  }
  
  return imageUrl
}

// Check if image is loaded
const isImageLoaded = (imageUrls) => {
  const imageUrl = getOptimizedImageUrl(imageUrls)
  return loadedImages.value.has(imageUrl)
}

// Fungsi untuk mengatur slide
const goToSlide = (index) => {
  if (isTransitioning.value) return
  currentSlide.value = index
  triggerContentAnimation()
  
  // Preload adjacent images when slide changes
  nextTick(() => {
    preloadCriticalImages()
  })
}

const nextSlide = () => {
  if (isTransitioning.value) return
  currentSlide.value = (currentSlide.value + 1) % carouselItems.length
  triggerContentAnimation()
  
  nextTick(() => {
    preloadCriticalImages()
  })
}

const prevSlide = () => {
  if (isTransitioning.value) return
  currentSlide.value = (currentSlide.value - 1 + carouselItems.length) % carouselItems.length
  triggerContentAnimation()
  
  nextTick(() => {
    preloadCriticalImages()
  })
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
  if (isTransitioning.value || isMobile.value) return
  
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

// Autoplay functions (slower for slow connections)
const getAutoplayInterval = () => {
  if (isSlowConnection.value) return 6000 // Slower for slow connections
  if (isMobile.value) return 5000 // Slightly slower on mobile
  return 4000 // Normal speed
}

const startAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
  autoplayInterval.value = setInterval(() => {
    if (!isSwiping.value && !isTransitioning.value) {
      nextSlide()
    }
  }, getAutoplayInterval())
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

// Mouse handlers for pausing autoplay on hover (desktop only)
const handleMouseEnter = () => {
  if (!isMobile.value) {
    stopAutoplay()
  }
}

const handleMouseLeave = () => {
  if (!isMobile.value) {
    setTimeout(() => startAutoplay(), 200)
  }
}

// Window resize handler
const handleResize = () => {
  detectDevice()
  // Refresh images if device type changed
  nextTick(() => {
    preloadCriticalImages()
  })
}

onMounted(() => {
  detectConnectionQuality()
  detectDevice()
  
  // Preload first image immediately
  const firstImageUrl = getOptimizedImageUrl(carouselItems[0].imageUrl)
  const img = new Image()
  img.onload = () => {
    loadedImages.value.add(firstImageUrl)
  }
  img.src = firstImageUrl
  
  // Start preloading critical images
  setTimeout(() => {
    preloadCriticalImages()
  }, 100)
  
  startAutoplay()
  triggerContentAnimation()
  
  // Add resize listener
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  stopAutoplay()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section class="relative overflow-hidden select-none">
    <!-- Carousel Container -->
    <div 
      class="relative w-full h-screen max-h-screen cursor-pointer select-none"
      :class="{ 'cursor-default': isMobile }"
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
        <!-- Background Image with Lazy Loading and Blur Placeholder -->
        <div 
          class="w-full h-full bg-cover bg-center transition-all duration-1000 relative"
          :class="[
            currentSlide === index ? 'scale-100' : 'scale-110'
          ]"
        >
          <!-- Blur placeholder (always visible until main image loads) -->
          <div 
            class="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 filter blur-sm scale-110"
            :style="{ backgroundImage: `url(${item.imageUrl.blur})` }"
            :class="[
              isImageLoaded(item.imageUrl) ? 'opacity-0' : 'opacity-100'
            ]"
          />
          
          <!-- Main optimized image -->
          <div 
            class="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500"
            :style="{ 
              backgroundImage: isImageLoaded(item.imageUrl) 
                ? `url(${lazyLoadImage(item.imageUrl, index)})` 
                : 'none'
            }"
            :class="[
              isImageLoaded(item.imageUrl) ? 'opacity-100' : 'opacity-0'
            ]"
          />
          
          <!-- Loading indicator for slow connections -->
          <div 
            v-if="!isImageLoaded(item.imageUrl) && currentSlide === index"
            class="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div class="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <svg class="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
          </div>
          
          <!-- Modern Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
        </div>

        <!-- Content Box with Enhanced Animations -->
        <div class="absolute inset-0 flex items-center justify-center px-4">
          <div 
            class="text-center px-4 sm:px-6 md:px-8 py-8 md:py-12 rounded-xl md:rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl max-w-xs sm:max-w-lg md:max-w-2xl w-full transform transition-all duration-1000"
            :class="[
              currentSlide === index && !isTransitioning 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-95'
            ]"
          >
            <!-- Caption with slide animation -->
            <p 
              class="text-green-400 font-semibold uppercase tracking-widest text-xs sm:text-sm mb-2 md:mb-3 transition-all duration-700 delay-200"
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
              class="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 leading-tight transition-all duration-700 delay-300"
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
              class="text-gray-200 text-sm sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed transition-all duration-700 delay-400"
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
                :size="isMobile ? 'lg' : 'xl'"
                class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg rounded-xl font-semibold"
                :class="[
                  isMobile 
                    ? 'px-6 py-3 text-base' 
                    : 'px-8 py-4 text-lg'
                ]"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Dots Indicators -->
      <div class="absolute bottom-6 md:bottom-8 inset-x-0 flex justify-center gap-2 md:gap-3 z-20">
        <button
          v-for="(_, index) in carouselItems"
          :key="index"
          class="relative overflow-hidden rounded-full transition-all duration-500 hover:scale-110 touch-target"
          :class="[
            currentSlide === index 
              ? 'w-8 md:w-12 h-2 md:h-3 bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
              : 'w-2 md:w-3 h-2 md:h-3 bg-white/40 hover:bg-white/60 backdrop-blur-sm'
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

      <!-- Connection Quality Indicator (for debugging) -->
      <div 
        v-if="isSlowConnection"
        class="absolute top-4 right-4 z-20 bg-orange-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium"
      >
        Mode Hemat Data
      </div>

      <!-- Swipe/Click Indicators -->
      <div class="absolute bottom-16 md:bottom-24 inset-x-0 flex justify-center z-20">
        <div class="text-white/60 text-xs md:text-sm font-medium flex items-center gap-2 md:gap-4 bg-black/20 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full">
          <!-- Mobile indicator -->
          <div class="flex items-center gap-1 md:gap-2 md:hidden">
            <svg class="w-3 h-3 md:w-4 md:h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3L8.59 4.41l5.17 5.17H2v2h11.76l-5.17 5.17L10 18l8-8-8-8z"/>
            </svg>
            Geser
            <svg class="w-3 h-3 md:w-4 md:h-4 animate-pulse rotate-180" fill="currentColor" viewBox="0 0 20 20">
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

/* Touch target for better mobile usability */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Button hover effects - disabled on mobile for better performance */
@media (hover: hover) {
  .UButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
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

/* Optimize for mobile performance */
@media (max-width: 768px) {
  /* Reduce backdrop blur on mobile for better performance */
  .backdrop-blur-xl {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  /* Disable complex animations on older mobile devices */
  @media (max-resolution: 150dpi) {
    .transition-all {
      transition: opacity 0.3s ease;
    }
  }
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>