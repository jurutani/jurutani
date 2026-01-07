<script setup lang="ts">
import { computed } from 'vue'
import { foodPricesData, foodPriceCategories, formatCurrency, type FoodPrice } from '~/data/food-prices'

// Filter kategori utama (4 kategori, exclude 'all')
const mainCategories = computed(() => {
  return foodPriceCategories
    .filter(cat => cat.value !== 'all')
    .slice(0, 4)
})

// Ambil 5 data terbaru per kategori
const getCategoryData = (categoryValue: string): FoodPrice[] => {
  return foodPricesData
    .filter(item => item.category === categoryValue)
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || '2026-01-01')
      const dateB = new Date(b.updated_at || '2026-01-01')
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)
}

// Grouped data per kategori
const categorizedData = computed(() => {
  return mainCategories.value.map(category => ({
    category,
    items: getCategoryData(category.value)
  }))
})

// Format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch {
    return ''
  }
}

// Get category color
const getCategoryColor = (categoryValue: string) => {
  const colors: Record<string, string> = {
    'Hortikultura': 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    'Perkebunan': 'from-green-50 to-lime-50 dark:from-green-950/30 dark:to-lime-950/30',
    'Peternakan': 'from-orange-50 to-green-50 dark:from-orange-950/30 dark:to-green-950/30',
    'Perikanan': 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
  }
  return colors[categoryValue] || 'from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30'
}

// Get category icon color
const getCategoryIconColor = (categoryValue: string) => {
  const colors: Record<string, string> = {
    'Hortikultura': 'text-emerald-600 dark:text-emerald-400',
    'Perkebunan': 'text-green-600 dark:text-green-400',
    'Peternakan': 'text-orange-600 dark:text-orange-400',
    'Perikanan': 'text-blue-600 dark:text-blue-400',
  }
  return colors[categoryValue] || 'text-gray-600 dark:text-gray-400'
}

// Get price color
const getPriceColor = (categoryValue: string) => {
  const colors: Record<string, string> = {
    'Hortikultura': 'text-emerald-600 dark:text-emerald-400',
    'Perkebunan': 'text-green-600 dark:text-green-400',
    'Peternakan': 'text-orange-600 dark:text-orange-400',
    'Perikanan': 'text-blue-600 dark:text-blue-400',
  }
  return colors[categoryValue] || 'text-gray-600 dark:text-gray-400'
}
</script>

<template>
  <div class="food-price-section container max-w-6xl mx-auto px-4 py-12">
    <!-- Section Header -->
    <div class="mx-auto mb-10 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-green-100 to-orange-100 dark:from-green-900/20 dark:to-green-900/20 rounded-full">
        <UIcon name="i-lucide-trending-down" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-green-700 dark:text-green-300">Harga Pangan Terupdate</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl py-1 font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Pantau Harga Pangan DIY
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Informasi harga komoditas pertanian terkini dari berbagai produsen lokal Daerah Istimewa Yogyakarta. 
        <span class="font-semibold text-green-600 dark:text-green-400">Update harian</span> untuk kebutuhan Anda.
      </p>
    </div>

    <!-- Bento Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div 
        v-for="categoryGroup in categorizedData" 
        :key="categoryGroup.category.value"
        :class="[
          'rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden',
          'hover:shadow-xl transition-all duration-300',
          'bg-gradient-to-br',
          getCategoryColor(categoryGroup.category.value)
        ]"
      >
        <!-- Category Header -->
        <div class="p-6 pb-4 border-b border-gray-200 dark:border-gray-700/50">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 rounded-lg bg-white/60 dark:bg-gray-900/60">
              <UIcon 
                :name="categoryGroup.category.icon || 'i-lucide-package'" 
                :class="['w-6 h-6', getCategoryIconColor(categoryGroup.category.value)]"
              />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ categoryGroup.category.name }}
            </h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Harga per {{ formatDate(categoryGroup.items[0]?.updated_at) }}
          </p>
        </div>

        <!-- Items List -->
        <div class="p-6">
          <ul v-if="categoryGroup.items.length > 0" class="space-y-3">
            <li 
              v-for="item in categoryGroup.items" 
              :key="item.id"
              class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div class="flex-1 min-w-0">
                <span class="text-gray-900 dark:text-white font-medium">{{ item.name }}</span>
                <span class="text-gray-500 dark:text-gray-400 text-sm ml-2">- {{ item.producer }}</span>
              </div>
              <div class="text-green-600 dark:text-green-400 font-bold whitespace-nowrap ml-4">
                {{ formatCurrency(item.price) }}/{{ item.unit }}
              </div>
            </li>
          </ul>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <UIcon name="i-lucide-package-x" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
            <p class="text-sm text-gray-500 dark:text-gray-500">
              Belum ada data tersedia
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Button -->
    <div class="text-center">
      <NuxtLink 
        to="/food-prices"
        class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-orange-600 hover:from-green-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <span class="text-lg">Lihat Semua Harga Pangan</span>
        <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
      </NuxtLink>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Temukan ribuan komoditas pertanian dengan harga terbaik
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.food-price-section {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects */
.group:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
