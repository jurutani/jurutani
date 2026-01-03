<script setup lang="ts">
// SEO Optimization
useSeoOptimized('terms')
</script>

<template>
  <section class="min-h-screen pt-24 pb-12 lg:pt-32 text-gray-800 dark:text-gray-200 transition-colors duration-300 px-6">
    <div class="max-w-3xl mx-auto">
      <!-- Header dengan logo -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <div class="mr-3 p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <UIcon name="i-lucide-book-open" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-lg font-semibold text-green-700 dark:text-green-400">Juru Tani</h3>
        </div>
      </div>

      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 mb-2">Syarat & Ketentuan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Terakhir diperbarui: 20 Juli 2025</p>
      </div>

      <!-- Intro with decorative element -->
      <div class="relative mb-10 bg-green-50 dark:bg-green-900/30 p-5 rounded-lg border-l-4 border-green-500 dark:border-green-600">
        <p class="text-base md:text-lg leading-relaxed">
          Selamat datang di <strong class="text-green-700 dark:text-green-400">Juru Tani</strong>. Dokumen ini berisi syarat dan ketentuan yang mengatur penggunaan platform dan layanan kami. Mohon membaca dengan seksama sebelum menggunakan platform kami.
        </p>
      </div>

      <!-- Sections -->
      <div class="space-y-8">
        <!-- Section 1 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">1. Pengantar</h2>
          <div class="flex items-start">
            <span class="inline-flex mr-2 mt-1">
              <UIcon name="i-lucide-info" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </span>
            <p class="text-base leading-relaxed">
              Dengan mengakses dan menggunakan platform <strong class="text-green-700 dark:text-green-400">Juru Tani</strong>, Anda setuju untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan salah satu dari ketentuan ini, Anda tidak diperkenankan untuk menggunakan layanan kami.
            </p>
          </div>
        </section>

        <!-- Section 2 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">2. Penggunaan Layanan</h2>
          <ul class="list-none space-y-3 text-base leading-relaxed pl-2">
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span>Anda bertanggung jawab atas keamanan akun Anda, termasuk kata sandi dan semua aktivitas yang terjadi di dalamnya.</span>
            </li>
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span>Dilarang menggunakan layanan untuk tindakan yang melanggar hukum atau merugikan pihak lain.</span>
            </li>
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span>Kami berhak menangguhkan atau menghentikan akses pengguna yang melanggar ketentuan ini.</span>
            </li>
          </ul>
        </section>

        <!-- Section 3 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">3. Hak Kekayaan Intelektual</h2>
          <div class="flex items-start">
            <span class="inline-flex mr-2 mt-1">
              <UIcon name="i-lucide-shield" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </span>
            <p class="text-base leading-relaxed">
              Semua konten di platform ini termasuk logo, teks, grafik, dan perangkat lunak adalah milik <strong class="text-green-700 dark:text-green-400">Juru Tani</strong> kecuali dinyatakan lain. Dilarang menyalin, mendistribusikan, atau menggunakan konten tersebut tanpa izin tertulis dari kami.
            </p>
          </div>
        </section>

        <!-- Section 4 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">4. Tanggung Jawab</h2>
          <div class="flex items-start">
            <span class="inline-flex mr-2 mt-1">
              <UIcon name="i-lucide-alert-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </span>
            <div class="text-base leading-relaxed">
              <p class="mb-2">
                Kami tidak bertanggung jawab atas kerugian yang timbul akibat penyalahgunaan platform ini oleh pihak ketiga. Penggunaan informasi dan layanan kami sepenuhnya menjadi risiko Anda sendiri.
              </p>
              <p>
                <strong class="text-green-700 dark:text-green-400">Juru Tani</strong> tidak memberikan jaminan bahwa:
              </p>
              <ul class="list-none space-y-2 mt-2 pl-6">
                <li class="flex items-start">
                  <span class="inline-flex mr-2 mt-1 text-xs">•</span>
                  <span>Layanan akan selalu tersedia tanpa gangguan</span>
                </li>
                <li class="flex items-start">
                  <span class="inline-flex mr-2 mt-1 text-xs">•</span>
                  <span>Layanan akan bebas dari kesalahan atau bug</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Section 5 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">5. Perubahan Ketentuan</h2>
          <div class="flex items-start">
            <span class="inline-flex mr-2 mt-1">
              <UIcon name="i-lucide-refresh-cw" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </span>
            <p class="text-base leading-relaxed">
              Kami berhak memperbarui syarat dan ketentuan ini tanpa pemberitahuan sebelumnya. Dengan terus menggunakan platform kami setelah perubahan tersebut, Anda dianggap telah menyetujui syarat dan ketentuan yang telah diperbarui.
            </p>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
