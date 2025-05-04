<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { modalStore } from '~/composables/useJuruTaniModal'
import { toastStore } from '~/composables/useJuruTaniToast'

// Import modal components
import NewsModalForm from '~/components/News/Modal/Form.vue'
import ProductModalForm from '~/components/Product/Modal/Form.vue'
import UpdatesModalForm from '~/components/Updates/Modal/Form.vue'

const isDropdownOpen = ref(false)
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value)
const closeDropdown = () => (isDropdownOpen.value = false)

// Close dropdown jika klik di luar FAB
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.floating-action-button')) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// Modal handlers
const openNews = () => {
  modalStore.open(NewsModalForm, { isEdit: false })
  closeDropdown()
  toastStore.info('Silakan isi form berita baru')
}

const openProduct = () => {
  modalStore.open(ProductModalForm, { isEdit: false })
  closeDropdown()
  toastStore.info('Silakan isi form produk baru')
}

const openUpdate = () => {
  modalStore.open(UpdatesModalForm, { isEdit: false })
  closeDropdown()
  toastStore.info('Silakan isi form update baru')
}
</script>

<template>
  <div class="floating-action-button fixed bottom-6 right-6 z-40">
    <Transition name="fade">
      <div
        v-if="isDropdownOpen"
        class="space-y-3 absolute bottom-20 right-0 flex flex-col items-end"
      >
        <div class="flex items-center space-x-2">
          <span class="bg-white rounded-lg py-1 px-3 shadow-md text-gray-800">Berita</span>
          <button
            class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all"
            aria-label="Tambah Berita"
            @click="openNews"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <span class="bg-white rounded-lg py-1 px-3 shadow-md text-gray-800">Produk</span>
          <button
            class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all"
            aria-label="Tambah Produk"
            @click="openProduct"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <span class="bg-white rounded-lg py-1 px-3 shadow-md text-gray-800">Update</span>
          <button
            class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all"
            aria-label="Tambah Update"
            @click="openUpdate"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Main floating button -->
    <button
      class="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:bg-emerald-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      aria-label="Menu Tambah"
      @click="toggleDropdown"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 transition-transform duration-300"
        :class="{ 'rotate-45': isDropdownOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Dekorasi tema Juru Tani */
.floating-action-button::before {
  content: '';
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  background-color: rgba(16, 185, 129, 0.3); /* Emerald */
  border-radius: 50%;
  z-index: -1;
}
.floating-action-button::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 8px;
  height: 8px;
  background-color: rgba(16, 185, 129, 0.2); /* Emerald */
  border-radius: 50%;
  z-index: -1;
}
</style>