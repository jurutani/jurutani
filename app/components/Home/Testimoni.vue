<script setup lang="ts">
// Data testimoni pengguna Juru Tani
const testimonialsBase = [
  {
    id: 1,
    name: 'Ahmad Blora',
    email: 'Bloraachmad@gmail.com',
    role: 'Petani Tanaman Pangan',
    description: 'Aplikasi juru tani sangat membantu saya mendapatkan informasi tentang masalah pertanian. Contohnya tentang hama dan penyakit tanaman, saya bisa bertanya langsung lewat chat juru tani.',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Blora&background=10b981&color=fff',
    color: 'green',
    rating: 5
  },
  {
    id: 2,
    name: 'Fisya Hapsari',
    email: 'fisyanahapsari@gmail.com',
    role: 'UMKM Produk Pertanian',
    description: 'Juru tani bermanfaat untuk promosi produk saya untuk lebih dikenal banyak orang. Platform ini memberikan akses yang luas untuk memasarkan hasil pertanian saya.',
    avatar: 'https://ui-avatars.com/api/?name=Fisya+Hapsari&background=f59e0b&color=fff',
    color: 'blue',
    rating: 5
  },
  {
    id: 3,
    name: 'Sugeng',
    email: 'Sugeng2703@gmail.com',
    role: 'Petani Mitra',
    description: 'Juru tani solusi yang tepat untuk membantu saya menghubungi langsung ke penyuluh. Fitur komunikasi langsung ini sangat memudahkan saya dalam berkonsultasi tentang teknik bertani.',
    avatar: 'https://ui-avatars.com/api/?name=Sugeng&background=ef4444&color=fff',
    color: 'orange',
    rating: 5
  },
  {
    id: 4,
    name: 'Suwarni',
    email: 'Suwarni@gmail.com',
    role: 'Petani Sayuran',
    description: 'Juru tani mantap! Terdapat fitur cuaca dan kalkulator benih dan pupuk sebagai bahan pertimbangan dalam budidaya tanaman. Tools ini sangat membantu perencanaan pertanian saya.',
    avatar: 'https://ui-avatars.com/api/?name=Suwarni&background=8b5cf6&color=fff',
    color: 'yellow',
    rating: 5
  },
]

// Duplicate data untuk seamless infinite scroll
const testimonials = [...testimonialsBase, ...testimonialsBase, ...testimonialsBase]
</script>

<template>
  <div class="testimonials-section py-16 bg-green-50 dark:bg-green-900/20">
    <UContainer>
      <!-- Section Header -->
      <div class="mx-auto mb-12 max-w-4xl text-center">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
          <!-- Icon Testimoni -->
        <UIcon name="i-lucide-message-square-more" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Apa Kata Mereka</span>
        </div>

        <h2 class="text-3xl py-2 md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Testimoni Pengguna Juru Tani
        </h2>

        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Bergabunglah dengan ribuan petani yang telah merasakan manfaat aplikasi <span class="font-semibold text-emerald-600 dark:text-emerald-400">Juru Tani</span> dalam meningkatkan produktivitas dan efisiensi pertanian mereka.
        </p>
      </div>

      <!-- Testimonials Grid - Horizontal Scroll Animation -->
      <div class="testimonials-wrapper">
        <div class="testimonials-grid">
          <!-- Testimonial Card -->
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.id" 
            class="testimonial-card group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          >
          <!-- Header dengan Avatar dan Icon -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex gap-4 items-start flex-1">
              <img
                :src="testimonial.avatar"
                :alt="testimonial.name"
                class="w-12 h-12 rounded-full object-cover flex-shrink-0"
                loading="lazy"
              />
              <div>
                <h3 class="text-base font-bold text-gray-800 dark:text-white">
                  {{ testimonial.name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ testimonial.role }}
                </p>
              </div>
            </div>
          </div>

          <!-- Rating Stars -->
          <div class="flex gap-1 mb-4">
            <UIcon 
              v-for="star in testimonial.rating" 
              :key="star"
              name="i-lucide-star"
              class="w-4 h-4 text-yellow-400 fill-yellow-400"
            />
          </div>

          <!-- Testimonial Text -->
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            {{ testimonial.description }}
          </p>

          <!-- Email -->
          <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {{ testimonial.email }}
          </p>
        </div>
      </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.testimonials-wrapper {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.testimonials-grid {
  display: flex;
  gap: 2rem;
  animation: slideRightInfinite 60s linear infinite;
  width: max-content;
  padding: 1rem 0;
}

@keyframes slideRightInfinite {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-33.333% - 2rem));
  }
}

.testimonials-grid:hover {
  animation-play-state: paused;
}

.testimonial-card {
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  min-width: 350px;
  width: 350px;
}

.testimonial-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-4px);
}

/* Dark mode shadow adjustment */
:dark .testimonial-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

:dark .testimonial-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
}

/* Responsiveness */
@media (max-width: 768px) {
  .testimonials-grid {
    gap: 1.5rem;
  }

  .testimonial-card {
    min-width: 280px;
    width: 280px;
  }
}

@media (max-width: 640px) {
  .testimonial-card {
    min-width: 250px;
    width: 250px;
    padding: 1rem;
  }

  .testimonials-grid {
    gap: 1rem;
  }
}
</style>
