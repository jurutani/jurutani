<template>
  <div class="join-community py-12">
    <div class="container mx-auto py-10 px-4">
     <div class="flex items-center mb-10 gap-4">
        <NuxtLink 
          to="/discussions" 
          class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
          aria-label="Kembali ke Diskusi"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        
        <h1 class="text-3xl font-bold text-green-700 leading-tight flex items-center my-auto">
          Diskusi Komunitas Juru Tani
        </h1>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex justify-center mb-8">
          <TheLogo />
        </div>

        <p class="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
          Bergabunglah dengan komunitas Juru Tani untuk mendapatkan informasi terbaru, tips pertanian, dan terhubung dengan petani lainnya melalui berbagai platform media sosial kami.
        </p>

        <div class="social-media-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- YouTube -->
          <div class="social-media-card flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
            <div class="icon-wrapper bg-red-100 dark:bg-red-900 p-4 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">YouTube</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center mb-4">Tutorial dan tips seputar dunia pertanian dalam bentuk video</p>
            <a href="https://www.youtube.com/@Juru_Tani" target="_blank" rel="noopener noreferrer" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-300">
              Subscribe
            </a>
          </div>
          
          <!-- TikTok -->
          <div class="social-media-card flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
            <div class="icon-wrapper bg-black dark:bg-gray-700 p-4 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">TikTok</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center mb-4">Konten kreatif bertani dan teknik pertanian modern</p>
            <a href="https://www.tiktok.com/@juru_tani" target="_blank" rel="noopener noreferrer" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-300">
              Ikuti
            </a>
          </div>
          
          <!-- Instagram -->
          <div class="social-media-card flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
            <div class="icon-wrapper bg-purple-100 dark:bg-purple-900 p-4 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Instagram</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center mb-4">Foto inspiratif hasil panen dan aktivitas petani</p>
            <a href="https://www.instagram.com/jurutani_/" target="_blank" rel="noopener noreferrer" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-300">
              Follow
            </a>
          </div>
          
          <!-- WhatsApp -->
          <div class="social-media-card flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
            <div class="icon-wrapper bg-green-100 dark:bg-green-900 p-4 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">WhatsApp</h3>
            <p class="text-gray-600 dark:text-gray-400 text-center mb-4">Grup diskusi untuk pertanyaan dan berbagi pengalaman</p>
            <a href="https://api.whatsapp.com/send/?phone=6281575525260&text=Saya+ingin+bergabung+dengan+grup+Juru+Tani&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors duration-300">
              Gabung Grup
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'JoinCommunity',
  head() {
    return {
      title: 'Gabung Komunitas - Juru Tani',
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Bergabung dengan komunitas Juru Tani untuk mendapatkan informasi terbaru dan terhubung dengan petani lainnya'
        }
      ]
    }
  }
})
</script>

<style scoped>
.social-media-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.social-media-card:hover {
  transform: translateY(-5px);
}

.icon-wrapper {
  transition: transform 0.3s ease;
}

.social-media-card:hover .icon-wrapper {
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .social-media-container {
    grid-template-columns: 1fr;
  }
}
</style>