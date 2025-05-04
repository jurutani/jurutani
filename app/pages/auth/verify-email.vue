<script setup lang="ts">
// Definisikan layout
definePageMeta({
  layout: 'blank'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <span class="i-ph-envelope-simple text-5xl text-green-500"></span>
        </div>
      </div>
      
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Verifikasi Email Anda</h1>
      
      <p class="text-gray-600 mb-6">
        Kami telah mengirimkan email verifikasi ke alamat email yang Anda daftarkan. Silakan periksa kotak masuk Anda dan klik tautan verifikasi untuk mengaktifkan akun Anda.
      </p>
      
      <div class="bg-blue-50 p-4 rounded-md mb-6">
        <p class="text-blue-700 text-sm">
          <span class="i-ph-info-bold mr-2"></span>
          Jika Anda tidak melihat email dalam beberapa menit, periksa folder spam atau sampah.
        </p>
      </div>
      
      <div class="space-y-4">
        <NuxtLink
          to="/auth/login"
          class="block w-full py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Kembali ke Login
        </NuxtLink>
        
        <div class="text-gray-500 text-sm">
          Sudah memverifikasi? <NuxtLink to="/auth/login" class="text-primary hover:text-primary-dark">Login sekarang</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>