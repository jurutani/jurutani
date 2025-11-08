<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  type: 'user' | 'bot'
  text: string
  timestamp: Date
}

interface Props {
  messages: Message[]
  isLoading: boolean
  isExpanded: boolean
}

interface Emits {
  toggleExpand: [messageId: number]
}

const props = defineProps<Props>()
defineEmits<Emits>()

const messagesContainer = ref(null)
const expandedMessages = ref(new Set())

const scrollToBottom = () => {
  if (messagesContainer.value) {
    nextTick(() => {
      const element = messagesContainer.value
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      })
    })
  }
}

const toggleMessageExpansion = (messageId: number) => {
  const newSet = new Set(expandedMessages.value)
  if (newSet.has(messageId)) {
    newSet.delete(messageId)
  } else {
    newSet.add(messageId)
  }
  expandedMessages.value = newSet
}

defineExpose({
  scrollToBottom,
  toggleMessageExpansion
})

watch(
  () => props.messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true }
)
</script>

<template>
  <div 
    ref="messagesContainer"
    class="absolute top-20 bottom-20 left-0 right-0 overflow-y-scroll p-4 space-y-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 scroll-smooth"
    style="scroll-behavior: smooth;"
  >
    <ChatbotChatMessage
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :is-expanded="expandedMessages.has(message.id)"
      :max-width="isExpanded ? 'max-w-md' : 'max-w-xs'"
      @toggle-expand="toggleMessageExpansion"
    />

    <!-- Loading indicator -->
    <ChatbotLoadingIndicator
      v-if="isLoading"
      :max-width="isExpanded ? 'max-w-md' : 'max-w-xs'"
    />

    <!-- Scroll anchor -->
    <div id="scroll-anchor" style="height: 1px;" />
  </div>
</template>

<style scoped>
/* Custom scrollbar styling */
.overflow-y-scroll::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #10b981, #059669);
  border-radius: 3px;
  transition: all 0.2s ease;
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #059669, #047857);
}

/* Firefox scrollbar */
.overflow-y-scroll {
  scrollbar-width: thin;
  scrollbar-color: #10b981 #f1f5f9;
}

/* Dark mode scrollbar tweaks */
:global(.dark) .overflow-y-scroll::-webkit-scrollbar-track {
  background: #0f1724;
}

:global(.dark) .overflow-y-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #059669, #047857);
}

:global(.dark) .overflow-y-scroll {
  scrollbar-color: #059669 #0f1724;
}

.scroll-smooth {
  scroll-behavior: smooth;
}
</style>
