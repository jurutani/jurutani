<!-- pages/auth/confirm-email.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'

// Definisikan layout
definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})

// Get email from query parameter
const route = useRoute()
const email = ref(route.query.email as string || '')

// Composable Supabase untuk resend confirmation
const { resendConfirmation, loading } = useSupabase()

// State untuk countdown timer resend
const canResend = ref(false)
const countdown = ref(0)
let countdownInterval: NodeJS.Timeout | null = null

// Start countdown timer (60 seconds)
const startCountdown = () => {
  canResend.value = false
  countdown.value = 60
  
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      canResend.value = true
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }
  }, 1000)
}

// Handle resend confirmation email
const handleResendConfirmation = async () => {
  if (!email.value) {
    toastStore.error('Email tidak ditemukan. Silakan daftar kembali.', 3000)
    return
  }

  try {
    const result = await resendConfirmation(email.value)
    
    if (result.success) {
      toastStore.success('Email konfirmasi telah dikirim ulang. Silakan cek kotak masuk Anda.', 5000)
      startCountdown()
    } else {
      toastStore.error(result.error || 'Gagal mengirim ulang email konfirmasi.', 3000)
    }
  } catch (err: any) {
    toastStore.error('Terjadi kesalahan. Silakan coba lagi.', 3000)
  }
}

// Cleanup interval on unmount
onBeforeUnmount(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// Start countdown when component mounts
onMounted(() => {
  startCountdown()
  
  // Redirect to register if no email provided
  if (!email.value) {
    toastStore.warning('Silakan daftar terlebih dahulu.', 3000)
    navigateTo('/auth/register')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex items-center justify-center space-x-3 mb-8">
        <TheLogo />
      </div>
      
      <UCard class="shadow-lg border-0">
        <div class="text-center p-6">
          <!-- Icon email -->
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="i-ph:envelope-simple-fill" class="w-8 h-8 text-green-600" />
          </div>
          
          <!-- Title -->
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Periksa Email Anda
          </h2>
          
          <!-- Description -->
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Kami telah mengirimkan link konfirmasi ke email:
          </p>
          
          <!-- Email display -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6">
            <p class="font-medium text-green-600 break-all">
              {{ email }}
            </p>
          </div>
          
          <!-- Instructions -->
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-2">
            <p>• Klik link konfirmasi di email untuk mengaktifkan akun</p>
            <p>• Periksa folder spam/junk jika tidak menemukan email</p>
            <p>• Link akan kedaluwarsa dalam 24 jam</p>
          </div>
          
          <!-- Resend section -->
          <div class="border-t pt-6">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Tidak menerima email?
            </p>
            
            <UButton
              v-if="canResend"
              color="green"
              variant="outline"
              :loading="loading"
              :disabled="loading"
              class="w-full"
              @click="handleResendConfirmation"
            >
              <Icon name="i-ph:paper-plane-tilt" class="w-4 h-4 mr-2" />
              {{ loading ? 'Mengirim...' : 'Kirim Ulang Email' }}
            </UButton>
            
            <UButton
              v-else
              color="gray"
              variant="outline"
              disabled
              class="w-full"
            >
              <Icon name="i-ph:clock" class="w-4 h-4 mr-2" />
              Kirim Ulang dalam {{ countdown }}s
            </UButton>
          </div>
          
          <!-- Back to login -->
          <div class="mt-6 pt-6 border-t">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Sudah konfirmasi email?
            </p>
            <UButton
              variant="link"
              to="/auth/login"
              class="text-green-600 hover:text-green-700 font-medium"
            >
              <Icon name="i-ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali ke Login
            </UButton>
          </div>
        </div>
      </UCard>
      
      <!-- Footer -->
      <div class="text-center text-sm text-gray-400 mt-6">
        <p>&copy; 2025 Juru Tani. Teknologi untuk pertanian Indonesia.</p>
      </div>
    </div>
  </div>
</template>