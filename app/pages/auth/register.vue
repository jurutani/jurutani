<!-- pages/auth/register.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'

// Definisikan layout
definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})

// Composable Supabase
const { register, loginWithSocialProvider, error } = useSupabase()

// State form
const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false) // Changed from computed to ref

// Validation functions
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

const validatePassword = (password: string) => {
  return password.length >= 8
}

// Register handler
const handleRegister = async () => {
  // Validate required fields
  if (!form.value.email || !form.value.password || !form.value.confirmPassword) {
    toastStore.warning('Semua field harus diisi.', 3000)
    return
  }

  // Validate email
  if (!validateEmail(form.value.email)) {
    toastStore.warning('Format email tidak valid.', 3000)
    return
  }

  // Validate password strength
  if (!validatePassword(form.value.password)) {
    toastStore.warning('Kata sandi harus minimal 8 karakter.', 3000)
    return
  }

  // Validate password match
  if (form.value.password !== form.value.confirmPassword) {
    toastStore.warning('Kata sandi dan konfirmasi kata sandi tidak cocok.', 3000)
    return
  }

  // Validate terms agreement
  if (!form.value.agreeTerms) {
    toastStore.warning('Anda harus menyetujui syarat dan ketentuan.', 3000)
    return
  }

  try {
    isLoading.value = true // Set loading to true

    console.log('Attempting to register with:', {
      email: form.value.email
    })

    // Call register function - using dummy data for fullName and phone
    const result = await register(
      form.value.email.trim().toLowerCase(), 
      form.value.password,
      '08123456789', // dummy phone
      'User' // dummy fullName
    )

    console.log('Registration result:', result)

    if (result.success) {
      toastStore.success('Pendaftaran berhasil! Silakan periksa email Anda.', 3000)
      
      // Navigate to confirm email page with email parameter
      await navigateTo({
        path: '/auth/confirm-email',
        query: { email: form.value.email }
      })
    } else {
      // Handle specific error cases
      const errorMessage = result.error || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
      toastStore.error(errorMessage, 5000)
    }
  } catch (err: any) {
    console.error('Unexpected error during registration:', err)
    toastStore.error('Terjadi kesalahan tidak terduga. Silakan coba lagi.', 3000)
  } finally {
    isLoading.value = false // Reset loading state
  }
}

// Social login handler
const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
  try {
    isLoading.value = true // Set loading for social login too
    
    const { success, error: loginError } = await loginWithSocialProvider(provider)

    if (!success) {
      toastStore.error(
        loginError || `Login dengan ${provider} gagal.`,
        3000
      )
    }
    // Success handling will be done by the OAuth flow
  } catch (err: any) {
    const message = err?.message || 'Terjadi kesalahan saat login.'
    toastStore.error(message, 3000)
  } finally {
    isLoading.value = false // Reset loading state
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Side image - ilustrasi pertanian modern -->
    <div class="hidden lg:flex lg:w-1/2 bg-green-600 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-800 opacity-90"/>
      
      <!-- Pola abstrak -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 border-8 border-white rounded-full"/>
        <div class="absolute bottom-1/3 right-1/4 w-72 h-72 border-8 border-white rounded-full"/>
        <div class="absolute top-1/2 right-1/3 w-48 h-48 border-8 border-white rounded-full"/>
      </div>
      
      <!-- Info branding -->
      <div class="relative z-10 flex flex-col justify-between h-full p-12 text-white">
        <div>
          <div class="flex items-center space-x-3">
            <TheLogo />
          </div>
          <p class="mt-2 text-green-100">Bergabung untuk masa depan pertanian yang lebih baik</p>
        </div>
        
        <div class="space-y-6">
          <!-- Highlight fitur -->
          <div class="flex items-start space-x-3">
            <Icon name="i-ph:star-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Komunitas Petani</h3>
              <p class="text-sm text-green-100">Terhubung dengan ribuan petani sukses di seluruh Indonesia</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <Icon name="i-ph:leaf-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Teknologi Pertanian</h3>
              <p class="text-sm text-green-100">Akses teknologi terbaru untuk meningkatkan hasil panen</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <Icon name="i-ph:chart-line-up-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Analisis Pertanian</h3>
              <p class="text-sm text-green-100">Pantau perkembangan lahan dengan data analitik yang akurat</p>
            </div>
          </div>
        </div>
        
        <div class="text-sm">
          &copy; 2025 Juru Tani. Teknologi untuk pertanian Indonesia.
        </div>
      </div>
    </div>
    
    <!-- Form register -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="lg:hidden flex items-center justify-center space-x-3 mb-8">
          <TheLogo />
        </div>
        
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Buat Akun Baru</h2>
          <p class="text-gray-500 mt-2">Bergabung dengan platform Juru Tani</p>
        </div>
        
        <UCard class="shadow-sm border-0">
          <form @submit.prevent="handleRegister">
            <UFormGroup label="Email" name="email">
              <UInput
                v-model="form.email"
                type="email"
                placeholder="nama@example.com"
                size="lg"
                :disabled="isLoading"
                :ui="{
                  icon: { trailing: { pointer: '' } },
                  base: 'relative block w-full rounded-lg',
                  input: 'placeholder:text-gray-400 focus:ring-2 focus:ring-green-500'
                }"
              >
                <template #trailing>
                  <Icon name="i-ph:at" class="text-gray-400" />
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="Kata Sandi" name="password" class="mt-4">
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 8 karakter"
                size="lg"
                :disabled="isLoading"
                :ui="{
                  icon: { trailing: { pointer: 'cursor-pointer' } },
                  base: 'relative block w-full rounded-lg',
                  input: 'placeholder:text-gray-400 focus:ring-2 focus:ring-green-500'
                }"
              >
                <template #trailing>
                  <Icon
                    :name="showPassword ? 'i-ph:eye-slash' : 'i-ph:eye'"
                    class="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="Konfirmasi Kata Sandi" name="confirmPassword" class="mt-4">
              <UInput
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Masukkan kembali kata sandi"
                size="lg"
                :disabled="isLoading"
                :ui="{
                  icon: { trailing: { pointer: 'cursor-pointer' } },
                  base: 'relative block w-full rounded-lg',
                  input: 'placeholder:text-gray-400 focus:ring-2 focus:ring-green-500'
                }"
              >
                <template #trailing>
                  <Icon
                    :name="showConfirmPassword ? 'i-ph:eye-slash' : 'i-ph:eye'"
                    class="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <div class="mt-4">
              <UCheckbox 
                v-model="form.agreeTerms" 
                name="agreeTerms" 
                color="green"
                :disabled="isLoading"
                :ui="{ 
                  wrapper: 'items-start',
                  label: 'text-sm text-gray-600 dark:text-gray-300'
                }"
              >
                <template #label>
                  <span>
                    Saya menyetujui 
                    <UButton
                      variant="link"
                      to="/terms"
                      class="text-green-600 hover:text-green-700 p-0 font-medium underline-offset-2"
                    >
                      Syarat & Ketentuan
                    </UButton> 
                    dan 
                    <UButton
                      variant="link"
                      to="/privacy-policy"
                      class="text-green-600 hover:text-green-700 p-0 font-medium underline-offset-2"
                    >
                      Kebijakan Privasi
                    </UButton>
                  </span>
                </template>
              </UCheckbox>
            </div>

            <div class="mt-6">
              <UButton
                type="submit"
                block
                color="green"
                :loading="isLoading"
                :disabled="isLoading"
                :ui="{
                  base: 'rounded-lg p-4 font-medium text-base',
                  color: {
                    green: {
                      solid: 'bg-green-600 hover:bg-green-700 focus:ring-green-300 text-white'
                    }
                  }
                }"
              >
                <template #leading>
                  <Icon v-if="!isLoading" name="i-ph:user-plus" class="w-5 h-5" />
                </template>
                {{ isLoading ? 'Mendaftar...' : 'Daftar Sekarang' }}
              </UButton>
            </div>
          </form>

          <!-- Social Login Section -->
          <div class="relative flex items-center justify-center gap-3 my-6">
            <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700"/>
            <span class="text-sm text-gray-400">atau</span>
            <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700"/>
          </div>

          <div class="grid grid-cols-1 place-items-center gap-3">
            <UButton
              color="white"
              variant="outline"
              :ui="{ 
                base: 'rounded-lg p-2', 
                color: {
                  white: {
                    solid: 'bg-white hover:bg-gray-50'
                  }
                }
              }"
              :disabled="isLoading"
              :loading="isLoading"
              @click="handleSocialLogin('google')"
            >
              <Icon v-if="!isLoading" name="logos:google-icon" class="mr-2 h-5 w-5" />
              Google
            </UButton>
          </div>
        </UCard>
        
        <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Sudah punya akun?
          <UButton variant="link" to="/auth/login" class="text-green-600 hover:text-green-700 font-medium">
            Masuk sekarang
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>