/**
 * Education/Course-related type definitions
 * Used by education pages and components
 */

export interface Course {
    id: string
    title: string
    slug: string
    description: string
    content?: string
    image_url: string
    category: string
    instructor?: string
    duration?: string
    level?: string
    status: string
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface CourseItem {
    id: string
    title: string
    slug: string
    description: string
    content?: string
    image_url: string
    category: string
    instructor?: string
    duration?: string
    level?: string
    status: string
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface Announcement {
    id: string
    title: string
    content: string
    category: string
    priority?: string
    status: string
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface AttachmentFile {
    id: string
    name: string
    url: string
    type: string
    size?: number
    created_at: string
}

export interface ParsedFile {
    name: string
    url: string
    type: string
    size?: number
}
