<!-- components/chat/MessageInput.vue -->
<script setup lang="ts">
interface Props {
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  sendMessage: [message: string]
}>()

const { isValidMessage } = useChatUtils()

const newMessage = ref('')

const sendMessage = () => {
  if (!isValidMessage(newMessage.value) || props.loading || props.disabled) return
  
  const messageContent = newMessage.value.trim()
  newMessage.value = ''
  
  emit('sendMessage', messageContent)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="p-4 border-t border-gray-200 bg-white">
    <div class="flex gap-3">
      <UInput
        v-model="newMessage"
        placeholder="Ketik pesan..."
        :disabled="loading || disabled"
        class="flex-1"
        size="lg"
        @keypress="handleKeyPress"
      />
      <UButton
        :disabled="!isValidMessage(newMessage) || loading || disabled"
        :loading="loading"
        icon="i-heroicons-paper-airplane"
        size="lg"
        @click="sendMessage"
      >
        Kirim
      </UButton>
    </div>
  </div>
</template>