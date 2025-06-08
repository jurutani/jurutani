import { useSupabase } from '~/composables/useSupabase'
import { useProfile } from '~/composables/useProfile'
import { toastStore } from '~/composables/useJuruTaniToast'

export default defineNuxtRouteMiddleware(async () => {
  const { user, session, initialize } = useSupabase()
  const { fetchUserData, userData } = useProfile()

  // Inisialisasi Supabase session
  if (!session.value) {
    await initialize()
  }

  // Jika user sudah login
  if (user.value && session.value) {
    // Ambil data profil jika belum ada
    if (!userData.value) {
      await fetchUserData()
    }

    toastStore.info('Kamu sudah login.')
    return navigateTo('/', { replace: true })
  }

  // Jika belum login, biarkan akses ke halaman guest
})
