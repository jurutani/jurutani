<script setup>
  const props = defineProps({
    error: {
      type: Object,
      default() {
        return {
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: 'Terjadi kesalahan pada server',
          stack: '',
        }
      },
    },
  })

  const statusCode = computed(() => props.error?.statusCode || 500)
  const statusMessage = computed(() => props.error?.statusMessage || 'Internal Server Error')
  const message = computed(() => props.error?.message || 'Terjadi kesalahan pada server')
  
  const getErrorTitle = () => {
    switch (statusCode.value) {
      case 400:
        return 'Permintaan Tidak Valid'
      case 401:
        return 'Tidak Diotorisasi'
      case 403:
        return 'Akses Ditolak'
      case 404:
        return 'Halaman Tidak Ditemukan'
      case 500:
        return 'Kesalahan Server'
      case 502:
        return 'Bad Gateway'
      case 503:
        return 'Layanan Tidak Tersedia'
      default:
        return 'Terjadi Kesalahan'
    }
  }

  const getErrorDescription = () => {
    switch (statusCode.value) {
      case 400:
        return 'Permintaan yang Anda kirim tidak dapat dipahami oleh server.'
      case 401:
        return 'Anda perlu login untuk mengakses halaman ini.'
      case 403:
        return 'Anda tidak memiliki izin untuk mengakses halaman ini.'
      case 404:
        return 'Halaman yang Anda cari tidak dapat ditemukan.'
      case 500:
        return 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
      case 502:
        return 'Server tidak dapat terhubung dengan layanan yang diperlukan.'
      case 503:
        return 'Layanan sedang dalam perbaikan. Silakan coba lagi nanti.'
      default:
        return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'
    }
  }
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout name="blank">
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-lg mx-auto text-center">
        <!-- Image -->
        <div class="mb-8">
          <img 
            src="/jurutani.png" 
            alt="Jurutani" 
            class="w-48 mx-auto"
          />
        </div>

        <!-- Error Text -->
        <div class="mb-6">
          <h1 class="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
            {{ statusCode }}
          </h1>
          <h2 class="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            {{ getErrorTitle() }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400">
            {{ getErrorDescription() }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 space-y-3">
          <div>
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Kembali ke Beranda
            </NuxtLink>
          </div>
          <div>
            <button
              @click="$router.go(-1)"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Halaman Sebelumnya
            </button>
          </div>
        </div>

        <!-- Refresh Button for server errors -->
        <div v-if="statusCode >= 500" class="mt-4">
          <button
            @click="window.location.reload()"
            class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>