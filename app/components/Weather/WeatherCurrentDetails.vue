<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean
  error: string
  weatherData: any
  farmingConditions: any
  windDirection: string
  sunriseTime: string
  sunsetTime: string
}>()
</script>

<template>
  <div>
    <LoadingData v-if="isLoading" message="Memuat data cuaca..." />
    <NotFoundData v-else-if="error" :message="error" />
    <div v-else-if="weatherData" class="space-y-6">
      <!-- Weather Details Grid (glassmorphism style) -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <!-- Kelembaban -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-blue-500/10">
              <UIcon name="i-ic-baseline-water-drop" class="w-5 h-5 text-blue-500" />
            </div>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Kelembaban</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ weatherData.main.humidity }}%</p>
        </div>

        <!-- Angin -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-cyan-500/10">
              <UIcon name="i-ic-baseline-air" class="w-5 h-5 text-cyan-500" />
            </div>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Angin</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ weatherData.wind?.speed || 0 }} m/s</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ windDirection }}</p>
        </div>

        <!-- Matahari Terbit -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-orange-500/10">
              <UIcon name="i-ic-baseline-wb-sunny" class="w-5 h-5 text-orange-500 transition-transform group-hover:rotate-180 duration-500" />
            </div>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Terbit</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ sunriseTime }}</p>
        </div>

        <!-- Matahari Terbenam -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-red-500/10">
              <UIcon name="i-ic-baseline-wb-twilight" class="w-5 h-5 text-red-500" />
            </div>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Terbenam</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ sunsetTime }}</p>
        </div>

        <!-- Jarak Pandang -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-purple-500/10">
              <UIcon name="i-ic-baseline-visibility" class="w-5 h-5 text-purple-500" />
            </div>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Pandang</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ (weatherData.visibility / 1000).toFixed(1) }} km</p>
        </div>

        <!-- Tekanan -->
        <div class="glass-card group">
          <div class="flex items-center gap-2 mb-3">
            <div class="icon-wrapper bg-indigo-500/10">
              <UIcon name="i-ic-baseline-speed" class="w-5 h-5 text-indigo-500" />
            </div>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Tekanan</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ weatherData.main.pressure }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">hPa</p>
        </div>
      </div>

      <!-- Rekomendasi Pertanian -->
      <div v-if="farmingConditions" class="glass-card-large group">
        <div class="flex items-center gap-3 mb-6">
          <div class="icon-wrapper-large bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <UIcon name="i-ic-baseline-agriculture" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Rekomendasi Pertanian</h3>
        </div>

        <!-- Status Card -->
        <div
          :class="[
            'status-card mb-5',
            farmingConditions.suitable 
              ? 'status-optimal' 
              : 'status-warning'
          ]"
        >
          <div class="flex items-center gap-3">
            <div :class="[
              'p-2 rounded-xl backdrop-blur-sm',
              farmingConditions.suitable 
                ? 'bg-green-500/20' 
                : 'bg-yellow-500/20'
            ]">
              <UIcon
                :name="farmingConditions.suitable ? 'i-ic-baseline-check-circle' : 'i-ic-baseline-warning'"
                :class="[
                  'w-6 h-6',
                  farmingConditions.suitable ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                ]"
              />
            </div>
            <p class="font-semibold text-lg text-gray-900 dark:text-white">
              {{ farmingConditions.suitable ? 'Kondisi Optimal' : 'Perlu Perhatian' }}
            </p>
          </div>
        </div>

        <!-- Recommendations List -->
        <div class="space-y-3">
          <div
            v-for="(rec, index) in farmingConditions.recommendations"
            :key="index"
            class="recommendation-card"
          >
            <div class="icon-wrapper-small bg-green-500/10 flex-shrink-0">
              <UIcon name="i-ic-baseline-check" class="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ rec }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Glassmorphism Cards */
.glass-card {
  @apply relative overflow-hidden rounded-2xl p-4;
  @apply bg-white/70 dark:bg-gray-800/70;
  @apply backdrop-blur-xl backdrop-saturate-150;
  @apply border border-white/20 dark:border-gray-700/30;
  @apply shadow-lg shadow-black/5 dark:shadow-black/20;
  @apply transition-all duration-300;
  @apply hover:scale-105 hover:shadow-xl hover:shadow-black/10;
  @apply hover:border-white/40 dark:hover:border-gray-600/50;
}

.glass-card::before {
  content: '';
  @apply absolute inset-0 rounded-2xl;
  @apply bg-gradient-to-br from-white/50 to-transparent dark:from-white/5;
  @apply opacity-0 group-hover:opacity-100;
  @apply transition-opacity duration-300;
  pointer-events: none;
}

.glass-card-large {
  @apply relative overflow-hidden rounded-3xl p-6;
  @apply bg-white/70 dark:bg-gray-800/70;
  @apply backdrop-blur-xl backdrop-saturate-150;
  @apply border border-white/20 dark:border-gray-700/30;
  @apply shadow-xl shadow-black/5 dark:shadow-black/20;
  @apply transition-all duration-300;
  @apply hover:shadow-2xl hover:shadow-black/10;
}

.glass-card-large::before {
  content: '';
  @apply absolute inset-0 rounded-3xl;
  @apply bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10;
  @apply opacity-50 group-hover:opacity-100;
  @apply transition-opacity duration-500;
  pointer-events: none;
}

/* Icon Wrappers */
.icon-wrapper {
  @apply p-2 rounded-xl;
  @apply backdrop-blur-sm;
  @apply transition-all duration-300;
  @apply group-hover:scale-110;
}

.icon-wrapper-large {
  @apply p-3 rounded-2xl;
  @apply backdrop-blur-sm;
  @apply transition-all duration-300;
  @apply group-hover:scale-110 group-hover:rotate-3;
}

.icon-wrapper-small {
  @apply p-2 rounded-lg;
  @apply backdrop-blur-sm;
  @apply transition-all duration-300;
}

/* Status Cards */
.status-card {
  @apply relative overflow-hidden rounded-2xl p-5;
  @apply backdrop-blur-md backdrop-saturate-150;
  @apply border-l-4;
  @apply transition-all duration-300;
  @apply hover:scale-[1.01];
}

.status-optimal {
  @apply bg-green-50/80 dark:bg-green-900/20;
  @apply border-green-500 dark:border-green-400;
  @apply shadow-lg shadow-green-500/10;
}

.status-warning {
  @apply bg-yellow-50/80 dark:bg-yellow-900/20;
  @apply border-yellow-500 dark:border-yellow-400;
  @apply shadow-lg shadow-yellow-500/10;
}

/* Recommendation Cards */
.recommendation-card {
  @apply relative flex items-start gap-3 p-4;
  @apply bg-white/60 dark:bg-gray-700/60;
  @apply backdrop-blur-md backdrop-saturate-150;
  @apply rounded-xl;
  @apply border border-white/30 dark:border-gray-600/30;
  @apply shadow-md shadow-black/5;
  @apply transition-all duration-300;
  @apply hover:scale-[1.02] hover:shadow-lg;
  @apply hover:bg-white/80 dark:hover:bg-gray-700/80;
  @apply hover:border-green-300/50 dark:hover:border-green-600/50;
}

.recommendation-card::before {
  content: '';
  @apply absolute inset-0 rounded-xl;
  @apply bg-gradient-to-r from-green-500/5 to-emerald-500/5;
  @apply opacity-0 hover:opacity-100;
  @apply transition-opacity duration-300;
  pointer-events: none;
}
</style>