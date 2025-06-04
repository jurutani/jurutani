<!-- pages/chat/[id].vue - Halaman chat individual -->
<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const { 
  conversations, 
  getUserConversations, 
  getOrCreateConversation,
  getCurrentUser,
  loading 
} = useChat()

const { 
  formatLastMessageTime, 
  truncateMessage, 
  getConversationPartner,
  getAvatarFallback 
} = useChatUtils()

const { searchConversations, searchUsers: searchUsersUtil } = useChatSearch()

// Chat list states
const searchQuery = ref('')
const showNewChat = ref(false)
const userSearchQuery = ref('')
const searchResults = ref([])

// Chat room states
const {
  messages,
  currentConversation,
  getMessages,
  sendMessage: sendChatMessage,
  subscribeToMessages,
  unsubscribeFromMessages,
  markAsRead
} = useChat()

const {
  formatMessageTime,
  groupMessagesByDate,
  isOwnMessage,
  isValidMessage,
  scrollToBottom
} = useChatUtils()

const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const currentUser = ref(null)
const conversationId = computed(() => route.params.id as string)

// Computed properties
const filteredConversations = computed(() => {
  if (!currentUser.value) return []
  return searchConversations(conversations.value, searchQuery.value, currentUser.value.id)
})

const groupedMessages = computed(() => {
  return groupMessagesByDate(messages.value)
})

const partnerInfo = computed(() => {
  if (!currentConversation.value || !currentUser.value) return null
  return getConversationPartner(currentConversation.value, currentUser.value.id)
})

// Methods
const getPartner = (conversation) => {
  if (!currentUser.value) return null
  return getConversationPartner(conversation, currentUser.value.id)
}

const openChat = (conversationId: string) => {
  router.push(`/chat/${conversationId}`)
}

const startChat = async (userId: string) => {
  try {
    const conversation = await getOrCreateConversation(userId)
    showNewChat.value = false
    router.push(`/chat/${conversation.id}`)
  } catch (error) {
    console.error('Failed to start chat:', error)
    // Show error toast
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Gagal membuat percakapan',
      color: 'red'
    })
  }
}

const searchUsers = async () => {
  if (userSearchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }
  
  try {
    const results = await searchUsersUtil(userSearchQuery.value, currentUser.value?.id)
    searchResults.value = results
  } catch (error) {
    console.error('Failed to search users:', error)
  }
}

const sendMessage = async () => {
  if (!isValidMessage(newMessage.value) || loading.value) return
  
  try {
    const messageContent = newMessage.value.trim()
    newMessage.value = ''
    
    await sendChatMessage(conversationId.value, messageContent)
    
    // Scroll to bottom after sending
    await nextTick()
    if (messagesContainer.value) {
      scrollToBottom(messagesContainer.value)
    }
  } catch (error) {
    console.error('Failed to send message:', error)
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Gagal mengirim pesan',
      color: 'red'
    })
  }
}

const goBack = () => {
  router.push('/chat')
}

// Watchers
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    scrollToBottom(messagesContainer.value)
  }
}, { deep: true })

// Lifecycle
onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser()
    
    if (conversationId.value) {
      // Load messages for specific conversation
      await getMessages(conversationId.value)
      await markAsRead(conversationId.value)
      subscribeToMessages(conversationId.value)
      
      // Scroll to bottom
      await nextTick()
      if (messagesContainer.value) {
        scrollToBottom(messagesContainer.value, false)
      }
    } else {
      // Load conversations list
      await getUserConversations()
    }
  } catch (error) {
    console.error('Failed to load chat:', error)
    if (conversationId.value) {
      router.push('/chat')
    }
  }
})

onUnmounted(() => {
  unsubscribeFromMessages()
})
</script>

<template>
  <div class="flex flex-col h-screen max-w-4xl mx-auto bg-white">
    <!-- Chat Room View -->
    <div v-if="conversationId" class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            size="sm"
            @click="goBack"
          />
          <UAvatar
            :src="partnerInfo?.avatar"
            :alt="partnerInfo?.name"
            size="md"
          >
            <template #fallback>
              {{ getAvatarFallback(partnerInfo?.name || '') }}
            </template>
          </UAvatar>
          <div>
            <h2 class="font-semibold text-gray-900">{{ partnerInfo?.name }}</h2>
            <p class="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>

      <!-- Messages Container -->
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
              isOwnMessage(message, currentUser?.id) ? 'justify-end' : 'justify-start'
            ]"
          >
            <div 
              :class="[
                'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl shadow-sm',
                isOwnMessage(message, currentUser?.id) 
                  ? 'bg-primary-500 text-white rounded-br-md' 
                  : 'bg-white text-gray-900 rounded-bl-md'
              ]"
            >
              <p class="text-sm leading-relaxed">{{ message.content }}</p>
              <p 
                :class="[
                  'text-xs mt-1',
                  isOwnMessage(message, currentUser?.id) 
                    ? 'text-primary-100' 
                    : 'text-gray-500'
                ]"
              >
                {{ formatMessageTime(message.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <div class="flex gap-3">
          <UInput
            v-model="newMessage"
            placeholder="Ketik pesan..."
            :disabled="loading"
            class="flex-1"
            size="lg"
            @keypress.enter="sendMessage"
          />
          <UButton
            :disabled="!isValidMessage(newMessage) || loading"
            :loading="loading"
            icon="i-heroicons-paper-airplane"
            size="lg"
            @click="sendMessage"
          >
            Kirim
          </UButton>
        </div>
      </div>
    </div>

    <!-- Chat List View -->
    <div v-else class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold text-gray-900">Pesan</h1>
        <UButton
          icon="i-heroicons-plus"
          @click="showNewChat = true"
        >
          Chat Baru
        </UButton>
      </div>

      <!-- Search Bar -->
      <div class="p-4 border-b border-gray-200">
        <UInput
          v-model="searchQuery"
          placeholder="Cari percakapan..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
        />
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          class="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
          @click="openChat(conversation.id)"
        >
          <UAvatar
            :src="getPartner(conversation)?.avatar"
            :alt="getPartner(conversation)?.name"
            size="lg"
          >
            <template #fallback>
              {{ getAvatarFallback(getPartner(conversation)?.name || '') }}
            </template>
          </UAvatar>
          
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-1">
              <h3 class="font-medium text-gray-900 truncate">
                {{ getPartner(conversation)?.name }}
              </h3>
              <span class="text-xs text-gray-500 flex-shrink-0">
                {{ formatLastMessageTime(conversation.last_message?.created_at) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 truncate">
              {{ truncateMessage(conversation.last_message?.content || '', 50) }}
            </p>
          </div>
          
          <!-- Unread indicator -->
          <div v-if="conversation.unread_count > 0" class="flex-shrink-0">
            <UBadge color="primary" variant="solid" size="sm">
              {{ conversation.unread_count }}
            </UBadge>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 mb-4" />
          <p class="text-lg font-medium mb-2">Belum ada percakapan</p>
          <p class="text-sm text-center">Mulai percakapan baru dengan menekan tombol "Chat Baru"</p>
        </div>
      </div>
    </div>

    <!-- New Chat Modal -->
    <UModal v-model="showNewChat">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Mulai Chat Baru</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="showNewChat = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="userSearchQuery"
            placeholder="Cari pengguna..."
            icon="i-heroicons-magnifying-glass"
            @input="searchUsers"
          />

          <div class="max-h-64 overflow-y-auto space-y-2">
            <div
              v-for="user in searchResults"
              :key="user.id"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              @click="startChat(user.id)"
            >
              <UAvatar
                :src="user.avatar"
                :alt="user.name"
                size="sm"
              >
                <template #fallback>
                  {{ getAvatarFallback(user.name) }}
                </template>
              </UAvatar>
              <div>
                <p class="font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
            </div>

            <div v-if="userSearchQuery && searchResults.length === 0" class="text-center py-8 text-gray-500">
              <UIcon name="i-heroicons-user-group" class="w-8 h-8 mx-auto mb-2" />
              <p>Tidak ada pengguna ditemukan</p>
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>