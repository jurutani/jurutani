/**
 * Common/Shared type definitions
 * Used across multiple pages and components
 */

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    color?: string
    count?: number
}

export interface CategoryItem {
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    color?: string
    count?: number
}

export interface Banner {
    id: string
    title: string
    description?: string
    image_url: string
    link_url?: string
    status: string
    created_at: string
    updated_at: string
}

export interface Sponsor {
    id: string
    name: string
    logo_url: string
    website_url?: string
    description?: string
    status: string
    created_at: string
}

export interface StatItem {
    label: string
    value: string | number
    icon?: string
    color?: string
}

export interface FeatureCard {
    icon: string
    title: string
    description: string
    color?: string
}
