/**
 * Video-related type definitions
 * Used by video pages and components
 */

export interface Video {
    id: string
    title: string
    slug: string
    description: string
    video_url: string
    thumbnail_url: string
    category: string
    duration?: string
    views?: number
    status: string
    created_at: string
    updated_at: string
    deleted_at?: string
}
