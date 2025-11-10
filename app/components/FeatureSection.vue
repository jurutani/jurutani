<script setup lang="ts">
// Data fitur-fitur Jurutani
const features = [
  {
    id: 1,
    title: 'Konsultasi Pertanian',
    description: 'Konsultasi langsung dengan pakar pertanian berpengalaman untuk hasil panen terbaik',
    icon: 'i-fa-solid-comments',
    image: '/feature/consult.JPG',
    url: '/discussions',
    color: 'green'
  },
  {
    id: 2,
    title: 'Alat Pertanian',
    description: 'Hitung kebutuhan pertanian Anda dengan kalkulator kami dan dapatkan rekomendasi terbaik',
    image: '/feature/cuaca.JPG',
    color: 'blue',
    url: '/tools',
    icon: 'i-fa-solid-sun'
  },
  {
    id: 3,
    title: 'Marketplace Hasil Tani',
    description: 'Jual hasil pertanian Anda langsung ke konsumen tanpa perantara',
    icon: 'i-fa-solid-store',
    image: '/feature/markets.JPG',
    url: '/markets',
    color: 'orange'
  },
  {
    id: 4,
    title: 'Kursus & Pelatihan',
    description: 'Tingkatkan pengetahuan dan keterampilan bertani melalui kursus online dan offline',
    icon: 'i-fa-solid-graduation-cap',
    image: '/feature/training.JPG',
    url: '/courses',
    color: 'yellow'
  },
  {
    id: 5,
    title: 'Komunitas Petani',
    description: 'Bergabung dengan komunitas petani untuk berbagi pengalaman dan pengetahuan',
    icon: 'i-fa-solid-users',
    image: '/feature/comunity.JPG',
    url: '/discussions/group',
    color: 'indigo'
  },
]
</script>

<template>
  <section class="features-section py-16 bg-green-50 dark:bg-green-900/20 mb-8">
    <UContainer>
      <!-- Section Header -->
       <div class="mx-auto mb-6 max-w-4xl text-center">
          <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
            <!-- Ikon Obeng -->
            <UIcon name="i-lucide-pencil" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Fitur Terbaru</span>
          </div>

          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Layanan Juru tani Reborn
          </h2>

          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Solusi lengkap untuk kebutuhan pertanian modern Anda dengan teknologi terkini:
            <span class="font-semibold text-emerald-600 dark:text-emerald-400"> Diskusi dengan Penyuluh</span>, 
            <span class="font-semibold text-teal-600 dark:text-teal-400">Pakar Juru Tani</span>, hingga  
            <span class="font-semibold text-cyan-600 dark:text-cyan-400">AI</span> yang dibuat khusus untuk menyelesaikan permasalahan pertanian.
          </p>
        </div>


      <!-- Features Grid -->
      <div class="features-grid">
        <!-- Feature Card -->
        <div 
          v-for="feature in features" 
          :key="feature.id" 
          class="feature-card group"
        >
          <!-- Image Section dengan Overlay -->
          <div class="relative overflow-hidden rounded-t-xl">
            <NuxtImg 
              :src="feature.image" 
              :alt="feature.title"
              class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
            
            <!-- Icon Circle pada Gambar -->
            <div 
              class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:-translate-y-1"
              :class="`bg-${feature.color}-600 text-white`"
            >
              <UIcon :name="feature.icon" class="text-xl" />
            </div>
          </div>
          
          <!-- Content Section -->
          <div class="pt-8 pb-6 px-5 text-center bg-white dark:bg-gray-800 rounded-b-xl">
            <h3 class="mb-2 text-lg font-bold text-gray-800 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ feature.description }}
            </p>
            
            <!-- Call to Action Button -->
            <NuxtLink 
              :to="feature.url" 
              class="mt-4 inline-flex items-center justify-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              <span>Pelajari Lebih Lanjut</span>
              <UIcon name="i-fa-solid-arrow-right" class="text-xs" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-5px);
}

/* Warna untuk icon */
.bg-green-600 { background-color: #2E7D32; }
.bg-blue-600 { background-color: #1E88E5; }
.bg-orange-600 { background-color: #F57C00; }
.bg-yellow-600 { background-color: #FDD835; color: #333; } /* Text dark for better contrast */
.bg-indigo-600 { background-color: #3949AB; }
.bg-cyan-600 { background-color: #00ACC1; }

/* Responsiveness */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card .h-48 {
    height: 180px;
  }
}
</style>