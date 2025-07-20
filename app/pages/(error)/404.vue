<script setup>
  const props = defineProps({
    error: {
      type: Object,
      default() {
        return {
          url: '-',
          statusCode: 404,
          statusMessage: 'Not Found',
          message: '(404 Not Found)',
          stack: '',
          data: '{"error":"FetchError:  (404 Not Found)"}',
        }
      },
    },
  })

  const message = computed(() => String(props.error?.message || ''))
  const is404 = computed(
    () => props.error?.statusCode === 404 || message.value?.includes('404'),
  )
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

        <!-- 404 Text -->
        <div class="mb-6">
          <h1 class="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            404
          </h1>
          <h2 class="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Halaman Tidak Ditemukan
          </h2>
          <p class="text-gray-500 dark:text-gray-400">
            Halaman yang Anda cari tidak tersedia.
          </p>
        </div>

        <!-- Back Button -->
        <div class="mt-8">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali ke Beranda
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>