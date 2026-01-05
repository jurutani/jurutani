/**
 * News-related type definitions
 * Used by news pages and components
 */

export interface News {
    id: string
    title: string
    slug: string
    content: string
    description: string
    image_url: string
    category: string
    status: string
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface NewsItem {
    id: string
    title: string
    slug: string
    content: string
    description: string
    image_url: string
    category: string
    status: string
    sub_title?: string
    link?: string
    attachment_url?: string
    author?: string
    user_id?: string
    published_at?: string
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface NewsFormState {
    title: string
    slug: string
    content: string
    description: string
    image_url: string
    category: string
    status: string
}
