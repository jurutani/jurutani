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
  loading,
  currentConversation
} = useChat()

const { searchConversations } = useChatSearch()
const { sidebarOpen, isMobile, toggleSidebar, onChatSelected } = useChatLayout()
const { getConversationPartner } = useChatUtils()

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
    
    // Set current conversation if on a conversation page
    if (selectedConversationId.value) {
      const conversation = conversations.value.find(c => c.id === selectedConversationId.value)
      if (conversation) {
        currentConversation.value = conversation
        console.log('✅ Current conversation set:', conversation.id)
      }
    }
  } catch (error) {
    console.error('❌ Failed to load conversations:', error)
    toast.add({
      title: 'Gagal',
      description: error instanceof Error ? error.message : 'Gagal memuat conversation',
      color: 'error'
    })
  }
})

// Watch for conversation selection changes
watch(selectedConversationId, (newId) => {
  if (newId && conversations.value.length > 0) {
    const conversation = conversations.value.find(c => c.id === newId)
    if (conversation) {
      currentConversation.value = conversation
      console.log('✅ Conversation changed:', conversation.id)
    }
  } else {
    currentConversation.value = null
  }
})

// Also watch conversations array in case it loads after route
watch(conversations, (newConversations) => {
  if (selectedConversationId.value && newConversations.length > 0) {
    const conversation = newConversations.find(c => c.id === selectedConversationId.value)
    if (conversation && !currentConversation.value) {
      currentConversation.value = conversation
      console.log('✅ Conversation set from conversations update:', conversation.id)
    }
  }
}, { deep: true })
</script>

<template>
    <div class="lg:pt-24 pt-20">
      <div class="flex flex-col" style="height: calc(100vh - 5rem);">
        <!-- Breadcrumbs Header Bar -->
        <div class="shrink-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 z-50">
          <UBreadcrumb
            :items="[
              {
                label: 'Discussions',
                icon: 'i-heroicons-home',
                to: '/discussions'
              },
              {
                label: 'Room Chat',
                icon: 'i-heroicons-chat-bubble-left-right',
                to: '/room-chat'
              },
              ...(selectedConversationId && currentConversation ? [{
                label: getConversationPartner(currentConversation, currentUser?.id)?.full_name || 'Chat',
                icon: 'i-heroicons-user'
              }] : [])
            ]"
          />
        </div>
    
        <!-- Chat Content -->
        <div class="flex-1 max-w-[1600px] mx-auto w-full overflow-hidden">
          <!-- Split Panel Layout -->
          <div class="flex h-full bg-white dark:bg-gray-900 shadow-xl">
            <!-- Desktop Sidebar - Fixed Panel (Hidden on Mobile) -->
            <div 
              class="hidden lg:block lg:w-80 xl:w-96 border-r h-full overflow-hidden"
            >
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
              <div v-else class="flex items-center justify-center h-full">
                <div class="text-center space-y-3">
                  <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-green-500 animate-spin mx-auto" />
                  <p class="text-sm text-gray-500 dark:text-gray-400">Memuat percakapan...</p>
                </div>
              </div>
            </div>
    
            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-950 h-full overflow-hidden">
              <!-- Mobile Custom SlideOver -->
              <Teleport to="body">
                <!-- Overlay -->
                <Transition
                  enter-active-class="transition-opacity duration-300"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="transition-opacity duration-300"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <div
                    v-if="sidebarOpen"
                    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    @click="toggleSidebar"
                  />
                </Transition>

                <!-- Slideover Panel -->
                <Transition
                  enter-active-class="transition-transform duration-300 ease-out"
                  enter-from-class="-translate-x-full"
                  enter-to-class="translate-x-0"
                  leave-active-class="transition-transform duration-300 ease-in"
                  leave-from-class="translate-x-0"
                  leave-to-class="-translate-x-full"
                >
                  <div
                    v-if="sidebarOpen"
                    class="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 shadow-xl z-50 lg:hidden overflow-hidden"
                  >
                    <div class="h-full flex flex-col">
                      <!-- Close Button -->
                      <div class="shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Room Chat
                        </h2>
                        <UButton
                          icon="i-heroicons-x-mark"
                          color="neutral"
                          variant="ghost"
                          size="sm"
                          @click="toggleSidebar"
                        />
                      </div>

                      <!-- Sidebar Content -->
                      <div class="flex-1 overflow-hidden">
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
                        
                        <!-- Loading State -->
                        <div v-else class="flex items-center justify-center h-full">
                          <div class="text-center space-y-3">
                            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-green-500 animate-spin mx-auto" />
                            <p class="text-sm text-gray-500 dark:text-gray-400">Memuat percakapan...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </Teleport>

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
