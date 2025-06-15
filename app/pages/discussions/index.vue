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
}

export default {
  data() {
    return {
      services: [
        {
          id: 'instructor',
          title: 'Bicara dengan Penyuluh',
          subtitle: 'Konsultasi Langsung',
          description: 'Tanyakan langsung kepada penyuluh pertanian berpengalaman seputar permasalahan di lapangan, teknik budidaya, dan solusi praktis.',
          icon: 'i-heroicons-chat-bubble-left-ellipsis',
          image: '/services/penyuluh.jpg',
          route: '/discussions/instructor',
          color: 'emerald',
          gradient: 'from-emerald-400 to-green-600',
          bgColor: 'bg-emerald-50 dark:bg-emerald-900/10'
        },
        {
          id: 'expert',
          title: 'Tanya ke Pakar',
          subtitle: 'Konsultasi Ahli',
          description: 'Diskusi mendalam untuk masalah teknis, penyakit tanaman, dan analisis tanah bersama ahli pertanian bersertifikat dari tim JuruTani.',
          icon: 'i-heroicons-shield-check',
          image: '/services/pakar.jpg',
          route: '/discussions/expert',
          color: 'blue',
          gradient: 'from-blue-400 to-indigo-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/10'
        },
        {
          id: 'community',
          title: 'Forum Komunitas',
          subtitle: 'Berbagi Pengalaman',
          description: 'Temui sesama petani dari seluruh Indonesia, berbagi tips sukses, pengalaman lapangan, dan solusi kreatif dalam bertani.',
          icon: 'i-heroicons-users',
          image: '/services/komunitas.jpg',
          route: '/discussions/group',
          color: 'amber',
          gradient: 'from-amber-400 to-yellow-600',
          bgColor: 'bg-amber-50 dark:bg-amber-900/10'
        },
        {
          id: 'chat',
          title: 'Room Chat',
          subtitle: 'Chat Real-time',
          description: 'Chat langsung dengan sesama petani dan penyuluh dalam berbagai room diskusi tematik seperti padi, sayuran, buah, dan peternakan.',
          icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
          image: '/services/chat.jpg',
          route: '/room-chat',
          color: 'purple',
          gradient: 'from-purple-400 to-violet-600',
          bgColor: 'bg-purple-50 dark:bg-purple-900/10'
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
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full">
        <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-green-700 dark:text-green-300">Platform Diskusi Pertanian #1 Indonesia</span>
      </div>
      
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Forum Diskusi JuruTani
      </h1>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Temukan solusi pertanian terbaik melalui diskusi interaktif dengan 
        <span class="font-semibold text-green-600 dark:text-green-400">penyuluh berpengalaman</span>, 
        <span class="font-semibold text-blue-600 dark:text-blue-400">pakar pertanian</span>, dan 
        <span class="font-semibold text-amber-600 dark:text-amber-400">komunitas petani</span> seluruh Indonesia.
      </p>
    </div>

    <!-- Service Cards - Loop -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16">
      <div 
        v-for="service in services" 
        :key="service.id" 
        class="group"
      >
        <div
class="h-full rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
             :class="`hover:shadow-${service.color}-500/10`">
          <div class="p-6 h-full flex items-center gap-6">
            <!-- Content Section (Left) -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div :class="service.bgColor" class="p-2.5 rounded-xl">
                  <UIcon :name="service.icon" :class="`w-5 h-5 text-${service.color}-800 dark:text-${service.color}-600`" />
                </div>
                <span :class="`text-sm font-medium text-${service.color}-400 dark:text-${service.color}-300 uppercase tracking-wide`">
                  {{ service.subtitle }}
                </span>
              </div>
              
              <h3 class="text-xl font-bold text-gray-900 dark:text-gray-600 mb-3">
                {{ service.title }}
              </h3>
              
              <p class="text-gray-800 dark:text-gray-300 text-sm leading-relaxed mb-4">
                {{ service.description }}
              </p>
              
              <UButton 
                :to="service.route" 
                :color="service.color" 
                size="sm"
                class="font-medium group-hover:scale-105 transition-transform duration-200"
              >
                <template #leading>
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
                </template>
                Mulai Sekarang
              </UButton>
            </div>
            
            <!-- Image Section (Right) -->
            <div class="flex-shrink-0 flex items-center h-full">
              <img :src="service.image" :alt="service.title" class="w-28 h-28 object-cover rounded-full" >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mx-auto max-w-4xl">
      <div class="rounded-3xl bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/10 dark:via-emerald-900/10 dark:to-teal-900/10 border border-green-200 dark:border-green-700 p-8">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-green-100 dark:bg-green-800 rounded-full">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-green-600 dark:text-green-400" />
            <span class="text-sm font-medium text-green-700 dark:text-green-300">Tentang Layanan JuruTani</span>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Mengapa Memilih JuruTani?
          </h3>
          
          <div class="grid md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 mb-3 rounded-xl bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Terverifikasi</h4>
              <p class="text-center">Semua penyuluh dan pakar telah terverifikasi dan berpengalaman di bidangnya</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 mb-3 rounded-xl bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <UIcon name="i-heroicons-clock" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Respon Cepat</h4>
              <p class="text-center">Dapatkan jawaban dalam hitungan menit dari komunitas aktif kami</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 mb-3 rounded-xl bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                <UIcon name="i-heroicons-heart" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Gratis</h4>
              <p class="text-center">Semua layanan diskusi dan konsultasi tersedia gratis untuk seluruh petani Indonesia</p>
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

/* Custom hover animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.group:hover img {
  animation: float 2s ease-in-out infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .p-6 {
    padding: 1rem;
  }
  
  .gap-6 {
    gap: 1rem;
  }
  
  .w-24 {
    width: 4rem;
  }
  
  .h-24 {
    height: 4rem;
  }

  .w-16 {
    width: 2.5rem;
  }
  
  .h-16 {
    height: 2.5rem;
  }
}
</style>