<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Composables
const router = useRouter()
const toast = useToast()

const { 
  conversations, 
  getUserConversations, 
  getOrCreateConversation,
  getCurrentUser,
  deleteConversation,
  loading 
} = useChat()

const { 
  formatLastMessageTime, 
  truncateMessage, 
  getConversationPartner,
  getAvatarFallback 
} = useChatUtils()

const { searchConversations } = useChatSearch()

// Reactive data
const searchQuery = ref('')
const currentUser = ref(null)
const deletingConversationId = ref(null)
const showNewChatModal = ref(false)

// Computed properties
const filteredConversations = computed(() => {
  if (!currentUser.value || !conversations.value) return []
  
  if (!searchQuery.value.trim()) {
    return conversations.value
  }
  
  return searchConversations(conversations.value, searchQuery.value.trim(), currentUser.value.id)
})

// Methods
const getPartner = (conversation) => {
  if (!currentUser.value) return null
  return getConversationPartner(conversation, currentUser.value.id)
}

const openChat = (conversationId: string) => {
  router.push(`/room-chat/${conversationId}`)
}

const handleNewChat = () => {
  showNewChatModal.value = true
}

const startChat = async (userId: string) => {
  try {
    const conversation = await getOrCreateConversation(userId) as any
    if (!conversation) {
      throw new Error('Failed to create conversation')
    }
    
    toast.add({
      title: 'Berhasil',
      description: 'Chat baru dengan ahli pertanian telah dibuat',
      color: 'success'
    })
    
    router.push(`/room-chat/${conversation.id}`)
  } catch (error) {
    console.error('Failed to start chat:', error)
    toast.add({
      title: 'Gagal',
      description: 'Gagal membuat chat baru',
      color: 'error'
    })
  }
}

const handleClearSearch = () => {
  searchQuery.value = ''
}

const updateSearchQuery = (value: string) => {
  searchQuery.value = value
}

// Handle delete conversation
const handleDeleteConversation = async (conversationId: string) => {
  try {
    deletingConversationId.value = conversationId
    
    await deleteConversation(conversationId)
    
    toast.add({
      title: 'Berhasil',
      description: 'Percakapan berhasil dihapus',
      color: 'success'
    })
    
    // Refresh conversations list
    await getUserConversations()
  } catch (error) {
    console.error('Failed to delete conversation:', error)
    toast.add({
      title: 'Gagal',
      description: 'Gagal menghapus percakapan',
      color: 'error'
    })
  } finally {
    deletingConversationId.value = null
  }
}

// Lifecycle
onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser()
    await getUserConversations()
  } catch (error) {
    console.error('Failed to load conversations:', error)
    toast.add({
      title: 'Gagal',
      description: 'Gagal memuat conversation',
      color: 'error'
    })
  }
})

// Meta
useHead({
  title: 'Juru Tani Chat - Konsultasi Pertanian',
  meta: [
    { name: 'description', content: 'Konsultasi langsung dengan ahli pertanian dan penyuluh terpercaya' }
  ]
})
</script>

<template>
  <div class="flex flex-col h-screen max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl my-10">
    <!-- Header -->
    <ChatRoomHeader
      title="Juru Tani Chat"
      subtitle="Konsultasi dengan ahli pertanian"
      back-to="/discussions"
      back-label="Kembali ke Diskusi"
      action-button-label="Chat Baru"
      action-button-icon="i-heroicons-plus"
      action-button-color="success"
      @action="handleNewChat"
    />

    <!-- Search Bar -->
    <ChatSearchBar
      v-model="searchQuery"
      :result-count="filteredConversations.length"
      :loading="loading"
      @clear="handleClearSearch"
    />

    <!-- Loading State -->
    <ChatLoadingState v-if="loading" />

    <!-- Conversation List -->
    <div v-else class="flex-1 overflow-y-auto bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-900">
      <div class="divide-y divide-green-100 dark:divide-gray-700 max-h-[calc(100vh-20rem)] overflow-y-auto">
        <ChatConversationItem
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          :conversation="conversation"
          :partner="getPartner(conversation)"
          :format-last-message-time="formatLastMessageTime"
          :truncate-message="truncateMessage"
          :get-avatar-fallback="getAvatarFallback"
          :is-deleting="deletingConversationId === conversation.id"
          class="hover:bg-green-50 dark:hover:bg-gray-800 transition-colors duration-200"
          @open-chat="openChat"
          @delete-conversation="handleDeleteConversation"
        />
      </div>

      <!-- Empty State -->
      <ChatEmptyState
        v-if="!loading && filteredConversations.length === 0"
        :search-query="searchQuery"
        @start-new-chat="handleNewChat"
        @clear-search="handleClearSearch"
      />
    </div>

    <!-- New Chat Modal -->
    <ChatNewChatModal
      v-model="showNewChatModal"
      :on-start-chat="startChat"
    />
  </div>
</template>