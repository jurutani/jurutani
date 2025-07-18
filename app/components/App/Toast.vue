<script setup lang="ts">
import { toastStore } from '~/composables/useJuruTaniToast'
import { UIcon } from '#components'

const getToastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-100 border-emerald-500 text-emerald-700'
    case 'error':
      return 'bg-red-100 border-red-500 text-red-700'
    case 'warning':
      return 'bg-yellow-100 border-yellow-500 text-yellow-700'
    case 'info':
    default:
      return 'bg-blue-100 border-blue-500 text-blue-700'
  }
}

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return { name: 'heroicons-check-circle', class: 'text-emerald-500' }
    case 'error':
      return { name: 'heroicons-x-circle', class: 'text-red-500' }
    case 'warning':
      return { name: 'heroicons-exclamation-circle', class: 'text-yellow-500' }
    case 'info':
    default:
      return { name: 'heroicons-information-circle', class: 'text-blue-500' }
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 w-80">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="['toast p-3 border-l-4 rounded shadow-md flex items-start', getToastClasses(toast.type)]"
        >
          <div class="mr-2">
            <UIcon
              :name="getToastIcon(toast.type).name"
              :class="['w-5 h-5', getToastIcon(toast.type).class]"
            />
          </div>
          <div class="flex-grow">{{ toast.message }}</div>
          <button
            class="ml-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
            @click="toastStore.remove(toast.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
