import { useAuth } from '~/composables/useAuth'
import { useUserProfile } from '~/composables/useUserProfile'
import { toastStore } from '~/composables/useJuruTaniToast'

/**
 * Auth Middleware
 * Proteksi route yang memerlukan authentication
 * Menggunakan useAuth untuk check auth status dan useUserProfile untuk fetch profile
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { user, session, initialize, isAuthenticated } = useAuth()
  const { fetchProfile, profileData } = useUserProfile()

  // Pastikan auth sudah diinisialisasi
  if (!user.value) {
    await initialize()
  }

  // Jika tidak authenticated, redirect ke login dengan query redirect
  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/auth/login',
      query: {
        redirect: to.fullPath // Simpan URL tujuan untuk redirect setelah login
      }
    })
  }

  // Ambil data profil jika belum ada (optional - untuk halaman yang butuh profile data)
  if (!profileData.value) {
    await fetchProfile()
  }

  // Lolos semua pengecekan, lanjutkan ke halaman
})
