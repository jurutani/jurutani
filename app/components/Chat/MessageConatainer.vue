<!-- components/Chat/MessagesContainer.vue -->
<script setup lang="ts">
import type { Message } from '~/types/chat'

interface Props {
  messages: Message[]
  currentUserId: string | null
  isLoading?: boolean
}

defineProps<Props>()

const messagesContainer = ref<HTMLElement>()
const { groupMessagesByDate, isOwnMessage, scrollToBottom } = useChatUtils()

const groupedMessages = computed(() => {
  return groupMessagesByDate(props.messages)
})

// Watch for new messages and scroll to bottom
watch(() => props.messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    scrollToBottom(messagesContainer.value)
  }
}, { deep: true })

// Expose ref for parent component
defineExpose({
  scrollToBottom: () => {
    if (messagesContainer.value) {
      scrollToBottom(messagesContainer.value)
    }
  }
})
</script>

<template>
  <div 
    ref="messagesContainer" 
    class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="flex" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
        <USkeleton class="h-16 w-48 rounded-2xl" />
      </div>
    </div>

    <!-- Messages -->
    <div v-else-if="messages.length > 0">
      <div v-for="(messagesGroup, date) in groupedMessages" :key="date" class="space-y-3">
        <!-- Date Separator -->
        <div class="flex justify-center">
          <UBadge variant="soft" color="gray" size="sm">
            {{ date }}
          </UBadge>
        </div>
        
        <!-- Messages -->
        <MessageItem
          v-for="message in messagesGroup" 
          :key="message.id"
          :message="message"
          :is-own="isOwnMessage(message, currentUserId)"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
      <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-12 h-12 mb-4" />
      <p class="text-lg font-medium mb-2">Belum ada pesan</p>
      <p class="text-sm text-center">Mulai percakapan dengan mengirim pesan pertama</p>
    </div>
  </div>
</template>