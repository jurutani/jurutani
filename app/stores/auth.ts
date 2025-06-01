import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const supabase = useNuxtApp().$supabase as import('@supabase/supabase-js').SupabaseClient

  async function fetchUser() {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
  }

  async function login(email: string, password: string) {
    loading.value = true
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    user.value = data.user
    loading.value = false
  }

  async function register(email: string, password: string) {
    loading.value = true
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    user.value = data.user
    loading.value = false
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return {
    user,
    loading,
    fetchUser,
    login,
    register,
    logout,
  }
})
