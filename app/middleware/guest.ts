import { useAuth } from '~/composables/useAuth'
import { useUserProfile } from '~/composables/useUserProfile'
import { toastStore } from '~/composables/useJuruTaniToast'

export default defineNuxtRouteMiddleware(async () => {
  const { user, session, initialize } = useAuth()
  const { fetchProfile, profileData } = useUserProfile()

  // Inisialisasi auth session
  if (!session.value) {
    await initialize()
  }

  // Jika user sudah login
  if (user.value && session.value) {
    // Ambil data profil jika belum ada
    if (!profileData.value) {
      await fetchProfile()
    }

    return navigateTo('/', { replace: true })
  }

  // Jika belum login, biarkan akses ke halaman guest
})
