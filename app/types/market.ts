/**
 * Market/Product-related type definitions
 * Used by market pages and components
 */

export interface Market {
    id: string
    title: string
    name: string
    slug: string
    description: string
    price: number
    image_url: string
    category: string
    stock?: number
    unit?: string
    seller_id?: string
    status: string
    price_range?: string
    location?: string
    weight?: string
    size?: string
    attachments?: string
    seller?: string
    contact_seller?: string
    links?: {
        shopee_link?: string
        tokopedia_link?: string
        tiktok_link?: string
    }
    profiles?: {
        full_name?: string
        name?: string
        avatar_url?: string
    }
    created_at: string
    updated_at: string
    deleted_at?: string
    archived_at?: string
}

export interface Product {
    id: string
    title: string
    slug: string
    description: string
    price: number
    image_url: string
    category: string
    stock?: number
    unit?: string
    seller_id?: string
    status: string
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface ProductFormState {
    title: string
    slug: string
    description: string
    price: number
    image_url: string
    category: string
    stock: number
    unit: string
    status: string
}
