<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { toastStore } from '~/composables/useJuruTaniToast'

definePageMeta({
  layout: 'default',
  middleware: ['guest']
})

const { supabase } = useSupabase()
const route = useRoute()

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    if (import.meta.client) {
      const authCode = route.query.code as string

      if (!authCode) {
        toastStore.error('Login gagal: kode otorisasi tidak ditemukan.', 5000)
        await navigateTo('/auth/login?error=missing_code')
        return
      }

      const { data, error: authError } = await supabase.auth.exchangeCodeForSession(authCode)

      if (authError) {
        console.error('OAuth callback error:', authError)
        toastStore.error('Login gagal: ' + authError.message, 5000)
        await navigateTo('/auth/login?error=oauth_failed')
        return
      }

      if (data.session) {
        toastStore.success('Login berhasil! Mengarahkan...', 1500)

        // Tunggu sedikit biar toast sempat tampil
        setTimeout(() => {
          // Force redirect full 
          loading.value = false
          navigateTo('/', { external: true })
        }, 1500)
      } else {
        toastStore.warning('Sesi login tidak ditemukan. Silakan coba lagi.', 3000)
        await navigateTo('/auth/login')
      }
    }
  } catch (err: any) {
    console.error('Unexpected error in auth callback:', err)
    toastStore.error('Terjadi kesalahan: ' + (err.message || 'Error tidak diketahui'), 5000)
    await navigateTo('/auth/login?error=callback_failed')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Tidak render UI apapun -->
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">

        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Memproses Login...</h2>
        <p class="text-gray-500 dark:text-gray-400">Mohon tunggu sebentar</p>
      </div>
    </div>
  </div>
</template>
