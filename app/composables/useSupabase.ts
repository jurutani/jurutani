import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  const supabase = createClient(supabaseUrl, supabaseKey)

  // State untuk user
  const user = ref(null)
  const session = ref(null)
  const loading = ref(true)
  
  // Error state
  const error = reactive({
    auth: null,
    session: null
  })
  
  // Inisialisasi - check session
  const initialize = async () => {
    loading.value = true
    
    try {
      // Cek session yang sudah ada
      const { data, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        error.session = sessionError.message
      } else {
        session.value = data.session
        
        if (data.session) {
          // Ambil data user jika session ada
          const { data: userData, error: userError } = await supabase.auth.getUser()
          
          if (userError) {
            error.auth = userError.message
          } else {
            user.value = userData.user
          }
        }
      }
    } catch (err) {
      error.auth = err.message
    } finally {
      loading.value = false
    }
    
    // Setup auth state listener
    supabase.auth.onAuthStateChange((event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user || null
    })
  }
  
  // Login dengan email dan password
  const login = async (email: string, password: string) => {
    loading.value = true
    error.auth = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (authError) {
        error.auth = authError.message
        return { success: false, error: authError.message }
      }
      
      user.value = data.user
      session.value = data.session
      return { success: true, data }
    } catch (err) {
      error.auth = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Register dengan email dan password
  const register = async (email: string, password: string, metadata = {}) => {
    loading.value = true
    error.auth = null
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      
      if (authError) {
        error.auth = authError.message
        return { success: false, error: authError.message }
      }
      
      return { success: true, data }
    } catch (err) {
      error.auth = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Login dengan provider social (Google, Facebook, dll)
  const loginWithSocialProvider = async (provider: 'google' | 'facebook' | 'github') => {
    loading.value = true
    error.auth = null
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (authError) {
        error.auth = authError.message
        return { success: false, error: authError.message }
      }
      
      return { success: true, data }
    } catch (err) {
      error.auth = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Logout
  const logout = async () => {
    loading.value = true
    error.auth = null
    
    try {
      const { error: authError } = await supabase.auth.signOut()
      
      if (authError) {
        error.auth = authError.message
        return { success: false, error: authError.message }
      }
      
      user.value = null
      session.value = null
      return { success: true }
    } catch (err) {
      error.auth = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Reset password
  const resetPassword = async (email: string) => {
    loading.value = true
    error.auth = null
    
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (authError) {
        error.auth = authError.message
        return { success: false, error: authError.message }
      }
      
      return { success: true }
    } catch (err) {
      error.auth = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Update password
  const updatePassword = async (newPassword: string) => {
    loading.value = true
    error.auth = null
    
    try {
      const { error: authError } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (authError) {
        error.auth = authError.message
        return { success: false, error: authError.message }
      }
      
      return { success: true }
    } catch (err) {
      error.auth = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  return {
    supabase,
    user,
    session,
    loading,
    error,
    initialize,
    login,
    register,
    loginWithSocialProvider,
    logout,
    resetPassword,
    updatePassword
  }
}

// Jalankan initialize otomatis saat aplikasi dimuat
export default defineNuxtPlugin(async () => {
  const { initialize } = useSupabase()
  await initialize()
})