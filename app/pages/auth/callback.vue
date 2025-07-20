<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { toastStore } from '~/composables/useJuruTaniToast'

// Define layout
definePageMeta({
  layout: 'default',
  middleware: ['guest']
})

const { supabase } = useSupabase()
const route = useRoute()

// State
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    if (import.meta.client) {
      const authCode = route.query.code as string

      if (!authCode) {
        error.value = 'Kode otorisasi tidak ditemukan.'
        toastStore.error('Login gagal: kode otorisasi tidak ditemukan.', 5000)
        await navigateTo('/auth/login?error=missing_code')
        return
      }

      const { data, error: authError } = await supabase.auth.exchangeCodeForSession(authCode)

      if (authError) {
        console.error('OAuth callback error:', authError)
        error.value = authError.message
        toastStore.error('Login gagal: ' + authError.message, 5000)
        await navigateTo('/auth/login?error=oauth_failed')
        return
      }

      if (data.session) {
        toastStore.success('Login berhasil! Selamat datang.', 3000)
        const redirectTo = route.query.redirect_to as string || '/welcome'
        await navigateTo(redirectTo)
      } else {
        toastStore.warning('Sesi login tidak ditemukan. Silakan coba lagi.', 3000)
        await navigateTo('/auth/login')
      }
    }
  } catch (err: any) {
    console.error('Unexpected error in auth callback:', err)
    error.value = err.message || 'Error tidak diketahui'
    toastStore.error('Terjadi kesalahan: ' + (err.message || 'Error tidak diketahui'), 5000)
    await navigateTo('/auth/login?error=callback_failed')
  } finally {
    loading.value = false
  }
})
</script>


<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <!-- Logo -->
        <div class="flex items-center justify-center space-x-3 mb-8">
          <TheLogo />
        </div>
        
        <div v-if="loading" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"/>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Memproses Login...
          </h2>
          <p class="text-gray-500 dark:text-gray-400">
            Mohon tunggu sebentar
          </p>
        </div>
        
        <div v-else-if="error" class="space-y-4">
          <div class="rounded-full h-12 w-12 bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto">
            <UIcon name="i-ph-x-circle" class="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Login Gagal
          </h2>
          <p class="text-red-600 dark:text-red-400">
            {{ error }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Anda akan diarahkan kembali ke halaman login...
          </p>
        </div>
        
        <div v-else class="space-y-4">
          <div class="rounded-full h-12 w-12 bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
            <UIcon name="i-ph-check-circle" class="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Login Berhasil
          </h2>
          <p class="text-gray-500 dark:text-gray-400">
            Mengalihkan ke JuruTani...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>