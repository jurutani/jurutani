<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'
import { toastStore } from '~/composables/useJuruTaniToast'

// Gunakan layout blank tanpa header/footer
definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()
const isProcessing = ref(true)
const statusMessage = ref('Memproses autentikasi...')

onMounted(async () => {
  try {
    statusMessage.value = 'Memverifikasi sesi...'
    
    // Handle auth code exchange untuk OAuth
    const { data, error } = await supabase.auth.exchangeCodeForSession(
      window.location.href
    )

    if (error) {
      console.error('OAuth callback error:', error.message)
      
      // Handle berbagai jenis error
      if (error.message.includes('Invalid code') || error.message.includes('expired')) {
        toastStore.error('Kode autentikasi tidak valid atau sudah kadaluarsa. Silakan coba lagi.', 5000)
        return router.push('/auth/login?error=invalid_code')
      } else if (error.message.includes('already_registered')) {
        toastStore.error('Email sudah terdaftar. Silakan masuk dengan akun yang sudah ada.', 5000)
        return router.push('/auth/login?error=already_registered')
      } else {
        toastStore.error('Terjadi kesalahan saat autentikasi. Silakan coba lagi.', 5000)
        return router.push('/auth/login?error=auth_failed')
      }
    }

    if (data?.session?.user) {
      statusMessage.value = 'Autentikasi berhasil! Mengalihkan...'
      
      // Berikan feedback sukses
      toastStore.success('Berhasil masuk! Selamat datang.', 3000)
      
      // Cek apakah ini user baru atau existing user
      const isNewUser = data.session.user.created_at === data.session.user.last_sign_in_at
      
      if (isNewUser) {
        // User baru, redirect ke halaman onboarding atau profile setup
        return router.push('/onboarding?welcome=true')
      } else {
        // User existing, redirect ke dashboard atau halaman utama
        return router.push('/?welcome_back=true')
      }
    } else {
      // Tidak ada sesi ditemukan, coba cek session yang ada
      statusMessage.value = 'Memeriksa sesi yang ada...'
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError.message)
        toastStore.error('Gagal mendapatkan sesi. Silakan masuk kembali.', 5000)
        return router.push('/auth/login?error=session_error')
      }
      
      if (sessionData?.session) {
        toastStore.success('Berhasil masuk! Selamat datang kembali.', 3000)
        return router.push('/')
      } else {
        toastStore.warning('Sesi tidak ditemukan. Silakan masuk kembali.', 5000)
        return router.push('/auth/login?error=no_session')
      }
    }
  } catch (err: any) {
    console.error('Unexpected error during callback:', err?.message || err)
    statusMessage.value = 'Terjadi kesalahan...'
    toastStore.error('Terjadi kesalahan tidak terduga. Silakan coba lagi.', 5000)
    
    // Delay sebentar sebelum redirect untuk user experience
    setTimeout(() => {
      router.push('/auth/login?error=unexpected')
    }, 2000)
  } finally {
    isProcessing.value = false
  }
})

// Handle jika user menekan tombol kembali
const handleBackToLogin = () => {
  router.push('/auth/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
    <div class="text-center max-w-md mx-auto p-8">
      <div class="mb-6">
        <!-- Logo atau icon aplikasi -->
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <h1 class="text-2xl font-semibold text-gray-800 mb-2">
          {{ statusMessage }}
        </h1>
        <p class="text-gray-600">Mohon tunggu sebentar</p>
      </div>

      <!-- Loading Spinner -->
      <div v-if="isProcessing" class="mb-6">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto animate-spin" />
      </div>

      <!-- Error State dengan tombol kembali -->
      <div v-else class="space-y-4">
        <div class="text-red-500 mb-4">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        
        <button 
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          @click="handleBackToLogin"
        >
          Kembali ke Halaman Login
        </button>
      </div>

      <!-- Progress indicator -->
      <div class="mt-8">
        <div class="flex justify-center space-x-2">
          <div class="w-2 h-2 bg-primary rounded-full animate-pulse"/>
          <div class="w-2 h-2 bg-primary rounded-full animate-pulse" style="animation-delay: 0.2s"/>
          <div class="w-2 h-2 bg-primary rounded-full animate-pulse" style="animation-delay: 0.4s"/>
        </div>
      </div>
    </div>
  </div>
</template>