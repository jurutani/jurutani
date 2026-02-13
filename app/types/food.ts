/**
 * Food Prices Type Definitions
 * Based on Supabase schema: foods + food_prices tables
 */

export interface Food {
    id: string
    slug: string
    name: string
    category: 'hortikultura' | 'perkebunan' | 'perikanan' | 'peternakan'
    description?: string
    satuan: string
    image_url?: string
    specifications?: string
    tags?: string[]
    created_at: string
    updated_at: string
    deleted_at?: string
    // Joined data from food_prices (latest price)
    latest_price?: number
    latest_price_date?: string
    price_change?: number
    price_change_percent?: number
}

export interface FoodPrice {
    id: string
    food_id: string
    price: number
    date: string
    created_at: string
    updated_at: string
    deleted_at?: string
}

export interface FoodWithPrice extends Food {
    latest_price: number
    latest_price_date: string
    price_change?: number
    price_change_percent?: number
}

export interface FoodPriceTrend {
    date: string
    price: number
    price_change?: number
    price_change_percent?: number
}

export interface FoodCategory {
    name: string
    value: string
    icon?: string
    count?: number
}

export const FOOD_CATEGORIES: FoodCategory[] = [
    { name: 'Semua Kategori', value: 'all', icon: 'i-lucide-layers' },
    { name: 'Hortikultura', value: 'hortikultura', icon: 'i-lucide-flower-2' },
    { name: 'Perkebunan', value: 'perkebunan', icon: 'i-lucide-trees' },
    { name: 'Perikanan', value: 'perikanan', icon: 'i-lucide-fish' },
    { name: 'Peternakan', value: 'peternakan', icon: 'i-lucide-beef' }
]

export const FOOD_CATEGORY_LABELS: Record<string, string> = {
    hortikultura: 'Hortikultura',
    perkebunan: 'Perkebunan',
    peternakan: 'Peternakan',
    perikanan: 'Perikanan'
}
