<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAsyncData } from '#app'

// Types
interface HeroData {
  id: string
  caption: string
  title: string
  description: string
  button_text: string
  button_link: string
  image_url?: string  // Changed from image_name to image_url
  status: string
  created_at: string
  deleted_at?: string
}

// Supabase client
const { supabase } = useSupabase()

// Data untuk carousel
const carouselItems = ref<HeroData[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

// State untuk carousel
const currentSlide = ref(0)
const autoplayInterval = ref(null)
const isTransitioning = ref(false)

// Touch/Swipe states
const isSwiping = ref(false)
const startX = ref(0)
const startY = ref(0)
const swipeThreshold = 50

// Device detection
const isMobile = ref(false)

// Fungsi untuk mendapatkan URL gambar dari bucket
const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return null
  
  // Jika sudah berupa URL lengkap, return langsung
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  
  // Jika hanya nama file, ambil dari bucket hero-image
  const { data } = supabase.storage
    .from('hero-image')
    .getPublicUrl(imageUrl)
  
  return data.publicUrl
}

// Computed untuk mendapatkan URL gambar slide saat ini
const currentSlideImageUrl = computed(() => {
  if (carouselItems.value.length === 0) return null
  const currentItem = carouselItems.value[currentSlide.value]
  if (!currentItem?.image_url) return null
  return getImageUrl(currentItem.image_url)
})

// Fetch data hero dari Supabase
const fetchHeroData = async () => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('hero_data')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: true })

    if (fetchError) throw fetchError

    carouselItems.value = data as HeroData[] || []
    
    // Reset current slide jika data berubah
    if (carouselItems.value.length > 0 && currentSlide.value >= carouselItems.value.length) {
      currentSlide.value = 0
    }
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat memuat data hero'
    console.error('Error fetching hero data:', err)
  } finally {
    loading.value = false
  }
}

// SSR-friendly data fetch
await useAsyncData('hero-data', fetchHeroData)

// Detect device type
const detectDevice = () => {
  isMobile.value = window.innerWidth < 768
}

// Fungsi untuk mengatur slide
const goToSlide = (index) => {
  if (isTransitioning.value || carouselItems.value.length === 0) return
  currentSlide.value = index
  triggerContentAnimation()
}

const nextSlide = () => {
  if (isTransitioning.value || carouselItems.value.length === 0) return
  const nextIndex = (currentSlide.value + 1) % carouselItems.value.length
  currentSlide.value = nextIndex
  triggerContentAnimation()
}

const prevSlide = () => {
  if (isTransitioning.value || carouselItems.value.length === 0) return
  const prevIndex = (currentSlide.value - 1 + carouselItems.value.length) % carouselItems.value.length
  currentSlide.value = prevIndex
  triggerContentAnimation()
}

// Animation trigger
const triggerContentAnimation = () => {
  isTransitioning.value = true
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

// Touch/Swipe events
const handleTouchStart = (e) => {
  if (isTransitioning.value || carouselItems.value.length === 0) return
  
  isSwiping.value = true
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  stopAutoplay()
}

const handleTouchEnd = (e) => {
  if (!isSwiping.value || carouselItems.value.length === 0) return
  
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
  if (isTransitioning.value || isMobile.value || carouselItems.value.length === 0) return
  
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
  if (autoplayInterval.value || carouselItems.value.length <= 1) {
    clearInterval(autoplayInterval.value)
  }
  
  if (carouselItems.value.length > 1) {
    autoplayInterval.value = setInterval(() => {
      if (!isSwiping.value && !isTransitioning.value) {
        nextSlide()
      }
    }, 4000)
  }
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
}

// Handle button click
const handleButtonClick = (buttonLink: string) => {
  if (buttonLink) {
    // Navigate to the link
    navigateTo(buttonLink)
  }
}

onMounted(() => {
  detectDevice()
  if (carouselItems.value.length > 0) {
    startAutoplay()
    triggerContentAnimation()
  }
  
  // Add event listeners
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  stopAutoplay()
  window.removeEventListener('resize', handleResize)
})

// Watch for data changes to restart autoplay
watch(() => carouselItems.value.length, (newLength) => {
  if (newLength > 0) {
    startAutoplay()
    if (currentSlide.value >= newLength) {
      currentSlide.value = 0
    }
  } else {
    stopAutoplay()
  }
})
</script>

<template>
  <section class="relative overflow-hidden select-none">
    <!-- Loading State -->
    <div 
      v-if="loading" 
      class="relative w-full h-screen max-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"/>
        <p class="text-white text-lg">Memuat konten...</p>
      </div>
    </div>

    <!-- Error State -->
    <div 
      v-else-if="error" 
      class="relative w-full h-screen max-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-orange-900"
    >
      <div class="text-center max-w-md mx-auto px-4">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">Terjadi Kesalahan</h3>
        <p class="text-red-200">{{ error }}</p>
        <button 
          class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          @click="fetchHeroData"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="carouselItems.length === 0" 
      class="relative w-full h-screen max-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900"
    >
      <div class="text-center max-w-md mx-auto px-4">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">Belum Ada Konten</h3>
        <p class="text-gray-300">Konten hero sedang tidak tersedia.</p>
      </div>
    </div>

    <!-- Carousel Container -->
    <div 
      v-else
      class="relative w-full h-screen max-h-screen cursor-pointer select-none"
      :class="{ 'cursor-default': isMobile }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <!-- Background Container -->
      <div class="absolute inset-0">
        <!-- Background Images dengan animasi transisi -->
        <div 
          v-for="(item, index) in carouselItems" 
          :key="`bg-${item.id}`"
          class="absolute inset-0 transition-all duration-1000 ease-out"
          :class="[
            currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          ]"
        >
          <!-- Gambar Background jika ada -->
          <div v-if="getImageUrl(item.image_url)" class="absolute inset-0">
            <img 
              :src="getImageUrl(item.image_url)" 
              :alt="item.title || 'Hero Image'"
              class="w-full h-full object-cover transition-transform duration-1000 ease-out"
              :class="[
                currentSlide === index ? 'scale-100' : 'scale-110'
              ]"
              loading="lazy"
              @error="(e) => { console.error('Image load error:', e); e.target.style.display = 'none'; }"
            >
          </div>
          
          <!-- Background Hijau jika tidak ada gambar -->
          <div 
            v-else 
            class="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 transition-all duration-1000 ease-out"
            :class="[
              currentSlide === index ? 'scale-100' : 'scale-105'
            ]"
          />
        </div>
        
        <!-- Overlay untuk readability dan efek shadow dari bawah -->
        <div class="absolute inset-0 bg-black/30"/>
        
        <!-- Shadow dari bawah untuk efek menyatu -->
        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent"/>
        
        <!-- Side shadows untuk depth -->
        <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/30 to-transparent"/>
        <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/30 to-transparent"/>
      </div>

      <!-- Carousel Items -->
      <div 
        v-for="(item, index) in carouselItems" 
        :key="item.id"
        class="absolute inset-0 transition-all duration-1000 ease-out"
        :class="[
          currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
        ]"
      >
        <!-- Content Box dengan Enhanced Animations -->
        <div class="absolute inset-0 flex items-center justify-center px-4">
          <div 
            class="text-center px-4 sm:px-6 md:px-8 py-8 md:py-12 rounded-xl md:rounded-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl max-w-xs sm:max-w-lg md:max-w-2xl w-full transform transition-all duration-1000"
            :class="[
              currentSlide === index && !isTransitioning 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-95'
            ]"
          >
            <!-- Caption dengan slide animation -->
            <p 
              class="text-green-300 font-semibold uppercase tracking-widest text-xs sm:text-sm mb-2 md:mb-3 transition-all duration-700 delay-200"
              :class="[
                currentSlide === index && !isTransitioning 
                  ? 'translate-x-0 opacity-100' 
                  : index % 2 === 0 ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'
              ]"
            >
              {{ item.caption }}
            </p>
            
            <!-- Title dengan opposite slide animation -->
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
            
            <!-- Description dengan slide animation -->
            <p 
              class="text-gray-100 text-sm sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed transition-all duration-700 delay-400"
              :class="[
                currentSlide === index && !isTransitioning 
                  ? 'translate-x-0 opacity-100' 
                  : index % 2 === 0 ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'
              ]"
            >
              {{ item.description }}
            </p>
            
            <!-- Button dengan scale animation -->
            <div 
              class="transition-all duration-700 delay-500"
              :class="[
                currentSlide === index && !isTransitioning 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-4 opacity-0 scale-95'
              ]"
            >
              <button
                v-if="item.button_text"
                class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border-none"
                :class="[
                  isMobile 
                    ? 'px-6 py-3 text-base' 
                    : 'px-8 py-4 text-lg'
                ]"
                @click.stop="handleButtonClick(item.button_link)"
              >
                {{ item.button_text }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Dots Indicators -->
      <div 
        v-if="carouselItems.length > 1"
        class="absolute bottom-6 md:bottom-8 inset-x-0 flex justify-center gap-2 md:gap-3 z-20"
      >
        <button
          v-for="(item, index) in carouselItems"
          :key="index"
          class="relative overflow-hidden rounded-full transition-all duration-500 hover:scale-110 touch-target"
          :class="[
            currentSlide === index 
              ? 'w-8 md:w-12 h-2 md:h-3 bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
              : 'w-2 md:w-3 h-2 md:h-3 bg-white/40 hover:bg-white/60 backdrop-blur-sm'
          ]"
          @click.stop="goToSlide(index)"
        >
          <!-- Active indicator glow effect -->
          <div 
            v-if="currentSlide === index"
            class="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"
          />
        </button>
      </div>

      <!-- Swipe/Click Indicators -->
      <div 
        v-if="carouselItems.length > 1"
        class="absolute bottom-16 md:bottom-24 inset-x-0 flex justify-center z-20"
      >
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

/* Smooth transitions for better performance */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced shadow effects */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Improved hover effects */
.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

/* Optimized animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hardware acceleration for smoother animations */
.transition-all,
.transition-transform,
.transition-opacity {
  will-change: transform, opacity;
  transform: translateZ(0);
}
</style>