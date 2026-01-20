<script setup lang="ts">
import type { Conversation } from '~/types/chat'

interface Props {
  conversations: Conversation[]
  currentUserId?: string | null
  loading?: boolean
  searchQuery?: string
  selectedConversationId?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'openChat': [conversationId: string]
  'deleteConversation': [conversationId: string]
  'newChat': []
}>()

const { 
  formatLastMessageTime, 
  truncateMessage, 
  getConversationPartner,
  getAvatarFallback 
} = useChatUtils()

const localSearchQuery = computed({
  get: () => props.searchQuery || '',
  set: (value) => emit('update:searchQuery', value)
})

const getPartner = (conversation: Conversation) => {
  if (!props.currentUserId) return null
  return getConversationPartner(conversation, props.currentUserId)
}
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
    <!-- Sidebar Header -->
    <div class="shrink-0 p-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          Percakapan
        </h2>
        <UButton
          icon="i-heroicons-plus"
          color="success"
          size="sm"
          @click="emit('newChat')"
        >
          Baru
        </UButton>
      </div>
      
      <!-- Search Bar -->
      <UInput
        v-model="localSearchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Cari percakapan..."
        :loading="loading"
        class="w-full"
      />
    </div>

    <!-- Conversation List -->
    <div class="flex-1 overflow-y-auto">
      <ChatLoadingState v-if="loading" />
      
      <div v-else-if="conversations.length > 0" class="divide-y divide-gray-100 dark:divide-gray-800">
        <ChatConversationItem
          v-for="conversation in conversations"
          :key="conversation.id"
          :conversation="conversation"
          :partner="getPartner(conversation)"
          :format-last-message-time="formatLastMessageTime"
          :truncate-message="truncateMessage"
          :get-avatar-fallback="getAvatarFallback"
          :class="[
            'transition-colors duration-200',
            selectedConversationId === conversation.id 
              ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          ]"
          @open-chat="emit('openChat', $event)"
          @delete-conversation="emit('deleteConversation', $event)"
        />
      </div>
      
      <ChatEmptyState
        v-else
        :search-query="searchQuery"
        @start-new-chat="emit('newChat')"
        @clear-search="emit('update:searchQuery', '')"
      />
    </div>
  </div>
</template>
