/**
 * User-related type definitions
 * Used by useUserProfile composable
 */

export interface UserProfile {
    id: string
    email?: string
    full_name?: string
    avatar_url?: string
    phone?: string
    role?: 'admin' | 'expert' | 'farmer' | 'user'
    bio?: string
    location?: string
    created_at?: string
    updated_at?: string
}
