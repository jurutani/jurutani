<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '#imports'
import { useSupabase } from '~/composables/useSupabase'

// Definisikan layout
definePageMeta({
  layout: 'blank'
})

const toast = useToast()
const { updatePassword } = useSupabase()

// State form
const form = ref({
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const isCompleted = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Handler update password
const handleUpdatePassword = async () => {
  // Validasi password
  if (!form.value.password) {
    toast.add({
      title: 'Peringatan',
      description: 'Password baru harus diisi.',
      color: 'orange',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  if (form.value.password.length < 6) {
    toast.add({
      title: 'Peringatan',
      description: 'Password harus minimal 6 karakter.',
      color: 'orange',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    toast.add({
      title: 'Peringatan',
      description: 'Konfirmasi password tidak sama.',
      color: 'orange',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  try {
    isLoading.value = true
    
    // Panggil fungsi updatePassword dari useSupabase composable
    const { success, error } = await updatePassword(form.value.password)

    if (success) {
      isCompleted.value = true
      toast.add({
        title: 'Berhasil',
        description: 'Password berhasil diperbarui.',
        color: 'green',
        icon: 'i-ph-check-circle',
        timeout: 3000
      })
    } else {
      toast.add({
        title: 'Gagal',
        description: error || 'Gagal memperbarui password.',
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
      <div v-if="!isCompleted" class="space-y-6">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-800">Reset Password</h1>
          <p class="text-gray-600 mt-2">Masukkan password baru Anda</p>
        </div>
        
        <form class="space-y-4" @submit.prevent="handleUpdatePassword">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 6 karakter"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                :disabled="isLoading"
                required
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 px-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <span v-if="showPassword" class="i-ph-eye-slash text-gray-500"/>
                <span v-else class="i-ph-eye text-gray-500"/>
              </button>
            </div>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Masukkan kembali password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                :disabled="isLoading"
                required
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 px-3 flex items-center"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <span v-if="showConfirmPassword" class="i-ph-eye-slash text-gray-500"/>
                <span v-else class="i-ph-eye text-gray-500"/>
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            class="w-full py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Memproses...</span>
            <span v-else>Update Password</span>
          </button>
        </form>
      </div>
      
      <div v-else class="text-center space-y-4">
        <div class="text-green-500 text-5xl mb-4">
          <span class="i-ph-check-circle-fill"/>
        </div>
        <h2 class="text-xl font-bold text-gray-800">Password Diperbarui!</h2>
        <p class="text-gray-600">
          Password Anda telah berhasil diperbarui. Anda sekarang dapat login dengan password baru.
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/auth/login"
            class="inline-block py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Login Sekarang
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>