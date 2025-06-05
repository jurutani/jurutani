import { useSupabase } from '~/composables/useSupabase'
import { useProfile } from '~/composables/useProfile'
import { toastStore } from '~/composables/useJuruTaniToast'

export default defineNuxtRouteMiddleware(async () => {
  const { user, session, initialize } = useSupabase()
  const { fetchUserData, userData } = useProfile()

  // Pastikan session Supabase sudah diinisialisasi
  if (!session.value) {
    await initialize()
  }

  // Jika tidak ada user atau session, arahkan ke login
  if (!user.value || !session.value) {
    toastStore.error('Silakan login untuk mengakses halaman.')
    return navigateTo('/auth/login', { replace: true })
  }

  // Ambil data profil jika belum ada
  if (!userData.value) {
    await fetchUserData()
  }

  // Jika data profil gagal dimuat, arahkan ke login
  if (!userData.value) {
    toastStore.error('Gagal memuat data profil. Silakan coba lagi.')
    return navigateTo('/auth/login', { replace: true })
  }

  // Lolos semua pengecekan, lanjutkan ke halaman
})
