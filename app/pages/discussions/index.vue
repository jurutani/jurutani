<script lang="ts">
interface DiscussionService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
  route: string;
  color: string;
  gradient: string;
  bgColor: string;
  features: string[];
}

export default {
  data() {
    return {
      services: [
        {
          id: 'instructor',
          title: 'Bicara dengan Penyuluh',
          subtitle: 'Konsultasi Langsung',
          description: 'Dapatkan panduan praktis dari penyuluh pertanian berpengalaman untuk mengatasi masalah budidaya, hama penyakit, dan teknik bertani modern.',
          icon: 'i-heroicons-chat-bubble-left-ellipsis',
          image: '/services/penyuluh.jpg',
          route: '/discussions/instructor',
          color: 'emerald',
          gradient: 'from-emerald-400 to-green-600',
          bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
          features: ['Konsultasi 1-on-1', 'Panduan Praktis', 'Solusi Lapangan']
        },
        {
          id: 'expert',
          title: 'Tanya ke Pakar',
          subtitle: 'Konsultasi Ahli',
          description: 'Konsultasi mendalam dengan ahli pertanian bersertifikat untuk analisis ilmiah, diagnosa penyakit tanaman, dan rekomendasi teknologi terbaru.',
          icon: 'i-heroicons-shield-check',
          image: '/services/pakar.jpg',
          route: '/discussions/expert',
          color: 'blue',
          gradient: 'from-blue-400 to-indigo-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          features: ['Analisis Ilmiah', 'Diagnosa Akurat', 'Teknologi Terbaru']
        },
        {
          id: 'community',
          title: 'Forum Komunitas',
          subtitle: 'Berbagi Pengalaman',
          description: 'Bergabung dengan komunitas petani dari seluruh Indonesia untuk berbagi tips sukses, pengalaman lapangan, dan inovasi pertanian.',
          icon: 'i-heroicons-users',
          image: '/services/komunitas.jpg',
          route: '/discussions/group',
          color: 'amber',
          gradient: 'from-amber-400 to-yellow-600',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          features: ['Komunitas Aktif', 'Tips Sukses', 'Sharing Pengalaman']
        },
        {
          id: 'chat',
          title: 'Room Chat Tematik',
          subtitle: 'Diskusi Real-time',
          description: 'Diskusi langsung dalam room chat khusus berdasarkan komoditas seperti padi, sayuran, buah-buahan, dan peternakan untuk solusi cepat.',
          icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
          image: '/services/chat.jpg',
          route: '/room-chat',
          color: 'purple',
          gradient: 'from-purple-400 to-violet-600',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          features: ['Chat Real-time', 'Room Tematik', 'Diskusi Grup']
        },
        {
          id: 'chat-admin',
          title: 'Support Center',
          subtitle: 'Bantuan Langsung',
          description: 'Hubungi tim support JuruTani untuk bantuan teknis aplikasi, keluhan layanan, atau pertanyaan umum dengan respon prioritas.',
          icon: 'i-heroicons-headphones',
          image: '/services/support.jpg',
          route: '/room-chat/admin',
          color: 'rose',
          gradient: 'from-rose-400 to-pink-600',
          bgColor: 'bg-rose-50 dark:bg-rose-900/20',
          features: ['Support 24/7', 'Respon Cepat', 'Bantuan Teknis']
        }
      ] as DiscussionService[]
    }
  }
}
</script>

<template>
  <UContainer class="py-12">
    <!-- Header Section -->
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

    <!-- Service Cards - Enhanced Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
      <div 
        v-for="service in services" 
        :key="service.id" 
        class="group relative"
        :class="service.id === 'chat-admin' ? 'md:col-span-2 lg:col-span-1' : ''"
      >
        <!-- Background Gradient -->
        <div
          class="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          :class="service.gradient"
        />
        
        <!-- Main Card -->
        <div class="relative h-full rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          
          <!-- Header with Icon and Image -->
          <div class="p-6 pb-4">
            <div class="flex items-center justify-between mb-4">
              <div :class="service.bgColor" class="p-3 rounded-xl">
                <UIcon :name="service.icon" class="w-6 h-6" :class="`text-${service.color}-600 dark:text-${service.color}-400`" />
              </div>
              <div class="flex-shrink-0">
                <img :src="service.image" :alt="service.title" class="w-20 h-20 rounded-full object-cover border-3 border-white dark:border-gray-700 shadow-xl">
              </div>
            </div>
            
            <div class="mb-3">
              <div :class="`text-xs font-medium text-${service.color}-600 dark:text-${service.color}-400 uppercase tracking-wide mb-1`">
                {{ service.subtitle }}
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ service.title }}
              </h3>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 pb-6 text-center">
            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {{ service.description }}
            </p>
            
            <!-- Features List -->
            <div class="mb-6">
              <div class="flex flex-wrap gap-2 justify-center">
                <span 
                  v-for="feature in service.features" 
                  :key="feature"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                  :class="service.bgColor"
                >
                  <UIcon name="i-heroicons-check" class="w-3 h-3" :class="`text-${service.color}-600 dark:text-${service.color}-400`" />
                  <span :class="`text-${service.color}-700 dark:text-${service.color}-300`">{{ feature }}</span>
                </span>
              </div>
            </div>
            
            <!-- Action Button -->
            <UButton 
              :to="service.route" 
              :color="service.color" 
              size="sm"
              class="w-full max-w-[200px] mx-auto font-medium group-hover:scale-105 transition-transform duration-200"
              variant="solid"
            >
              <template #leading>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
              </template>
              Mulai Diskusi
            </UButton>
          </div>

          <!-- Decorative Bottom Border -->
          <div
            class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :class="service.gradient"
          />
        </div>
      </div>
    </div>

    <!-- Enhanced Info Section -->
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
        
        <!-- Stats Section -->
        <div class="mt-8 pt-8 border-t border-green-200 dark:border-green-700">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">50K+</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Petani Bergabung</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">500+</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Penyuluh Aktif</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">100K+</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Diskusi Terjawab</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Tingkat Kepuasan</div>
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

/* Enhanced hover animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
  }
}

.group:hover .group-hover\:scale-110 {
  animation: float 2s ease-in-out infinite;
}

/* Image styling */
.w-20 {
  width: 5rem;
}

.h-20 {
  height: 5rem;
}

.border-3 {
  border-width: 3px;
}

.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

/* Button max-width */
.max-w-[200px] {
  max-width: 200px;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .md\:col-span-2 {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .p-6 {
    padding: 1.25rem;
  }
  
  .gap-8 {
    gap: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
}

/* Loading states */
.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Focus states for accessibility */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
</style>