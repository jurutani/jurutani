/**
 * Social sharing type definitions
 * Used by useSocialShare composable
 */

export interface ShareOptions {
    title: string
    description?: string
    url: string
    hashtags?: string[]
}

export interface SharePlatform {
    name: string
    icon: string
    color: string
    action: (options: ShareOptions) => void
}
