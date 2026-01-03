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
    auth: null as string | null,
    session: null as string | null
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
    } catch (err: any) {
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
    } catch (err: any) {
      error.auth = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // FIXED: Register dengan email dan password - improved error handling
  const register = async (email: string, password: string, phone: string, fullName: string) => {
    loading.value = true
    error.auth = null

    try {
      // Validasi input
      if (!email || !password || !phone || !fullName) {
        const errorMsg = 'Semua field harus diisi'
        error.auth = errorMsg
        return { success: false, error: errorMsg }
      }

      // Validasi email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        const errorMsg = 'Format email tidak valid'
        error.auth = errorMsg
        return { success: false, error: errorMsg }
      }

      // Validasi password minimal 8 karakter
      if (password.length < 8) {
        const errorMsg = 'Password minimal 8 karakter'
        error.auth = errorMsg
        return { success: false, error: errorMsg }
      }

      // Validasi phone number (10-13 digit)
      const phoneRegex = /^[0-9]{10,13}$/
      if (!phoneRegex.test(phone.replace(/[\s\-()]/g, ''))) {
        const errorMsg = 'Nomor telepon harus 10-13 digit'
        error.auth = errorMsg
        return { success: false, error: errorMsg }
      }

      // console.log('Starting registration process...')

      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            display_name: fullName.trim()
          }
        }
      })

      // console.log('Registration response:', { data, authError })

      if (authError) {
        // console.error('Registration auth error:', authError)

        // Handle specific error messages
        let errorMessage = authError.message

        if (authError.message.includes('already registered') ||
          authError.message.includes('already been registered') ||
          authError.message.includes('already in use')) {
          errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.'
        } else if (authError.message.includes('invalid email')) {
          errorMessage = 'Format email tidak valid.'
        } else if (authError.message.includes('weak password') ||
          authError.message.includes('Password should be')) {
          errorMessage = 'Kata sandi terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.'
        } else if (authError.message.includes('signup disabled')) {
          errorMessage = 'Pendaftaran akun baru sedang dinonaktifkan. Silakan coba lagi nanti.'
        } else if (authError.message.includes('rate limit')) {
          errorMessage = 'Terlalu banyak percobaan. Silakan tunggu beberapa menit.'
        }

        error.auth = errorMessage
        return { success: false, error: errorMessage }
      }

      // Check if signup was successful
      if (!data.user) {
        const errorMsg = 'Gagal membuat akun. Silakan coba lagi.'
        error.auth = errorMsg
        return { success: false, error: errorMsg }
      }

      // console.log('User created successfully:', data.user.id)

      // Jika signup berhasil tapi user belum confirmed (butuh email verification)
      if (data.user && !data.user.email_confirmed_at) {
        // console.log('User needs email confirmation')
        return {
          success: true,
          data,
          needsConfirmation: true,
          message: 'Akun berhasil dibuat! Silakan cek email Anda untuk mengkonfirmasi akun.'
        }
      }

      // Jika langsung confirmed (misalnya di development)
      // console.log('User registered and confirmed')
      user.value = data.user
      session.value = data.session

      return { success: true, data }

    } catch (err: any) {
      // console.error('Registration error:', err)

      let errorMessage = err.message || 'Terjadi kesalahan saat mendaftar'

      // Handle network errors
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        errorMessage = 'Koneksi bermasalah. Periksa koneksi internet Anda.'
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Koneksi timeout. Silakan coba lagi.'
      }

      error.auth = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Login dengan provider sosial (Google, Facebook, GitHub)
  const loginWithSocialProvider = async (
    provider: 'google' | 'facebook' | 'github'
  ) => {
    loading.value = true
    error.auth = null

    try {
      // Gunakan useRuntimeConfig untuk mendapatkan base URL
      const config = useRuntimeConfig()
      const baseUrl = import.meta.client
        ? window.location.origin
        : config.public.baseUrl || 'http://localhost:3000'

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // Redirect kembali ke aplikasi setelah login
          redirectTo: `${baseUrl}/auth/callback`
        }
      })

      if (authError) {
        error.auth = authError.message
        return { success: false, error: authError.message }
      }

      return { success: true, data }
    } catch (err: any) {
      const message = err?.message || 'Terjadi kesalahan saat login'
      error.auth = message
      return { success: false, error: message }
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
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
      error.auth = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Get user profile
  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // console.error('Error fetching user profile:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err: any) {
      // console.error('Error in getUserProfile:', err)
      return { success: false, error: err.message }
    }
  }

  // Update user profile
  const updateUserProfile = async (userId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        // console.error('Error updating user profile:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err: any) {
      // console.error('Error in updateUserProfile:', err)
      return { success: false, error: err.message }
    }
  }

  // Resend confirmation email
  const resendConfirmation = async (email: string) => {
    loading.value = true
    error.auth = null

    try {
      const { error: authError } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (authError) {
        error.auth = authError.message
        return { success: false, error: authError.message }
      }

      return { success: true, message: 'Email konfirmasi telah dikirim ulang.' }
    } catch (err: any) {
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
    updatePassword,
    getUserProfile,
    updateUserProfile,
    resendConfirmation
  }
}

// Jalankan initialize otomatis saat aplikasi dimuat
export default defineNuxtPlugin(async () => {
  const { initialize } = useSupabase()
  await initialize()
})