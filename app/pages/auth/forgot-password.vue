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
      color: 'orange',
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
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div v-if="!isSubmitted" class="space-y-6">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-800">Lupa Password</h1>
          <p class="text-gray-600 mt-2">Masukkan email Anda untuk menerima tautan reset password</p>
        </div>
        
        <form class="space-y-4" @submit.prevent="handleResetPassword">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="nama@email.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              :disabled="isLoading"
              required
            >
          </div>
          
          <button
            type="submit"
            class="w-full py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Memproses...</span>
            <span v-else>Kirim Link Reset Password</span>
          </button>
        </form>
        
        <div class="text-center">
          <NuxtLink to="/auth/login" class="text-primary hover:text-primary-dark text-sm">
            Kembali ke halaman login
          </NuxtLink>
        </div>
      </div>
      
      <div v-else class="text-center space-y-4">
        <div class="text-green-500 text-5xl mb-4">
          <span class="i-ph-check-circle-fill"/>
        </div>
        <h2 class="text-xl font-bold text-gray-800">Email Terkirim!</h2>
        <p class="text-gray-600">
          Kami telah mengirimkan tautan reset password ke email {{ email }}. Silakan periksa kotak masuk Anda.
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/auth/login"
            class="inline-block py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Kembali ke Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>