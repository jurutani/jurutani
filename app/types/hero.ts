/**
 * Hero section type definitions
 * Used by useHeroData composable
 */

export interface HeroData {
    id: string
    caption: string
    title: string
    description: string
    button_text: string
    button_link: string
    image_url?: string
    status: string
    created_at: string
    deleted_at?: string
}
