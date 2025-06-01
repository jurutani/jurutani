export const useAuth = () => {
  const auth = useAuthStore()
  const router = useRouter()
  const { $supabase } = useNuxtApp()

  const login = async (email: string, password: string) => {
    const { error } = await $supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await auth.fetchUser()
    if (auth.user?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  const register = async (email: string, password: string, name: string) => {
    const { data, error } = await $supabase.auth.signUp({ email, password })
    if (error) throw error

    await $supabase.from('users').insert({
      id: data.user?.id,
      name,
      role: 'user' // default
    })

    await auth.fetchUser()
    router.push('/dashboard')
  }

  const logout = async () => {
    await auth.logout()
    router.push('/')
  }

  return { login, register, logout }
}
