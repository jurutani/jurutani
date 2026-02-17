<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'

// Reactive state
const isOpen = ref(false)
const showSplash = ref(true)
const isExpanded = ref(false)
const isLoading = ref(false)
const hasSeenSplash = ref(false)
const messageListRef = ref(null)
const inputRef = ref(null)

const messages = ref([
  {
    id: 1,
    type: 'bot',
    text: 'Halo! Saya adalah JuruTani AI, asisten penyuluh JuruTani untuk pertanian, peternakan, dan pembangunan. Saya dapat membantu Anda dengan informasi tentang:\n\n• Teknik budidaya tanaman dan peternakan\n• Teknologi pertanian modern\n• Manajemen sumber daya alam\n• Pembangunan infrastruktur pertanian\n• Pemasaran hasil pertanian\n• Program pemerintah untuk petani\n\nAda yang ingin Anda tanyakan?',
    timestamp: new Date()
  }
])

// Methods
const openChat = () => {
  if (!hasSeenSplash.value) {
    showSplash.value = true
    isOpen.value = true
  } else {
    showSplash.value = false
    isOpen.value = true
    nextTick(() => {
      inputRef.value?.focus()
      messageListRef.value?.scrollToBottom()
    })
  }
}

const startChat = () => {
  hasSeenSplash.value = true
  showSplash.value = false
  nextTick(() => {
    inputRef.value?.focus()
    messageListRef.value?.scrollToBottom()
  })
}

const toggleChatExpansion = () => {
  isExpanded.value = !isExpanded.value
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })
}

const closeChat = () => {
  isOpen.value = false
}

const { sendMessage } = useChatbot()

const sendMessageToGemini = async (message: string) => {
  return await sendMessage(message)
}

const handleSendMessage = async (userMessage: string) => {
  if (!userMessage.trim() || isLoading.value) return

  const messageToPush = {
    id: messages.value.length + 1,
    type: 'user',
    text: userMessage,
    timestamp: new Date()
  }

  messages.value.push(messageToPush)
  isLoading.value = true

  // Auto scroll after user sends message
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })

  // sendMessageToGemini always returns a string (either success or error message)
  const botResponse = await sendMessageToGemini(userMessage)
  
  const botMessage = {
    id: messages.value.length + 1,
    type: 'bot',
    text: botResponse,
    timestamp: new Date()
  }

  messages.value.push(botMessage)
  isLoading.value = false
  
  // Auto scroll after bot response
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })
}

// Handle Enter key for sending messages
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    // Event akan ditangani oleh ChatInput component
  }
}

// Watchers
watch(isOpen, (newVal) => {
  if (newVal && inputRef.value) {
    nextTick(() => {
      inputRef.value.focus()
    })
  }
})
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Bubble Button -->
    <div v-if="!isOpen" class="relative">
      <ChatbotChatBubbleButton @click="openChat" />
    </div>

    <!-- Splash Screen -->
    <ChatbotSplashScreen
      v-if="showSplash && isOpen"
      @start="startChat"
    />

    <!-- Chat Window -->
    <UCard
      v-if="isOpen && !showSplash"
      :class="[
        'relative overflow-hidden border-2 border-green-400 shadow-2xl transition-all duration-300',
        isExpanded ? 'w-96 h-150' : 'w-80 h-96'
      ]"
      :ui="{ body: { padding: 'p-0' } }"
    >
      <!-- Header -->
      <ChatbotChatHeader
        :is-expanded="isExpanded"
        @toggle-expand="toggleChatExpansion"
        @close="closeChat"
      />

      <!-- Messages Container -->
      <ChatbotMessageList
        ref="messageListRef"
        :messages="messages"
        :is-loading="isLoading"
        :is-expanded="isExpanded"
      />

      <!-- Input Area -->
      <ChatbotChatInput
        ref="inputRef"
        :disabled="isLoading"
        @submit="handleSendMessage"
      />
    </UCard>
  </div>
</template>

<style scoped>
/* Styles disediakan oleh component-component child */
</style>