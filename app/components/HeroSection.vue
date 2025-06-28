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
  image_name?: string
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
const getImageUrl = (heroId: string, imageName: string) => {
  if (!imageName) return null
  
  const { data } = supabase.storage
    .from('hero-image')
    .getPublicUrl(`${heroId}/${imageName}`)
  
  return data.publicUrl
}

// Computed untuk mendapatkan URL gambar slide saat ini
const currentSlideImageUrl = computed(() => {
  if (carouselItems.value.length === 0) return null
  const currentItem = carouselItems.value[currentSlide.value]
  if (!currentItem?.image_name) return null
  return getImageUrl(currentItem.id, currentItem.image_name)
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
      <!-- Background Image -->
      <div 
        v-if="currentSlideImageUrl"
        class="absolute inset-0 transition-all duration-1000 ease-out"
      >
        <img 
          :src="currentSlideImageUrl" 
          :alt="carouselItems[currentSlide]?.title || 'Hero Image'"
          class="w-full h-full object-cover"
          loading="lazy"
        >
        <!-- Overlay untuk readability -->
        <div class="absolute inset-0 bg-black/40"/>
      </div>

      <!-- Animated Background Decorations (ketika tidak ada gambar) -->
      <div v-else class="absolute inset-0 overflow-hidden">
        <!-- Primary Gradient Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 animate-gradient-slow"/>
        
        <!-- Floating Circles -->
        <div class="absolute top-10 left-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl animate-float-1"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-emerald-300/15 rounded-full blur-2xl animate-float-2"/>
        <div class="absolute bottom-32 left-32 w-40 h-40 bg-green-500/25 rounded-full blur-xl animate-float-3"/>
        <div class="absolute bottom-20 right-10 w-24 h-24 bg-lime-400/30 rounded-full blur-lg animate-float-4"/>
        
        <!-- Leaf Patterns -->
        <div class="absolute top-1/4 left-1/4 animate-rotate-slow">
          <svg class="w-20 h-20 text-green-400/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-8-5z"/>
          </svg>
        </div>
        <div class="absolute top-3/4 right-1/3 animate-rotate-reverse">
          <svg class="w-16 h-16 text-emerald-400/25" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-8-5z"/>
          </svg>
        </div>
        <div class="absolute bottom-1/3 left-1/2 animate-pulse-slow">
          <svg class="w-12 h-12 text-green-300/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-8-5z"/>
          </svg>
        </div>
        
        <!-- Geometric Shapes -->
        <div class="absolute top-1/3 right-1/4 w-3 h-3 bg-lime-400/40 rotate-45 animate-spin-slow"/>
        <div class="absolute bottom-1/2 left-1/3 w-2 h-2 bg-green-400/50 rounded-full animate-bounce-slow"/>
        <div class="absolute top-2/3 right-1/2 w-4 h-4 bg-emerald-400/30 rotate-45 animate-ping-slow"/>
        
        <!-- Wave Pattern -->
        <div class="absolute bottom-0 left-0 w-full h-24 opacity-20">
          <svg class="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              fill="currentColor" 
              class="text-green-600/30 animate-wave"/>
          </svg>
        </div>
        
        <!-- Particle Effects -->
        <div class="absolute inset-0">
          <div class="absolute top-16 left-16 w-1 h-1 bg-green-300/60 rounded-full animate-twinkle-1"/>
          <div class="absolute top-32 right-24 w-1 h-1 bg-emerald-300/60 rounded-full animate-twinkle-2"/>
          <div class="absolute bottom-24 left-20 w-1 h-1 bg-lime-300/60 rounded-full animate-twinkle-3"/>
          <div class="absolute bottom-40 right-32 w-1 h-1 bg-green-400/60 rounded-full animate-twinkle-4"/>
          <div class="absolute top-48 left-3/4 w-1 h-1 bg-emerald-400/60 rounded-full animate-twinkle-5"/>
        </div>
        
        <!-- Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"/>
      </div>

      <!-- Carousel Items -->
      <div 
        v-for="(item, index) in carouselItems" 
        :key="item.id"
        class="absolute inset-0 transition-all duration-1000 ease-out"
        :class="[
          currentSlide === index ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
        ]"
      >
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
              <button
                v-if="item.button_text"
                class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg border-none"
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

/* Custom Animations */
@keyframes gradient-slow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float-1 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-20px) translateX(10px); }
  66% { transform: translateY(10px) translateX(-15px); }
}

@keyframes float-2 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(15px) translateX(-10px); }
  50% { transform: translateY(-10px) translateX(20px); }
  75% { transform: translateY(20px) translateX(-5px); }
}

@keyframes float-3 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-25px) translateX(15px); }
}

@keyframes float-4 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(12px) translateX(-8px); }
  66% { transform: translateY(-18px) translateX(12px); }
}

@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes ping-slow {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2); opacity: 0; }
}

@keyframes wave {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100px); }
}

@keyframes twinkle-1 {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

@keyframes twinkle-2 {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  25% { opacity: 1; transform: scale(1.2); }
  75% { opacity: 0.6; transform: scale(1.3); }
}

@keyframes twinkle-3 {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  33% { opacity: 0.8; transform: scale(1.4); }
  66% { opacity: 1; transform: scale(1.1); }
}

@keyframes twinkle-4 {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  40% { opacity: 1; transform: scale(1.6); }
  80% { opacity: 0.3; transform: scale(1.2); }
}

@keyframes twinkle-5 {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  20% { opacity: 0.9; transform: scale(1.3); }
  60% { opacity: 1; transform: scale(1.5); }
}

/* Apply animations */
.animate-gradient-slow {
  background-size: 400% 400%;
  animation: gradient-slow 8s ease infinite;
}

.animate-float-1 { animation: float-1 6s ease-in-out infinite; }
.animate-float-2 { animation: float-2 8s ease-in-out infinite; }
.animate-float-3 { animation: float-3 7s ease-in-out infinite; }
.animate-float-4 { animation: float-4 5s ease-in-out infinite; }

.animate-rotate-slow {
  animation: rotate-slow 12s linear infinite;
}
</style>