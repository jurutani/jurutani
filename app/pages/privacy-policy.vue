<script setup lang="ts">
// SEO Optimization
useSeoOptimized('privacy')
</script>

<template>
  <section class="min-h-screen pt-24 pb-12 lg:pt-32 text-gray-800 dark:text-gray-200 transition-colors duration-300 px-6">
    <div class="max-w-3xl mx-auto">
      <!-- Header dengan logo -->
      <div class="flex justify-between items-center mb-6 pt-4">
        <div class="flex items-center">
          <div class="mr-3 p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <UIcon name="i-lucide-lock" class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 class="text-lg font-semibold text-green-700 dark:text-green-400">Juru Tani</h3>
        </div>
      </div>

      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400 mb-2">Kebijakan Privasi</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Terakhir diperbarui: 5 Mei 2025</p>
      </div>

      <!-- Intro with decorative element -->
      <div class="relative mb-10 bg-green-50 dark:bg-green-900/30 p-5 rounded-lg border-l-4 border-green-500 dark:border-green-600">
        <p class="text-base md:text-lg leading-relaxed">
          <strong class="text-green-700 dark:text-green-400">Juru Tani</strong> menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan platform kami.
        </p>
      </div>

      <!-- Sections -->
      <div class="space-y-10">
        <!-- Section 1 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">1. Informasi yang Kami Kumpulkan</h2>
          <ul class="list-none space-y-3 text-base leading-relaxed pl-2">
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span><span class="font-semibold text-green-700 dark:text-green-400">Data Pribadi:</span> Nama, email, nomor telepon, dan informasi lain yang diberikan saat registrasi.</span>
            </li>
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span><span class="font-semibold text-green-700 dark:text-green-400">Data Aktivitas:</span> Log penggunaan aplikasi dan interaksi pengguna.</span>
            </li>
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span><span class="font-semibold text-green-700 dark:text-green-400">Data Lokasi:</span> Jika Anda mengizinkan, kami dapat mengakses lokasi untuk fitur tertentu.</span>
            </li>
          </ul>
        </section>

        <!-- Section 2 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">2. Penggunaan Informasi</h2>
          <p class="mb-3">Informasi digunakan untuk:</p>
          <ul class="list-none space-y-3 text-base leading-relaxed pl-2">
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span>Menyediakan dan mengelola layanan Juru Tani</span>
            </li>
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span>Meningkatkan pengalaman pengguna</span>
            </li>
            <li class="flex items-start">
              <span class="inline-flex mr-2 mt-1">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5 text-green-500 dark:text-green-400" />
              </span>
              <span>Mengirim notifikasi atau informasi terkait</span>
            </li>
          </ul>
        </section>

        <!-- Section 3 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">3. Keamanan Data</h2>
          <div class="flex items-start">
            <span class="inline-flex mr-2 mt-1">
              <UIcon name="i-lucide-lock" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </span>
            <p class="text-base leading-relaxed">
              Kami menggunakan teknologi enkripsi dan praktik terbaik untuk menjaga keamanan data Anda.
            </p>
          </div>
        </section>

        <!-- Section 4 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">4. Hak Anda</h2>
          <div class="flex items-start">
            <span class="inline-flex mr-2 mt-1">
              <UIcon name="i-lucide-user" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </span>
            <p class="text-base leading-relaxed">
              Anda dapat meminta akses, koreksi, atau penghapusan data pribadi Anda kapan saja.
            </p>
          </div>
        </section>

        <!-- Section 5 -->
        <section class="transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-900/20 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 border-l-4 border-green-500 dark:border-green-400 pl-4 mb-3">5. Perubahan Kebijakan</h2>
          <div class="flex items-start">
            <span class="inline-flex mr-2 mt-1">
              <UIcon name="i-lucide-info" class="h-5 w-5 text-green-500 dark:text-green-400" />
            </span>
            <p class="text-base leading-relaxed">
              Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan akan diumumkan di halaman ini.
            </p>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
