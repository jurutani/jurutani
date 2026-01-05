<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  disabled: boolean
  placeholder?: string
}

const emit = defineEmits<{
  submit: [message: string]
}>()

defineProps<Props>()

const inputMessage = ref('')
const inputRef = ref(null)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

const handleSubmit = () => {
  if (!inputMessage.value.trim()) return
  
  const message = inputMessage.value
  inputMessage.value = ''
  emit('submit', message)
}

defineExpose({
  focus: () => {
    const el = inputRef.value as any
    if (!el) return
    // If the ref is a component instance that exposes a focus method
    if (typeof el.focus === 'function') {
      el.focus()
      return
    }
    // If the ref is a native HTMLElement
    if (el instanceof HTMLElement && typeof el.focus === 'function') {
      el.focus()
      return
    }
    // Fallback: try to find an input/textarea inside the component root
    const root = el.$el ?? el
    const input = root?.querySelector?.('input, textarea') as HTMLElement | null
    input?.focus?.()
  }
})
</script>

<template>
  <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white z-20 dark:bg-gray-900 dark:border-gray-700">
    <form class="flex space-x-2" @submit.prevent="handleSubmit">
      <UInput
        ref="inputRef"
        v-model="inputMessage"
        :placeholder="placeholder || 'Tanya tentang pertanian...'"
        :disabled="disabled"
        size="sm"
        class="flex-1"
        @keydown="handleKeydown"
      />
      <UButton
        type="submit"
        :disabled="!inputMessage.trim() || disabled"
        icon="heroicons:paper-airplane"
        color="success"
        size="sm"
        class="transition-all duration-200 hover:scale-105"
      />
    </form>
  </div>
</template>
