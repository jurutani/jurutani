/**
 * News-related type definitions
 * Used by news pages and components
 */

import type { JSONContent } from '@tiptap/vue-3'

// Legacy news types (for old news table)
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

// New types for news_updated table with multi-image and rich content
export interface NewsAttachment {
    name: string
    url: string
    size?: number
    type?: string
}

export interface NewsUpdated {
    id: string
    title: string
    sub_title?: string
    content: JSONContent
    category: string
    link?: string
    status_news: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
    published_at?: string
    deleted_at?: string
    user_id?: string
    cover_image?: string
    images: string[]
    attachments: NewsAttachment[]
    slug: string
}

export interface NewsUpdatedFormState {
    title: string
    sub_title?: string
    content: JSONContent
    category: string
    link?: string
    coverImageFile?: File
    galleryFiles: File[]
    attachmentFiles: File[]
}

export interface NewsUpdatedDisplay extends NewsUpdated {
    author?: {
        id: string
        name?: string
        avatar_url?: string
    }
}
