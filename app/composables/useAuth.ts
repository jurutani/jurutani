import type { User, Session } from '@supabase/supabase-js'
import { useSupabase } from './useSupabase'

/**
 * Composable untuk mengelola authentication
 * Menangani login, register, logout, dan auth state management
 */

export const useAuth = () => {
    const { supabase } = useSupabase()

    // State untuk user dan session
    const user = useState<User | null>('auth-user', () => null)
    const session = useState<Session | null>('auth-session', () => null)
    const loading = useState<boolean>('auth-loading', () => true)

    // Error state
    const error = reactive({
        auth: null as string | null,
        session: null as string | null
    })

    /**
     * Inisialisasi auth - check session dan setup listener
     */
    const initialize = async () => {
        loading.value = true

        try {
            // Cek session yang sudah ada
            const { data, error: sessionError } = await supabase.auth.getSession()

            if (sessionError) {
                error.session = sessionError.message
                console.error('Session error:', sessionError)
            } else {
                session.value = data.session

                if (data.session) {
                    // Ambil data user jika session ada
                    const { data: userData, error: userError } = await supabase.auth.getUser()

                    if (userError) {
                        error.auth = userError.message
                        console.error('User error:', userError)
                    } else {
                        user.value = userData.user
                    }
                }
            }
        } catch (err: any) {
            error.auth = err.message
            console.error('Initialize error:', err)
        } finally {
            loading.value = false
        }

        // Setup auth state listener
        supabase.auth.onAuthStateChange((event, currentSession) => {
            session.value = currentSession
            user.value = currentSession?.user || null
        })
    }

    /**
     * Login dengan email dan password
     */
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

    /**
     * Register user baru dengan validasi lengkap
     */
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

            console.log('Starting registration process...')

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

            console.log('Registration response:', { data, authError })

            if (authError) {
                console.error('Registration auth error:', authError)

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

            console.log('User created successfully:', data.user.id)

            // Jika signup berhasil tapi user belum confirmed (butuh email verification)
            if (data.user && !data.user.email_confirmed_at) {
                console.log('User needs email confirmation')
                return {
                    success: true,
                    data,
                    needsConfirmation: true,
                    message: 'Akun berhasil dibuat! Silakan cek email Anda untuk mengkonfirmasi akun.'
                }
            }

            // Jika langsung confirmed (misalnya di development)
            console.log('User registered and confirmed')
            user.value = data.user
            session.value = data.session

            return { success: true, data }

        } catch (err: any) {
            console.error('Registration error:', err)

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

    /**
     * Login dengan provider sosial (Google, Facebook, GitHub)
     */
    const loginWithSocialProvider = async (
        provider: 'google' | 'facebook' | 'github'
    ) => {
        loading.value = true
        error.auth = null

        try {
            const config = useRuntimeConfig()
            const baseUrl = import.meta.client
                ? window.location.origin
                : config.public.baseUrl || 'http://localhost:3000'

            const { data, error: authError } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
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

    /**
     * Logout user
     */
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

    /**
     * Reset password - kirim email reset
     */
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

    /**
     * Update password user
     */
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

    /**
     * Resend confirmation email
     */
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

    /**
     * Check apakah user sudah login
     */
    const isAuthenticated = computed(() => !!user.value)

    return {
        // State
        user: readonly(user),
        session: readonly(session),
        loading: readonly(loading),
        error: readonly(error),
        isAuthenticated,

        // Methods
        initialize,
        login,
        register,
        loginWithSocialProvider,
        logout,
        resetPassword,
        updatePassword,
        resendConfirmation
    }
}
