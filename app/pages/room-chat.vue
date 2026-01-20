<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

definePageMeta({
  middleware: ['auth'],
  layout: 'default'
})

useSeoOptimized('chat')

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Composables
const { 
  conversations, 
  getUserConversations, 
  getOrCreateConversation,
  getCurrentUser,
  deleteConversation,
  loading 
} = useChat()

const { searchConversations } = useChatSearch()
const { sidebarOpen, isMobile, toggleSidebar, onChatSelected } = useChatLayout()

// State
const currentUser = ref(null)
const searchQuery = ref('')
const deletingConversationId = ref<string | null>(null)
const showNewChatModal = ref(false)

// Computed
const selectedConversationId = computed(() => route.params.id as string | undefined)

const filteredConversations = computed(() => {
  if (!currentUser.value || !conversations.value) return []
  
  if (!searchQuery.value.trim()) {
    return conversations.value
  }
  
  return searchConversations(conversations.value, searchQuery.value.trim(), currentUser.value.id)
})

// Methods
const openChat = (conversationId: string) => {
  router.push(`/room-chat/${conversationId}`)
  onChatSelected()
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
    onChatSelected()
  } catch (error) {
    console.error('Failed to start chat:', error)
    toast.add({
      title: 'Gagal',
      description: 'Gagal membuat chat baru',
      color: 'error'
    })
  }
}

const handleDeleteConversation = async (conversationId: string) => {
  try {
    deletingConversationId.value = conversationId
    
    await deleteConversation(conversationId)
    
    toast.add({
      title: 'Berhasil',
      description: 'Percakapan berhasil dihapus',
      color: 'success'
    })
    
    // Navigate back to chat list if deleted conversation was selected
    if (selectedConversationId.value === conversationId) {
      router.push('/room-chat')
    }
    
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
    console.log('🔄 Loading room-chat page...')
    
    // Get current user first
    currentUser.value = await getCurrentUser()
    console.log('👤 Current user:', currentUser.value?.id)
    
    if (!currentUser.value) {
      throw new Error('User not authenticated')
    }
    
    // Load conversations
    console.log('📥 Loading conversations...')
    await getUserConversations()
    console.log('✅ Conversations loaded:', conversations.value.length)
  } catch (error) {
    console.error('❌ Failed to load conversations:', error)
    toast.add({
      title: 'Gagal',
      description: error instanceof Error ? error.message : 'Gagal memuat conversation',
      color: 'error'
    })
  }
})
</script>

<template>
    <div class="lg:pt-24 pt-20">
      <div class="bg-gray-50 dark:bg-gray-950 flex flex-col min-h-screen">
        <!-- Simple Header Bar -->
        <div class="shrink-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-50">
          <div class="flex items-center gap-3">
            <UButton
              icon="i-heroicons-arrow-left"
              variant="ghost"
              size="sm"
              aria-label="Kembali ke discusions"
              @click="router.push('/discussions')"
            />
            <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              JuruTani Chat
            </h1>
          </div>
        </div>
    
        <!-- Chat Content -->
        <div class="flex-1 max-w-[1600px] mx-auto w-full overflow-hidden min-h-screen">
          <!-- Split Panel Layout -->
          <div class="flex h-full bg-white dark:bg-gray-900 shadow-xl">
            <!-- Sidebar - Conversation List -->
            <div 
              :class="[
                'transition-all duration-300 ease-in-out',
                'lg:relative absolute inset-y-0 left-0 z-70',
                'bg-white dark:bg-gray-900',
                'lg:border-r border-gray-200 dark:border-gray-800',
                sidebarOpen ? 'w-full lg:w-80 xl:w-96' : 'w-0 lg:w-80 xl:w-96',
                'overflow-hidden lg:overflow-visible'
              ]"
            >
              <!-- Mobile Overlay -->
              <div 
                v-if="isMobile && sidebarOpen"
                class="fixed inset-0 bg-black/50 lg:hidden"
                @click="toggleSidebar"
              />
              
              <div class="relative h-full min-h-screen">
                <ChatSidebar
                  v-if="currentUser"
                  :conversations="filteredConversations"
                  :current-user-id="currentUser?.id"
                  :loading="loading"
                  :search-query="searchQuery"
                  :selected-conversation-id="selectedConversationId"
                  @update:search-query="searchQuery = $event"
                  @open-chat="openChat"
                  @delete-conversation="handleDeleteConversation"
                  @new-chat="handleNewChat"
                />
                
                <!-- Loading State for Sidebar -->
                <div v-else class="flex items-center justify-center h-full min-h-screen">
                  <div class="text-center space-y-3">
                    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-green-500 animate-spin mx-auto" />
                    <p class="text-sm text-gray-500 dark:text-gray-400">Memuat percakapan...</p>
                  </div>
                </div>
              </div>
            </div>
    
            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-950 min-h-screen">
              <NuxtPage />
            </div>
          </div>
        </div>
    
        <!-- New Chat Modal -->
        <ChatNewChatModal
          v-model="showNewChatModal"
          :on-start-chat="startChat"
        />
      </div>
    </div>
</template>
