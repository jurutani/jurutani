<!-- components/chat/MessageList.vue -->
<script setup lang="ts">
interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string
}

interface Props {
  messages: Message[]
  currentUserId?: string
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => []
})

const messagesContainer = ref<HTMLElement>()

const {
  formatMessageTime,
  groupMessagesByDate,
  isOwnMessage,
  scrollToBottom
} = useChatUtils()

const groupedMessages = computed(() => {
  return groupMessagesByDate(props.messages)
})

// Auto scroll to bottom when messages change
watch(() => props.messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    scrollToBottom(messagesContainer.value)
  }
}, { deep: true })

// Expose scroll method to parent
defineExpose({
  scrollToBottom: () => {
    if (messagesContainer.value) {
      scrollToBottom(messagesContainer.value)
    }
  }
})

onMounted(async () => {
  await nextTick()
  if (messagesContainer.value) {
    scrollToBottom(messagesContainer.value, false)
  }
})
</script>

<template>
  <div 
    ref="messagesContainer" 
    class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
  >
    <div v-for="(messagesGroup, date) in groupedMessages" :key="date" class="space-y-3">
      <!-- Date Separator -->
      <div class="flex justify-center">
        <UBadge variant="soft" color="gray" size="sm">
          {{ date }}
        </UBadge>
      </div>
      
      <!-- Messages -->
      <div 
        v-for="message in messagesGroup" 
        :key="message.id"
        :class="[
          'flex',
          isOwnMessage(message, currentUserId) ? 'justify-end' : 'justify-start'
        ]"
      >
        <div 
          :class="[
            'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl shadow-sm',
            isOwnMessage(message, currentUserId) 
              ? 'bg-primary-500 text-white rounded-br-md' 
              : 'bg-white text-gray-900 rounded-bl-md'
          ]"
        >
          <p class="text-sm leading-relaxed">{{ message.content }}</p>
          <p 
            :class="[
              'text-xs mt-1',
              isOwnMessage(message, currentUserId) 
                ? 'text-primary-100' 
                : 'text-gray-500'
            ]"
          >
            {{ formatMessageTime(message.created_at) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 mb-4" />
      <p class="text-lg font-medium mb-2">Belum ada pesan</p>
      <p class="text-sm text-center">Mulai percakapan dengan mengirim pesan pertama</p>
    </div>
  </div>
</template>