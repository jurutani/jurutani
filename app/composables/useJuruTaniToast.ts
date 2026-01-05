import { ref, reactive } from 'vue'
import type { Toast } from '~/types/toast'

let nextId = 0

export const usejuruTaniToast = () => {
  const toasts = reactive<Toast[]>([])

  const add = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    timeout = 3000
  ) => {
    const id = nextId++
    const toast = { id, message, type, timeout }
    toasts.push(toast)

    if (timeout) {
      setTimeout(() => {
        remove(id)
      }, timeout)
    }

    return id
  }

  const remove = (id: number) => {
    const index = toasts.findIndex(toast => toast.id === id)
    if (index !== -1) {
      toasts.splice(index, 1)
    }
  }

  return {
    toasts,
    add,
    remove,
    success: (message: string, timeout?: number) => add(message, 'success', timeout),
    error: (message: string, timeout?: number) => add(message, 'error', timeout),
    info: (message: string, timeout?: number) => add(message, 'info', timeout),
    warning: (message: string, timeout?: number) => add(message, 'warning', timeout)
  }
}

// Toast store global
export const toastStore = {
  toasts: reactive<Toast[]>([]),

  add(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', timeout = 3000) {
    const id = nextId++
    const toast = { id, message, type, timeout }
    this.toasts.push(toast)

    if (timeout) {
      setTimeout(() => {
        this.remove(id)
      }, timeout)
    }

    return id
  },

  remove(id: number) {
    const index = this.toasts.findIndex(toast => toast.id === id)
    if (index !== -1) {
      this.toasts.splice(index, 1)
    }
  },

  success(message: string, timeout?: number) {
    return this.add(message, 'success', timeout)
  },

  error(message: string, timeout?: number) {
    return this.add(message, 'error', timeout)
  },

  info(message: string, timeout?: number) {
    return this.add(message, 'info', timeout)
  },

  warning(message: string, timeout?: number) {
    return this.add(message, 'warning', timeout)
  }
}