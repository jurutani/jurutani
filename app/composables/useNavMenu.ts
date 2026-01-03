import siteMeta from '@/site'

// TypeScript interfaces untuk nav items
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

export const useNavMenu = () => {
    const navs = siteMeta.navs as NavMenu

    // Flatten nested items untuk search/routing
    const flattenNavItems = (items: NavItem[]): NavItem[] => {
        return items.reduce((acc: NavItem[], item) => {
            if (item.children) {
                return [...acc, ...item.children]
            }
            return [...acc, item]
        }, [])
    }

    const allNavs = [
        ...flattenNavItems(navs.primary),
        ...navs.secondary
    ]

    const currentRoute = useRoute()
    const currentPath = computed(() => {
        return currentRoute.path
    })

    return {
        allNavs,
        navsPrimary: navs.primary,
        navsSecondary: navs.secondary,
        currentPath,
        flattenNavItems,
    }
}
