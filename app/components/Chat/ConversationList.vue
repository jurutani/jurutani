<!-- components/chat/ConversationList.vue -->
<script setup lang="ts">
interface Conversation {
  id: string
  last_message?: string
  last_message_at?: string
  unread_count?: number
  participants: Array<{
    id: string
    full_name: string
    avatar_url?: string
    email?: string
  }>
}

interface Props {
  conversations: Conversation[]
  currentUserId?: string
  loading?: boolean
  searchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  conversations: () => [],
  loading: false,
  searchQuery: ''
})

const emit = defineEmits<{
  openChat: [conversationId: string]
  newChat: []
}>()

const { 
  formatLastMessageTime, 
  truncateMessage, 
  getConversationPartner,
  getAvatarFallback 
} = useChatUtils()

const getPartner = (conversation: Conversation) => {
  if (!props.currentUserId) return null
  return getConversationPartner(conversation, props.currentUserId)
}

const handleOpenChat = (conversationId: string) => {
  emit('openChat', conversationId)
}

const handleNewChat = () => {
  emit('newChat')
}
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
        <p class="text-gray-500">Memuat conversation...</p>
      </div>
    </div>

    <!-- Conversation List -->
    <div v-else-if="conversations.length > 0" class="divide-y divide-gray-100">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
        @click="handleOpenChat(conversation.id)"
      >
        <!-- Avatar -->
        <div class="relative">
          <UAvatar
            :src="getPartner(conversation)?.avatar_url"
            :alt="getPartner(conversation)?.full_name"
            size="lg"
            class="ring-2 ring-white"
          >
            <template #fallback>
              {{ getAvatarFallback(getPartner(conversation)?.full_name || '') }}
            </template>
          </UAvatar>
          
          <!-- Online Status -->
          <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full"/>
        </div>
        
        <!-- Conversation Info -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {{ getPartner(conversation)?.full_name }}
            </h3>
            <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
              {{ conversation.last_message_at ? formatLastMessageTime(conversation.last_message_at) : '' }}
            </span>
          </div>
          
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600 truncate pr-2">
              {{ truncateMessage(conversation.last_message || 'Belum ada pesan', 60) }}
            </p>
            
            <!-- Unread Badge -->
            <UBadge 
              v-if="conversation.unread_count && conversation.unread_count > 0"
              color="primary"
              variant="solid"
              size="sm"
              class="flex-shrink-0"
            >
              {{ conversation.unread_count > 99 ? '99+' : conversation.unread_count }}
            </UBadge>
          </div>
        </div>
        
        <!-- Chevron -->
        <UIcon 
          name="i-heroicons-chevron-right" 
          class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center h-64 px-4">
      <div class="text-center">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ searchQuery ? 'Tidak ada conversation ditemukan' : 'Belum ada conversation' }}
        </h3>
        <p class="text-gray-500 mb-6 max-w-sm">
          {{ searchQuery 
            ? `Coba kata kunci lain untuk mencari conversation`
            : 'Mulai percakapan baru dengan menekan tombol "Chat Baru"' 
          }}
        </p>
        <UButton
          v-if="!searchQuery"
          icon="i-heroicons-plus"
          @click="handleNewChat"
        >
          Mulai Chat Baru
        </UButton>
      </div>
    </div>
  </div>
</template>