<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '#imports'
import { useSupabase } from '~/composables/useSupabase'

// Definisikan layout
definePageMeta({
  layout: 'blank'
})

const toast = useToast()
const { resetPassword } = useSupabase()

// State form
const email = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)

// Handler reset password
const handleResetPassword = async () => {
  if (!email.value) {
    toast.add({
      title: 'Peringatan',
      description: 'Email harus diisi.',
      color: 'green',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  try {
    isLoading.value = true
    
    // Panggil fungsi resetPassword dari useSupabase composable
    const { success, error } = await resetPassword(email.value)

    if (success) {
      isSubmitted.value = true
      toast.add({
        title: 'Berhasil',
        description: 'Instruksi reset password telah dikirim ke email Anda.',
        color: 'green',
        icon: 'i-ph-check-circle',
        timeout: 5000
      })
    } else {
      toast.add({
        title: 'Gagal',
        description: error || 'Gagal mengirim email reset password.',
        color: 'red',
        icon: 'i-ph-x-circle',
        timeout: 3000
      })
    }
  } catch (error) {
    toast.add({
      title: 'Gagal',
      description: error.message || 'Terjadi kesalahan saat memproses permintaan.',
      color: 'red',
      icon: 'i-ph-x-circle',
      timeout: 3000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-green-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5 dark:opacity-10">
      <div class="absolute top-10 left-10 w-32 h-32 border-2 border-green-300 dark:border-green-600 rotate-45"/>
      <div class="absolute top-40 right-20 w-24 h-24 border-2 border-green-300 dark:border-green-600 rotate-12"/>
      <div class="absolute bottom-20 left-20 w-28 h-28 border-2 border-yellow-300 dark:border-yellow-600 -rotate-12"/>
      <div class="absolute bottom-40 right-10 w-20 h-20 border-2 border-green-300 dark:border-green-600 rotate-45"/>
    </div>

    <div class="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-100 dark:border-gray-700 p-8 w-full max-w-md">
      <!-- Engineering Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-600 dark:from-green-400 dark:to-green-400 bg-clip-text text-transparent">
          Reset Password
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm">
          Portal Teknik Sipil
        </p>
      </div>

      <!-- Form Reset Password -->
      <div v-if="!isSubmitted">
        <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg">
          <p class="text-blue-700 dark:text-blue-300 text-sm">
            Masukkan email terdaftar untuk menerima tautan reset password
          </p>
        </div>
        
        <form class="space-y-6" @submit.prevent="handleResetPassword">
          <div class="space-y-2">
            <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="engineer@example.com"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300"
                :disabled="isLoading"
                required
              >
            </div>
          </div>
          
          <button
            type="submit"
            class="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Mengirim...
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Kirim Reset Link
            </span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <NuxtLink 
            to="/auth/login" 
            class="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors duration-300"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali ke Login
          </NuxtLink>
        </div>
      </div>
      
      <!-- Success State -->
      <div v-else class="text-center space-y-6">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-full mb-4 shadow-lg">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Email Berhasil Dikirim!
          </h2>
          <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Kami telah mengirimkan instruksi reset password ke
            <span class="font-semibold text-green-600 dark:text-green-400">{{ email }}</span>
          </p>
        </div>

        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p class="text-yellow-700 dark:text-yellow-300 text-sm">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Periksa folder spam jika email tidak ditemukan di kotak masuk
          </p>
        </div>
        
        <NuxtLink
          to="/auth/login"
          class="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
          </svg>
          Kembali ke Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>