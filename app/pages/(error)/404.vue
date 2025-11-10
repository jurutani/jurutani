<script setup lang="ts">
import { computed } from 'vue'

// Props error dari Nuxt
const props = defineProps<{
  error?: {
    url?: string
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
    data?: any
  }
}>()

const statusCode = computed(() => props.error?.statusCode ?? 404)
const message = computed(() => String(props.error?.message || ''))
const is404 = computed(() => statusCode.value === 404 || message.value.includes('404'))

const title = computed(() =>
  is404.value ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan'
)
const description = computed(() =>
  is404.value
    ? 'Halaman yang Anda cari tidak tersedia.'
    : 'Terjadi kesalahan pada server atau halaman tidak dapat dimuat.'
)

// Navigasi balik ke home
const goHome = () => navigateTo('/')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-lg mx-auto text-center animate-fade-in">
      <!-- Logo -->
      <div class="mb-8">
        <NuxtImg 
          src="/jurutani.png" 
          alt="Jurutani Logo" 
          class="w-40 mx-auto"
        />
      </div>

      <!-- Error Info -->
      <div class="mb-6">
        <h1 class="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
          {{ statusCode }}
        </h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {{ title }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>

      <!-- Back to Home -->
      <div class="mt-8">
        <UButton
          @click="goHome"
          icon="i-lucide-home"
          color="green"
          variant="solid"
          class="inline-flex items-center gap-2"
        >
          Kembali ke Beranda
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}
</style>
