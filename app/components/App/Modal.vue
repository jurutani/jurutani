<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { modalStore } from '~/composables/useJuruTaniModal'

const props = defineProps({
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  }
})

const modalRef = ref<HTMLElement | null>(null)

const closeModal = () => {
  modalStore.close()
}

const handleClickOutside = (e: MouseEvent) => {
  if (!props.closeOnClickOutside) return
  if (modalStore.isVisible && modalRef.value && !modalRef.value.contains(e.target as Node)) {
    closeModal()
  }
}

const handleEsc = (e: KeyboardEvent) => {
  if (props.closeOnEsc && e.key === 'Escape') {
    closeModal()
  }
}

watch(() => modalStore.isVisible, (isVisible) => {
  document.body.style.overflow = isVisible ? 'hidden' : ''
})

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
  document.removeEventListener('mousedown', handleClickOutside)
  document.body.style.overflow = ''
})

// Dinamis class overlay
const overlayClass = computed(() => {
  return [
    'modal-overlay fixed inset-0 flex items-center justify-center transition-opacity duration-300',
    modalStore.isVisible
      ? 'bg-black bg-opacity-50 z-50 pointer-events-auto'
      : 'bg-transparent z-[-1] pointer-events-none'
  ]
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-show="modalStore.isVisible" class="relative">
        <div :class="overlayClass">
          <div
            ref="modalRef"
            class="modal-content bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto relative"
          >
            <button
              class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
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

            <component
              :is="modalStore.component"
              v-bind="modalStore.props"
              @close="closeModal"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: translateY(-20px);
}
</style>
