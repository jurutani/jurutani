<template>
    <div class="min-h-screen bg-white dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-3xl font-bold text-green-700 dark:text-green-400">Pengaturan Akun</h1>
        <p class="mt-4 text-gray-600 dark:text-gray-300">
          Halo, <span class="font-medium text-black dark:text-white">{{ userEmail }}</span> 👋
        </p>
  
        <div class="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Ganti Password</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Jika kamu merasa akun Juru Tani kamu tidak aman atau lupa password, silakan atur ulang password kamu.
          </p>
          <NuxtLink
            to="/auth/forgot-password"
            class="inline-block bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg transition"
          >
            Atur Ulang Password
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  // Dummy user email
  const dummyUser = ref({
    email: 'juru.tani@example.com'
  })
  
  const userEmail = computed(() => dummyUser.value.email)
  </script>
  