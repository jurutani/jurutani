/**
 * Navigation-related type definitions
 * Used by useNavMenu composable
 */

export interface NavItem {
    title: string
    to?: string
    icon?: string
    badge?: string
    children?: NavItem[]
}

export interface NavMenu {
    primary: NavItem[]
    secondary: NavItem[]
}
