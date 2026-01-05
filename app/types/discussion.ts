/**
 * Discussion-related type definitions
 * Used by discussion pages and components
 */

export interface Expert {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    bio?: string
    specialization?: string
    phone?: string
    location?: string
    role: string
    created_at: string
    updated_at: string
}

export interface Instructor {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    bio?: string
    specialization?: string
    phone?: string
    location?: string
    district?: string
    role: string
    created_at: string
    updated_at: string
}

export interface District {
    id: string
    name: string
    province?: string
}
