<script setup lang="ts">
const isOpen = ref(false)

// Cookie untuk menandai sudah pernah membuka
const firstVisit = useCookie('firstVisit', {
  maxAge: 21600, // 6 jam
  path: '/',
  sameSite: 'lax'
})

// Fungsi buka modal
const openModal = () => {
  isOpen.value = true
}

// Fungsi tutup modal
const closeModal = () => {
  isOpen.value = false
  firstVisit.value = 'visited' // cookie diset di browser
}

// Pastikan hanya dijalankan di sisi client
onMounted(() => {
  if (process.client) {
    if (!firstVisit.value) {
      openModal()
    } else {
      isOpen.value = false
    }
  }
})

// Ekspor untuk bisa dipanggil dari luar (misal parent)
defineExpose({
  openModal,
  closeModal,
  isOpen
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        @click="closeModal"
      />
    </Transition>

    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center z-50 px-4"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="flex flex-col items-center justify-center p-8 space-y-6">
            <div class="flex justify-center">
              <TheLogo class="h-24" />
            </div>

            <div class="space-y-4 text-center">
              <h1 class="text-3xl md:text-4xl font-extrabold text-emerald-800 leading-tight">
                Selamat Datang di Juru Tani!
              </h1>
              <p class="text-base md:text-lg text-gray-700">
                Terima kasih telah mengunjungi website kami.
              </p>
            </div>

            <div class="pt-2 w-full">
              <button
                @click="closeModal"
                class="w-full px-8 py-3 bg-emerald-600 text-white text-sm md:text-base font-medium rounded-lg hover:bg-emerald-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Masuk ke Beranda
              </button>
            </div>

            <div class="pt-6 space-y-3 w-full flex flex-col items-center text-center">
              <p class="text-xs md:text-sm text-green-600/70 font-medium">
                Sponsored by:
              </p>
              <div class="flex justify-center">
                <img
                  src="/logo/sponsor1.png"
                  alt="Sponsor Logo"
                  class="h-12 md:h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-200 mx-auto"
                />
              </div>
            </div>

            <div class="pt-4 border-t border-green-200/30 text-center w-full">
              <p class="text-xs md:text-sm text-green-600/60">
                Powered by : <br>
                <a
                  href="https://kairav-portfolio.vercel.app/"
                  target="_blank"
                  class="font-medium hover:text-green-600 transition-colors underline decoration-dotted ml-1"
                >
                  Politeknik Pembangunan Pertanian Yogyakarta Magelang
                </a>
              </p>
            </div>

            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>
