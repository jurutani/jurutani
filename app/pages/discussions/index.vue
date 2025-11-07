<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

interface DiscussionService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
  route: string;
}

const profilesCount = ref(0)
const instructorsCount = ref(0)
const expertsCount = ref(0)
const loading = ref(false)
const error = ref<any>(null)

const profilesDisplayCount = ref(0)
const instructorsDisplayCount = ref(0)
const expertsDisplayCount = ref(0)
const statsVisible = ref(false)

const services = ref<DiscussionService[]>([
  {
    id: 'instructor',
    title: 'Bicara dengan Penyuluh',
    subtitle: 'Konsultasi Langsung',
    description: 'Dapatkan panduan praktis dari penyuluh pertanian berpengalaman untuk mengatasi masalah budidaya, hama penyakit, dan teknik bertani modern.',
    icon: 'i-heroicons-chat-bubble-left-ellipsis',
    image: '/services/penyuluhjurutani.JPG',
    route: '/discussions/instructor'
  },
  {
    id: 'expert',
    title: 'Tanya ke Pakar',
    subtitle: 'Konsultasi Ahli',
    description: 'Konsultasi mendalam dengan ahli pertanian bersertifikat untuk analisis ilmiah, diagnosa penyakit tanaman, dan rekomendasi teknologi terbaru.',
    icon: 'i-heroicons-shield-check',
    image: '/services/pakarjurutani.JPG',
    route: '/discussions/expert'
  },
  {
    id: 'community',
    title: 'Forum Komunitas',
    subtitle: 'Berbagi Pengalaman',
    description: 'Bergabung dengan komunitas petani dari seluruh Indonesia untuk berbagi tips sukses, pengalaman lapangan, dan inovasi pertanian.',
    icon: 'i-heroicons-users',
    image: '/services/komunitasjurutani.JPG',
    route: '/discussions/group'
  },
  {
    id: 'chat',
    title: 'Room Chat Tematik',
    subtitle: 'Diskusi Real-time',
    description: 'Diskusi langsung dalam room chat khusus berdasarkan komoditas seperti padi, sayuran, buah-buahan, dan peternakan untuk solusi cepat.',
    icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
    image: '/services/chatjurutani.JPG',
    route: '/room-chat'
  },
  {
    id: 'chat-admin',
    title: 'Support Center',
    subtitle: 'Bantuan Langsung',
    description: 'Hubungi tim support Juru Tani untuk bantuan teknis aplikasi, keluhan layanan, atau pertanyaan umum dengan respon prioritas.',
    icon: 'i-heroicons-user-circle',
    image: '/services/admin.JPG',
    route: '/room-chat/admin'
  }
])

const fallbackData = {
  profiles: 500,
  instructors: 400,
  experts: 200
}

let observer: IntersectionObserver | null = null
const statsRef = ref<HTMLElement>()

const animateCounter = (
  from: number,
  to: number,
  displayRef: any,
  duration: number = 2000
) => {
  const increment = (to - from) / (duration / 16)
  let current = from
  
  const updateCounter = () => {
    current += increment
    if (current < to) {
      displayRef.value = Math.floor(current)
      requestAnimationFrame(updateCounter)
    } else {
      displayRef.value = to
    }
  }
  
  updateCounter()
}

const startAnimations = () => {
  if (statsVisible.value) return
  
  statsVisible.value = true
  
  const profilesTarget = profilesCount.value > 0 ? profilesCount.value : fallbackData.profiles
  const instructorsTarget = instructorsCount.value > 0 ? instructorsCount.value : fallbackData.instructors
  const expertsTarget = expertsCount.value > 0 ? expertsCount.value : fallbackData.experts
  
  setTimeout(() => animateCounter(0, profilesTarget, profilesDisplayCount), 100)
  setTimeout(() => animateCounter(0, instructorsTarget, instructorsDisplayCount), 200)
  setTimeout(() => animateCounter(0, expertsTarget, expertsDisplayCount), 300)
}

const fetchCounts = async () => {
  loading.value = true
  error.value = null

  try {
    const [profiles, instructors, experts] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('instructors').select('*', { count: 'exact', head: true }),
      supabase.from('experts').select('*', { count: 'exact', head: true })
    ])

    if (profiles.error || instructors.error || experts.error) {
      throw profiles.error || instructors.error || experts.error
    }

    profilesCount.value = profiles.count || 0
    instructorsCount.value = instructors.count || 0
    expertsCount.value = experts.count || 0
    
    if (statsVisible.value) {
      statsVisible.value = false
      startAnimations()
    }
  } catch (err) {
    console.error('Error fetching counts:', err)
    error.value = err
    
    profilesCount.value = 0
    instructorsCount.value = 0
    expertsCount.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCounts()
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsVisible.value) {
          startAnimations()
        }
      })
    },
    {
      threshold: 0.5
    }
  )
  
  if (statsRef.value) {
    observer.observe(statsRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto mb-16 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Platform Diskusi Pertanian #1 Indonesia</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Forum Diskusi JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Temukan solusi pertanian terbaik melalui diskusi interaktif dengan 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">penyuluh berpengalaman</span>, 
        <span class="font-semibold text-teal-600 dark:text-teal-400">pakar pertanian</span>, dan 
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">komunitas petani</span> seluruh Indonesia.
      </p> 
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
      <div 
        v-for="service in services" 
        :key="service.id" 
        class="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
      >
        <div class="absolute inset-0">
          <img 
            :src="service.image" 
            :alt="service.title" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          >
          <div class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"/>
        </div>
        
        <div class="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div class="flex items-start justify-between">
            <div class="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
              <UIcon :name="service.icon" class="w-6 h-6 text-white" />
            </div>
            <div class="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span class="text-xs font-medium">{{ service.subtitle }}</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-bold mb-2">{{ service.title }}</h3>
              <p class="text-sm text-gray-100 opacity-90 leading-relaxed">
                {{ service.description }}
              </p>
            </div>
            
            <div class="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <NuxtLink
                :to="service.route"
                class="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
              >
                <span>Mulai Diskusi</span>
                <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl">
      <div class="rounded-3xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-700 p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-green-100 dark:bg-green-800 rounded-full">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-green-600 dark:text-green-400" />
            <span class="text-sm font-medium text-green-700 dark:text-green-300">Keunggulan Platform JuruTani</span>
          </div>
          
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Mengapa Memilih JuruTani?
          </h3>
          
          <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Platform terdepan untuk konsultasi pertanian yang menghubungkan petani dengan para ahli dan komunitas
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-check-badge" class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Terverifikasi & Terpercaya</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Semua penyuluh dan pakar telah melalui proses verifikasi ketat dan memiliki sertifikasi resmi</p>
          </div>
          
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-clock" class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Respon Super Cepat</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Dapatkan jawaban dalam hitungan menit dari komunitas aktif dan tim support 24/7</p>
          </div>
          
          <div class="text-center group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UIcon name="i-heroicons-heart" class="w-8 h-8 text-white" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">100% Gratis</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">Seluruh layanan konsultasi dan diskusi tersedia gratis untuk mendukung kemajuan pertanian Indonesia</p>
          </div>
        </div>
        
        <div ref="statsRef" class="mt-8 pt-8 border-t border-green-200 dark:border-green-700">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="stats-item">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-300">
                {{ profilesDisplayCount > 0 ? `${profilesDisplayCount}+` : '500+' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Petani Bergabung</div>
            </div>
            <div class="stats-item">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-300">
                {{ instructorsDisplayCount > 0 ? `${instructorsDisplayCount}+` : '400+' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Penyuluh Aktif</div>
            </div>
            <div class="stats-item">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400 transition-all duration-300">
                {{ expertsDisplayCount > 0 ? `${expertsDisplayCount}+` : '200+' }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Pakar Ahli</div>
            </div>
            <div class="stats-item">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Tingkat Kepuasan</div>
            </div>
          </div>
          
          <div v-if="loading" class="text-center mt-4">
            <div class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"/>
              Memuat data terbaru...
            </div>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.aspect-\[4\/5\] {
  aspect-ratio: 4/5;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-item {
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s ease-out forwards;
}

.stats-item:nth-child(1) { animation-delay: 0.1s; }
.stats-item:nth-child(2) { animation-delay: 0.2s; }
.stats-item:nth-child(3) { animation-delay: 0.3s; }
.stats-item:nth-child(4) { animation-delay: 0.4s; }

.stats-item .text-2xl {
  font-variant-numeric: tabular-nums;
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

@media (max-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .aspect-\[4\/5\] {
    aspect-ratio: 3/4;
  }
}

@media (max-width: 640px) {
  .p-6 {
    padding: 1.25rem;
  }
  
  .gap-6 {
    gap: 1rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .aspect-\[4\/5\] {
    aspect-ratio: 1/1;
  }
}
</style>