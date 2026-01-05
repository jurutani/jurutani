/**
 * Content-related type definitions
 * Used by useContentList and useContentDetail composables
 */

export interface ContentListOptions {
    tableName: string
    pageSize?: number
    defaultSort?: {
        column: string
        ascending: boolean
    }
    statusField?: string
    statusValue?: string
    categoryField?: string
}

export interface SortOption {
    label: string
    value: string
    column: string
    ascending: boolean
}

export interface FilterState {
    category: string
    search: string
    sort: string
}

export interface ContentDetailOptions {
    tableName: string
    statusField?: string
    statusValue?: string
    categoryField?: string
    similarLimit?: number
}
