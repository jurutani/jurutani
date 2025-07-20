<script setup lang="ts">
useHead({ 
  title: 'Tentang Kami - Juru Tani Reborn',
  meta: [
    { name: 'description', content: 'Mengenal Juru Tani Reborn - Inovasi digital dari Politeknik Pembangunan Pertanian Yogyakarta Magelang untuk memajukan pertanian Indonesia' },
    { name: 'keywords', content: 'juru tani reborn, polbangtan yogyakarta, polbangtan magelang, pertanian digital, inovasi pertanian' }
  ]
})

// Image declarations
const logoJuruTani = '/jurutani.png'
const sponsorLogo = '/logo/sponsor1.png'
const galleryImages = [
  '/gallery/image1.JPG',
  '/gallery/image2.JPG', 
  '/gallery/image3.JPG',
  '/gallery/image4.JPG',
  '/gallery/image5.JPG'
]

// Gallery image descriptions
const galleryData = [
  { src: galleryImages[0], title: 'Laboratorium Digital', desc: 'Fasilitas teknologi terdepan untuk penelitian pertanian' },
  { src: galleryImages[1], title: 'Pelatihan Petani', desc: 'Program edukasi teknologi pertanian modern' },
  { src: galleryImages[2], title: 'Smart Farming', desc: 'Implementasi IoT dalam pertanian berkelanjutan' },
  { src: galleryImages[3], title: 'Kolaborasi Tim', desc: 'Kerja sama mahasiswa dan dosen dalam inovasi' },
  { src: galleryImages[4], title: 'Hasil Panen', desc: 'Peningkatan produktivitas melalui teknologi' }
]
</script>

<template>
  <div class="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 min-h-screen transition-colors duration-300">
    
    <!-- Hero Section with Logo -->
    <section class="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
      <div class="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"/>
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-4xl mx-auto">
          <!-- Logo -->
          <div class="mb-8">
            <img :src="logoJuruTani" alt="Juru Tani Reborn Logo" class="w-32 h-32 md:w-40 md:h-40 mx-auto drop-shadow-2xl animate-pulse">
          </div>
          
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent mb-6 leading-tight">
            Juru Tani Reborn
          </h1>
          <div class="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-6"/>
          <p class="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Inovasi digital dari <strong class="text-green-700 dark:text-green-400">Politeknik Pembangunan Pertanian Yogyakarta Magelang</strong> untuk memajukan pertanian Indonesia menuju era digital yang berkelanjutan
          </p>
          
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow">
              <div class="text-2xl font-bold text-green-700 dark:text-green-400">100+</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Petani Terdaftar</div>
            </div>
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow">
              <div class="text-2xl font-bold text-green-700 dark:text-green-400">50+</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Komoditas</div>
            </div>
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow">
              <div class="text-2xl font-bold text-green-700 dark:text-green-400">24/7</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Akses Data</div>
            </div>
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow">
              <div class="text-2xl font-bold text-green-700 dark:text-green-400">2024</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Tahun Peluncuran</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 pb-16">
      
      <!-- Tentang Juru Tani Reborn -->
      <section class="mb-16">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-green-100 dark:border-green-800">
          <h2 class="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-8 text-center">
            🚀 Apa itu Juru Tani Reborn?
          </h2>
          <div class="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            <p class="text-center text-xl mb-8 font-medium text-green-700 dark:text-green-400">
              Platform digital revolusioner yang menghubungkan teknologi modern dengan kearifan pertanian tradisional Indonesia.
            </p>
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <p class="mb-6">
                  <strong>Juru Tani Reborn</strong> adalah platform inovatif yang dikembangkan oleh mahasiswa dan dosen Politeknik Pembangunan Pertanian Yogyakarta Magelang. Platform ini menggabungkan teknologi digital terdepan dengan pengetahuan pertanian yang mendalam untuk menciptakan solusi komprehensif bagi petani Indonesia.
                </p>
                <p class="mb-6">
                  Dengan memanfaatkan database yang kaya dan sistem manajemen data yang canggih, Juru Tani Reborn memungkinkan petani untuk mengakses informasi real-time tentang komoditas, cuaca, harga pasar, dan teknik pertanian terbaru.
                </p>
              </div>
              <div>
                <p class="mb-6">
                  Platform ini tidak hanya sekadar aplikasi, tetapi merupakan ekosistem digital yang mendukung transformasi pertanian Indonesia menuju Agriculture 4.0. Melalui interface yang user-friendly dan fitur-fitur canggih, petani dapat meningkatkan produktivitas dan efisiensi usaha taninya.
                </p>
                <p class="mb-6">
                  Sebagai bagian dari misi Polbangtan Yogyakarta Magelang untuk menghasilkan lulusan yang kompeten dan inovatif, Juru Tani Reborn menjadi bukti nyata kemampuan mahasiswa dalam mengaplikasikan ilmu pengetahuan untuk kepentingan masyarakat luas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery Section -->
      <section class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-4">
            📸 Galeri Aktivitas
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Dokumentasi perjalanan pengembangan dan implementasi Juru Tani Reborn
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(item, index) in galleryData" 
            :key="index"
            class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div class="aspect-w-16 aspect-h-12">
              <img 
                :src="item.src" 
                :alt="item.title" 
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              >
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
                <p class="text-sm opacity-90">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Visi Misi -->
      <section class="mb-16">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Visi -->
          <div class="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-8 border border-green-200 dark:border-green-700">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-green-800 dark:text-green-300">🎯 Visi</h3>
            </div>
            <p class="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              Menjadi platform digital terdepan yang mengintegrasikan teknologi modern dengan praktik pertanian berkelanjutan untuk menciptakan ekosistem pertanian Indonesia yang cerdas, produktif, dan ramah lingkungan.
            </p>
          </div>

          <!-- Misi -->
          <div class="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-blue-800 dark:text-blue-300">🚀 Misi</h3>
            </div>
            <ul class="text-gray-700 dark:text-gray-300 space-y-3">
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"/>
                Mengembangkan solusi digital yang mudah diakses petani
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"/>
                Menyediakan data real-time untuk keputusan pertanian yang tepat
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"/>
                Membangun komunitas petani yang terhubung dan berdaya
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Keunggulan Platform -->
      <section class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-4">
            ⭐ Keunggulan Platform
          </h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 dark:border-green-800 hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-green-800 dark:text-green-300 mb-3">Data Terintegrasi</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Database lengkap komoditas pertanian, cuaca, dan informasi pasar dalam satu platform
            </p>
          </div>

          <div class="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 dark:border-green-800 hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">User-Friendly</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Interface yang mudah digunakan, dirancang khusus untuk petani dengan berbagai tingkat literasi digital
            </p>
          </div>

          <div class="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 dark:border-green-800 hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-3">Real-Time</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Informasi terkini tentang cuaca, harga komoditas, dan kondisi pasar untuk keputusan yang tepat
            </p>
          </div>
        </div>
      </section>

      <!-- Sponsor Section -->
      <section class="mb-16">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-green-100 dark:border-green-800 text-center">
          <h2 class="text-3xl font-bold text-green-800 dark:text-green-300 mb-8">
            🤝 Didukung Oleh
          </h2>
          <div class="flex justify-center items-center">
            <img 
              :src="sponsorLogo" 
              alt="Sponsor Logo" 
              class="max-h-24 md:max-h-32 object-contain opacity-80 hover:opacity-100 transition-opacity"
            >
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto">
            Dengan dukungan penuh dari institusi dan mitra strategis, Juru Tani Reborn terus berkembang untuk memberikan manfaat maksimal bagi petani Indonesia.
          </p>
        </div>
      </section>

      <!-- Tim Pengembang -->
      <section class="mb-16">
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            👨‍💻 Tim Pengembang
          </h2>
          <p class="text-xl mb-8 opacity-90">
            Dikembangkan dengan dedikasi tinggi oleh mahasiswa dan dosen Politeknik Pembangunan Pertanian Yogyakarta Magelang
          </p>
          <div class="grid md:grid-cols-3 gap-6 text-center">
            <div class="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div class="text-3xl mb-3">🎓</div>
              <h3 class="font-semibold text-lg mb-2">Mahasiswa Berprestasi</h3>
              <p class="text-sm opacity-90">Tim mahasiswa terpilih dengan kemampuan teknologi terdepan</p>
            </div>
            <div class="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div class="text-3xl mb-3">👩‍🏫</div>
              <h3 class="font-semibold text-lg mb-2">Dosen Pembimbing</h3>
              <p class="text-sm opacity-90">Arahan dari dosen berpengalaman di bidang pertanian dan teknologi</p>
            </div>
            <div class="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div class="text-3xl mb-3">🔬</div>
              <h3 class="font-semibold text-lg mb-2">Riset & Pengembangan</h3>
              <p class="text-sm opacity-90">Dukungan penelitian berkelanjutan untuk inovasi terdepan</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="text-center">
        <div class="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl p-8 md:p-12 border border-green-200 dark:border-green-700">
          <h2 class="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-300 mb-6">
            🌱 Bergabunglah dengan Revolusi Pertanian Digital
          </h2>
          <p class="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Jadilah bagian dari transformasi pertanian Indonesia. Dengan Juru Tani Reborn, wujudkan pertanian yang lebih cerdas, produktif, dan berkelanjutan untuk masa depan yang lebih baik.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg">
              Mulai Sekarang
            </button>
            <button class="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>