<template>
  <div class="flex flex-col items-center justify-center h-screen text-center px-6 bg-gradient-to-br from-green-50 via-emerald-100 to-lime-50">
    <TheLogo class="mb-4 -translate-x-4" />
    <slot name="image" />
    <h1 class="text-4xl font-extrabold text-emerald-800 mb-2">Selamat Datang di Juru Tani!</h1>
    <p class="text-lg text-gray-700 mb-6">Terima kasih telah mengunjungi website kami.</p>
    <NuxtLink
      to="/"
      class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200"
    >
      Masuk ke Beranda
    </NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'blank'
})
</script>
