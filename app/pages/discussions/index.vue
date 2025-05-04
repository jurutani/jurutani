<template>
  <div class="discussions-page">
    <div class="container mx-auto py-10 px-4">
      <h1 class="text-3xl font-bold text-green-700 mb-8">Diskusi JuruTani</h1>
      
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Diskusi Penyuluh -->
        <div class="discussion-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 flex flex-col">
          <div class="flex items-center mb-4">
            <div class="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800">Diskusi Penyuluh</h2>
          </div>
          <p class="text-gray-600 mb-6">Diskusikan masalah pertanian Anda dengan penyuluh berpengalaman dan dapatkan saran profesional.</p>
          <NuxtLink 
            to="/discussions/instructor" 
            class="mt-auto py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-center transition-colors"
          >
            Mulai Diskusi
          </NuxtLink>
        </div>

        <!-- Diskusi Pakar -->
        <div class="discussion-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 flex flex-col">
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800">Diskusi Pakar</h2>
          </div>
          <p class="text-gray-600 mb-6">Konsultasikan dengan pakar pertanian untuk mendapatkan solusi terbaik untuk masalah yang kompleks.</p>
          <NuxtLink 
            to="/discussions/expert" 
            class="mt-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center transition-colors"
          >
            Konsultasi Pakar
          </NuxtLink>
        </div>

        <!-- Diskusi Komunitas -->
        <div class="discussion-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 flex flex-col">
          <div class="flex items-center mb-4">
            <div class="bg-yellow-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800">Diskusi Komunitas</h2>
          </div>
          <p class="text-gray-600 mb-6">Bergabunglah dengan komunitas petani lainnya untuk berbagi pengalaman dan pengetahuan pertanian.</p>
          <NuxtLink 
            to="/discussions/group" 
            class="mt-auto py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-center transition-colors"
          >
            Gabung Komunitas
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DiscussionsPage',
  head() {
    return {
      title: 'Diskusi JuruTani',
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Platform diskusi untuk petani, penyuluh, dan pakar pertanian'
        }
      ]
    }
  }
})
</script>

<style scoped>
.discussions-page {
  min-height: 100vh;
  background-color: #f0fdf4;
}
</style>