<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Kalau mau aktifin emit, tinggal uncomment
// const emit = defineEmits(['exploreProducts'])

const currentSlide = ref(0)
let slideInterval: NodeJS.Timeout | null = null

// Data slides banner
const slides = [
  {
    title: "Selamat Datang di Juru Tani!",
    subtitle: "Panen Promo",
    description: "Platform terlengkap untuk kebutuhan pertanian Anda",
    categories: ["Pertanian", "Perkebunan", "Peternakan", "Alat Tani", "Pupuk", "Dan Lainnya"],
    gradient: "from-green-500 to-emerald-700"
  },
  {
    title: "Solusi Pertanian Modern",
    subtitle: "Teknologi Terdepan",
    description: "Aplikasi dan tools untuk meningkatkan produktivitas pertanian",
    categories: [ "Monitoring Tanaman", "Analisis Cuaca", "Prediksi Panen"],
    gradient: "from-blue-500 to-cyan-700"
  },
  {
    title: "Komunitas Petani Indonesia",
    subtitle: "Berkembang Bersama",
    description: "Bergabung dengan ribuan petani sukses di seluruh Indonesia",
    categories: ["Forum Diskusi", "Konsultasi Ahli", "Sharing Pengalaman", "Edukasi Pertanian"],
    gradient: "from-orange-500 to-red-700"
  },
  {
    title: "Marketplace Pertanian",
    subtitle: "Jual Beli Mudah",
    description: "Platform jual beli produk pertanian terpercaya",
    categories: ["Benih Unggul", "Alat Pertanian", "Hasil Panen", "Layanan Logistik"],
    gradient: "from-purple-500 to-pink-700"
  }
]

// Auto slide functionality
const startAutoSlide = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 5000) // Ganti slide setiap 5 detik
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
  currentSlide.value = (currentSlide.value + 1) % slides.length
  stopAutoSlide()
  startAutoSlide()
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.length - 1 : currentSlide.value - 1
  stopAutoSlide()
  startAutoSlide()
}

// const exploreProducts = () => {
//   emit('exploreProducts')
// }

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<template>
  <section class="relative">
    <UCard class="overflow-hidden">
      <!-- Slider Container -->
      <div class="relative h-80 lg:h-60">
        <!-- Slides -->
        <div
          v-for="(slide, index) in slides"
          :key="index"
          :class="[
            'absolute inset-0 transition-all duration-500 ease-in-out',
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          ]"
        >
          <div
            :class="[
              'bg-clip-text bg-gradient-to-r font-extrabold text-transparent h-full',
              slide.gradient
            ]"
          >
            <div class="launch-sale-grid h-full p-6">
              <!-- Welcome Text -->
              <div class="flex lg:flex lg:items-center" style="grid-area: sale">
                <span class="-tracking-wide font-semibold text-2xl uppercase lg:text-center lg:text-3xl">
                  {{ slide.title }}
                </span>
              </div>
              
              <!-- Main Promo Text -->
              <div class="justify-center lg:flex lg:items-center" style="grid-area: discount">
                <div class="text-center">
                  <span class="-tracking-wide font-bold text-4xl uppercase whitespace-nowrap lg:text-6xl block">
                    {{ slide.subtitle }}
                  </span>
                  <p class="text-gray-600 text-sm mt-2 font-normal">
                    {{ slide.description }}
                  </p>
                </div>
              </div>
              
              <!-- Categories -->
              <div style="grid-area: categories" class="flex items-center">
                <ul class="-tracking-wide font-extrabold space-y-2 text-right uppercase w-full whitespace-nowrap sm:space-y-0 lg:flex lg:flex-wrap lg:justify-center lg:space-x-2">
                  <li v-for="category in slide.categories" :key="category" class="lg:mb-2">
                    {{ category }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
          @click="prevSlide"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
          @click="nextSlide"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Slide Indicators -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          :class="[
            'w-3 h-3 rounded-full transition-all duration-200',
            index === currentSlide ? 'bg-white' : 'bg-white/50'
          ]"
          @click="goToSlide(index)"
        />
      </div>
    </UCard>
  </section>
</template>

<style scoped>
.launch-sale-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'discount categories'
    'sale categories';
  gap: 20px;
}

@media (min-width: 1024px) {
  .launch-sale-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'sale discount categories';
    gap: 20px;
  }
}
</style>