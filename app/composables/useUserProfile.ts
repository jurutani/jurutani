import type { User } from '@supabase/supabase-js'
import { useSupabase } from './useSupabase'
import { useAuth } from './useAuth'
import type { UserProfile } from '~/types/user'

export type { UserProfile }

/**
 * Composable untuk mengelola user profile dari public.profiles
 * Mengambil data dari database dan menyediakan computed properties
 */
export const useUserProfile = () => {
    const { supabase } = useSupabase()
    const { user } = useAuth()

    const profileData = useState<UserProfile | null>('user-profile-data', () => null)
    const loading = useState<boolean>('user-profile-loading', () => false)
    const error = useState<string | null>('user-profile-error', () => null)

    const avatarCacheKey = ref(Math.floor(Date.now() / (5 * 60 * 1000)))

    const fetchProfile = async (userId?: string) => {
        const targetUserId = userId || user.value?.id

        if (!targetUserId) {
            error.value = 'User ID tidak ditemukan'
            return { success: false, error: error.value }
        }

        loading.value = true
        error.value = null

        try {
            const { data, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', targetUserId)
                .single()

            if (profileError) {
                console.error('Error fetching profile:', profileError)
                error.value = profileError.message
                return { success: false, error: profileError.message }
            }

            profileData.value = data
            return { success: true, data }
        } catch (err: any) {
            console.error('Error in fetchProfile:', err)
            error.value = err.message
            return { success: false, error: err.message }
        } finally {
            loading.value = false
        }
    }

    /**
     * Update user profile di database
     */
    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user.value?.id) {
            error.value = 'User tidak terautentikasi'
            return { success: false, error: error.value }
        }

        loading.value = true
        error.value = null

        try {
            const { data, error: updateError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.value.id)
                .select()
                .single()

            if (updateError) {
                console.error('Error updating profile:', updateError)
                error.value = updateError.message
                return { success: false, error: updateError.message }
            }

            profileData.value = data
            return { success: true, data }
        } catch (err: any) {
            console.error('Error in updateProfile:', err)
            error.value = err.message
            return { success: false, error: err.message }
        } finally {
            loading.value = false
        }
    }

    /**
     * Upload avatar ke Supabase Storage
     */
    const uploadAvatar = async (file: File) => {
        if (!user.value?.id) {
            error.value = 'User tidak terautentikasi'
            return { success: false, error: error.value }
        }

        loading.value = true
        error.value = null

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.value.id}-${Date.now()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            // Upload file
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    upsert: true
                })

            if (uploadError) {
                console.error('Error uploading avatar:', uploadError)
                error.value = uploadError.message
                return { success: false, error: uploadError.message }
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update profile dengan avatar URL baru
            const updateResult = await updateProfile({ avatar_url: publicUrl })

            if (!updateResult.success) {
                return updateResult
            }

            // Refresh avatar cache
            refreshAvatarCache()

            return { success: true, data: { avatar_url: publicUrl } }
        } catch (err: any) {
            console.error('Error in uploadAvatar:', err)
            error.value = err.message
            return { success: false, error: err.message }
        } finally {
            loading.value = false
        }
    }

    /**
     * Computed profile dengan fallback values
     */
    const profile = computed(() => {
        if (!user.value && !profileData.value) return null

        // Combine auth user data dengan profile data
        return {
            id: user.value?.id || profileData.value?.id || '',
            email: user.value?.email || profileData.value?.email || '',
            displayName: profileData.value?.full_name ||
                user.value?.user_metadata?.full_name ||
                user.value?.email?.split('@')[0] ||
                'User',
            fullName: profileData.value?.full_name || user.value?.user_metadata?.full_name || '',
            avatar: profileData.value?.avatar_url || user.value?.user_metadata?.avatar_url || '/profile.png',
            phone: profileData.value?.phone || user.value?.user_metadata?.phone || '',
            role: profileData.value?.role || 'user',
            bio: profileData.value?.bio || '',
            location: profileData.value?.location || '',
            createdAt: profileData.value?.created_at || '',
            updatedAt: profileData.value?.updated_at || '',
            isAuthenticated: !!user.value,
        }
    })

    /**
     * Avatar URL dengan cache busting
     */
    const avatarUrl = computed(() => {
        if (!profile.value?.avatar) return '/profile.png'

        // Hanya tambahkan cache key jika bukan default avatar
        if (profile.value.avatar === '/profile.png') {
            return profile.value.avatar
        }

        return profile.value.avatar.includes('?')
            ? profile.value.avatar
            : `${profile.value.avatar}?v=${avatarCacheKey.value}`
    })

    /**
     * Check authentication status
     */
    const isAuthenticated = computed(() => !!user.value)

    /**
     * User initials untuk avatar fallback
     */
    const initials = computed(() => {
        if (!profile.value?.displayName) return 'U'

        return profile.value.displayName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    })

    /**
     * Format role untuk display
     */
    const roleLabel = computed(() => {
        const roleLabels: Record<string, string> = {
            admin: 'Administrator',
            expert: 'Ahli Pertanian',
            farmer: 'Petani',
            user: 'Pengguna'
        }
        return roleLabels[profile.value?.role || 'user'] || 'Pengguna'
    })

    /**
     * Refresh avatar cache (panggil setelah upload avatar baru)
     */
    const refreshAvatarCache = () => {
        avatarCacheKey.value = Math.floor(Date.now() / (5 * 60 * 1000))
    }

    /**
     * Format date untuk display
     */
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        } catch {
            return '-'
        }
    }

    return {
        // State
        profileData: readonly(profileData),
        loading: readonly(loading),
        error: readonly(error),

        // Computed
        profile,
        avatarUrl,
        isAuthenticated,
        initials,
        roleLabel,

        // Methods
        fetchProfile,
        updateProfile,
        uploadAvatar,
        refreshAvatarCache,
        formatDate
    }
}
