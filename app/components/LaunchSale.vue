<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase()
// const emit = defineEmits(['exploreProducts'])

const currentSlide = ref(0)
const banners = ref([])
const loading = ref(true)
const error = ref(null)
let slideInterval: NodeJS.Timeout | null = null

// Fetch banners from Supabase
const fetchBanners = async () => {
  try {
    loading.value = true
    const { data, error: fetchError } = await supabase
      .from('banner')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw fetchError
    }

    banners.value = data || []
  } catch (err) {
    console.error('Error fetching banners:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Auto slide functionality
const startAutoSlide = () => {
  if (banners.value.length > 1) {
    slideInterval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % banners.value.length
    }, 5000) // Ganti slide setiap 5 detik
  }
}

const stopAutoSlide = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  stopAutoSlide()
  startAutoSlide() // Restart auto slide
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % banners.value.length
  stopAutoSlide()
  startAutoSlide()
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? banners.value.length - 1 : currentSlide.value - 1
  stopAutoSlide()
  startAutoSlide()
}

// Handle image load error
const handleImageError = (event) => {
  console.error('Failed to load banner image:', event.target.src)
  // Anda bisa set placeholder image di sini
  event.target.src = '/placeholder-banner.jpg' // Sesuaikan dengan path placeholder Anda
}

// const exploreProducts = () => {
//   emit('exploreProducts')
// }

onMounted(async () => {
  await fetchBanners()
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<template>
  <section class="relative">
    <UCard class="overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="h-80 lg:h-96 flex items-center justify-center bg-gray-100">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"/>
          <p class="text-gray-600">Memuat banner...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="h-80 lg:h-96 flex items-center justify-center bg-red-50">
        <div class="text-center">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-600 font-medium">Gagal memuat banner</p>
          <p class="text-red-500 text-sm mt-1">{{ error }}</p>
          <button 
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" 
            @click="fetchBanners"
          >
            Coba Lagi
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="banners.length === 0" class="h-80 lg:h-96 flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p class="text-gray-600 font-medium">Belum ada banner</p>
          <p class="text-gray-500 text-sm mt-1">Banner akan ditampilkan di sini</p>
        </div>
      </div>

      <!-- Banner Slider -->
      <div v-else class="relative h-80 lg:h-96">
        <!-- Slides -->
        <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          :class="[
            'absolute inset-0 transition-all duration-500 ease-in-out',
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          ]"
        >
          <div class="relative h-full w-full">
            <!-- Banner Image -->
            <img
              :src="banner.image_url"
              :alt="`Banner ${index + 1}`"
              class="w-full h-full object-cover"
              @error="handleImageError"
            >
            
            <!-- Overlay untuk readability (opsional) -->
            <div class="absolute inset-0 bg-black/20"/>
          </div>
        </div>

        <!-- Navigation Arrows (hanya tampil jika ada lebih dari 1 banner) -->
        <template v-if="banners.length > 1">
          <button
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 z-10"
            @click="prevSlide"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <button
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 z-10"
            @click="nextSlide"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Slide Indicators -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            <button
              v-for="(banner, index) in banners"
              :key="banner.id"
              :class="[
                'w-3 h-3 rounded-full transition-all duration-200',
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              ]"
              @click="goToSlide(index)"
            />
          </div>
        </template>
      </div>
    </UCard>
  </section>
</template>

<style scoped>
/* Responsive image container */
.banner-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Ensure images maintain aspect ratio */
img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.02);
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>