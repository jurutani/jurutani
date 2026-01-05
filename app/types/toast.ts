/**
 * Toast notification type definitions
 * Used by useJuruTaniToast composable
 */

export interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    timeout?: number
}
