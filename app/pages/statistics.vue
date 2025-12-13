<script setup lang="ts">
import { onMounted } from 'vue'

// SEO Optimization
useSeoOptimized('statistics')

const route = useRoute()
const { stats, loading, error, fetchAnalyticsStats, trackPageView } = useGoogleAnalytics()

onMounted(async () => {
  // Track page view
  trackPageView(route.fullPath, 'Statistics Page')
  
  // Fetch analytics data
  await fetchAnalyticsStats()
})
</script>

<template>
  <section class="bg-white dark:bg-gray-900 min-h-screen pt-24 pb-12 lg:pt-32 text-gray-800 dark:text-gray-200 transition-colors duration-300 px-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header dengan logo -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <div class="mr-3 p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <UIcon name="i-lucide-bar-chart-3" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-lg font-semibold text-green-700 dark:text-green-400">Juru Tani</h3>
        </div>
      </div>

      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 mb-2">Statistik Pengunjung</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Analytics real-time dari Google Analytics</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex flex-col items-center gap-3">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p class="text-gray-600 dark:text-gray-400">Mengambil data analytics...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700 mb-8">
        <div class="flex items-start gap-3">
          <UIcon name="i-lucide-alert-circle" class="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 class="font-semibold text-red-700 dark:text-red-400 mb-1">Error Mengambil Data</h3>
            <p class="text-sm text-red-600 dark:text-red-300">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-colors duration-300"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</h3>
            <div 
              :class="[
                'p-2 rounded-full',
                stat.color === 'green' && 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
                stat.color === 'blue' && 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
                stat.color === 'purple' && 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
                stat.color === 'red' && 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900',
              ]"
            >
              <UIcon :name="stat.icon" class="h-5 w-5" />
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Info Section -->
      <div v-if="!loading && !error" class="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border-l-4 border-green-500 dark:border-green-600">
        <div class="flex items-start">
          <UIcon name="i-lucide-info" class="h-5 w-5 text-green-600 dark:text-green-400 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 class="font-semibold text-green-700 dark:text-green-400 mb-2">Data Real-time</h3>
            <p class="text-sm text-green-600 dark:text-green-300">
              Statistik ini diperbarui secara otomatis dari Google Analytics. Data ditampilkan dalam waktu UTC+7.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
