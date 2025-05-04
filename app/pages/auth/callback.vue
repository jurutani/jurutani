<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'

// Definisikan layout
definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()

onMounted(async () => {
  try {
    // Proses OAuth callback
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error during OAuth callback:', error)
      router.push('/auth/login?error=auth')
      return
    }
    
    if (data.session) {
      // Autentikasi berhasil, redirect ke dashboard
      router.push('/')
    } else {
      // Tidak ada session, kembali ke login
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('Failed to process authentication callback:', error)
    router.push('/auth/login?error=callback')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-2xl font-semibold text-gray-800 mb-2">Memproses autentikasi...</h1>
      <p class="text-gray-600">Mohon tunggu sebentar</p>
      <div class="mt-4">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto animate-spin"/>
      </div>
    </div>
  </div>
</template>