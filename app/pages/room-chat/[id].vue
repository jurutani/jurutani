<!-- pages/room-chat/[id].vue -->
<script setup lang="ts">
import { toastStore } from '~/composables/useJuruTaniToast'
import { useChat } from '~/composables/useChat'
import { useChatUtils } from '~/composables/useChatUtils'
import { useChatSearch } from '~/composables/useChatSearch'

const router = useRouter()
const route = useRoute()

// Chat composables
const {
  conversations,
  getUserConversations,
  getOrCreateConversation,
  getCurrentUser,
  loading,
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
  scrollToBottom,
  formatLastMessageTime,
  truncateMessage,
  getConversationPartner,
  getAvatarFallback
} = useChatUtils()

const { searchConversations, searchUsers: searchUsersUtil } = useChatSearch()

// Reactive States
const searchQuery = ref('')
const showNewChat = ref(false)
const userSearchQuery = ref('')
const searchResults = ref([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const currentUser = ref(null)

const conversationId = computed(() => route.params.id as string)

const filteredConversations = computed(() => {
  if (!currentUser.value) return []
  return searchConversations(conversations.value, searchQuery.value, currentUser.value.id)
})

const groupedMessages = computed(() => {
  return groupMessagesByDate(messages.value)
})

const getParticipant = () => {
  if (!currentConversation.value || !currentUser.value) return null

  const participant = getConversationPartner(currentConversation.value, currentUser.value.id)
  console.log('Participant:', participant)
  return participant
}
const partnerInfo = computed(() => {
  return getParticipant()
})

// Methods
const getPartner = (conversation) => {
  if (!currentUser.value) return null
  return getConversationPartner(conversation, currentUser.value.id)
}

const openChat = async (id: string) => {
  try {
    await getMessages(id)
    router.push(`/room-chat/${id}`)
  } catch (error) {
    console.error('Gagal membuka percakapan:', error)
    toastStore.error('Gagal membuka percakapan', 'Silakan coba lagi nanti')
  }
}

const startChat = async (userId: string) => {
  try {
    const conversation = await getOrCreateConversation(userId)
    showNewChat.value = false
    router.push(`/room-chat/${conversation.id}`)
  } catch (error) {
    console.error('Gagal memulai chat:', error)
    toastStore.error('Gagal memulai chat', 'Silakan coba lagi nanti')
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
    console.error('Gagal mencari pengguna:', error)
  }
}

const sendMessage = async () => {
  if (!isValidMessage(newMessage.value) || loading.value) return

  try {
    const content = newMessage.value.trim()
    newMessage.value = ''
    await sendChatMessage(conversationId.value, content)

    await nextTick()
    if (messagesContainer.value) scrollToBottom(messagesContainer.value)
  } catch (error) {
    console.error('Gagal mengirim pesan:', error)
    toastStore.error('Gagal mengirim pesan', 'Silakan coba lagi nanti')
  }
}

const goBack = () => {
  router.push('/room-chat')
}

// Watch messages for auto-scroll
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) scrollToBottom(messagesContainer.value)
}, { deep: true })

// Lifecycle
onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser()
    console.log('Current User:', currentUser.value)

    if (conversationId.value) {
      console.log('Conversation ID:', conversationId.value)
      await getMessages(conversationId.value)
      await markAsRead(conversationId.value)
      subscribeToMessages(conversationId.value)

      // Fetch conversation data if not already loaded
      let conversationData = currentConversation.value
      if (!conversationData || conversationData.id !== conversationId.value) {
        // Try to find in conversations list
        conversationData = conversations.value.find(c => c.id === conversationId.value)
        if (!conversationData) {
          // If not found, fetch all conversations
          await getUserConversations()
          conversationData = conversations.value.find(c => c.id === conversationId.value)
        }
        if (conversationData) {
          currentConversation.value = conversationData
        }
      }
      console.log('Conversation Data:', conversationData)

      // Get participant info
      if (conversationData && currentUser.value) {
        const participant = getConversationPartner(conversationData, currentUser.value.id)
        console.log('Participant Info:', participant)
      }

      await nextTick()
      if (messagesContainer.value) {
        scrollToBottom(messagesContainer.value, false)
      }
    } else {
      await getUserConversations()
    }
  } catch (error) {
    console.error('Gagal memuat data chat:', error)
    if (conversationId.value) router.push('/room-chat')
  }
})

onUnmounted(() => {
  unsubscribeFromMessages()
})
</script>


<template>
  <div class="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-gray-900">
    <!-- Back Button -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button 
            class="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            @click="goBack"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            <span class="font-medium">Kembali ke Room Chat</span>
          </button>
          <div class="flex items-center gap-2 text-green-700 dark:text-green-300">
            <UIcon name="i-heroicons-newspaper" class="w-5 h-5" />
            <span class="font-semibold">JuruTani Room Chat</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Chat Room View -->
    <div v-if="conversationId" class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="partnerInfo?.avatar_url"
            :alt="partnerInfo?.full_name"
            size="md"
          >
            <template #fallback>
              {{ getAvatarFallback(partnerInfo?.full_name || '') }}
            </template>
          </UAvatar>
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100 text-lg md:text-xl">{{ partnerInfo?.full_name }}</p>
            <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>
        <div class="flex flex-col items-center gap-1 ml-4">
          <UIcon 
            v-if="partnerInfo?.role === 'pakar'"
            name="i-heroicons-academic-cap" 
            class="w-4 h-4 text-green-500 dark:text-green-400"
          />
          <UIcon 
            v-else-if="partnerInfo?.role === 'penyuluh'"
            name="i-heroicons-megaphone" 
            class="w-4 h-4 text-blue-500 dark:text-blue-400"
          />
          <UIcon 
            v-else
            name="i-heroicons-user" 
            class="w-4 h-4 text-gray-400 dark:text-gray-500"
          />
          <UBadge 
            color="green" 
            variant="solid" 
            size="xs"
          >{{ partnerInfo?.role }}</UBadge>
        </div>
      </div>

      <!-- Messages Container -->
      <div 
        ref="messagesContainer" 
        class="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4"
      >
        <div v-for="(messagesGroup, date) in groupedMessages" :key="date" class="space-y-3">
          <!-- Date Separator -->
          <div class="flex justify-center">
            <UBadge variant="soft" color="gray" size="sm" class="dark:bg-gray-700 dark:text-gray-300">
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
                  ? 'bg-green-500 dark:bg-green-600 text-white rounded-br-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
              ]"
            >
              <p class="text-sm leading-relaxed">{{ message.content }}</p>
              <p 
                :class="[
                  'text-xs mt-1',
                  isOwnMessage(message, currentUser?.id) 
                    ? 'text-green-100 dark:text-green-200' 
                    : 'text-gray-500 dark:text-gray-400'
                ]"
              >
                {{ formatMessageTime(message.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-16">
        <div class="flex gap-3">
          <UInput
            v-model="newMessage"
            placeholder="Ketik pesan..."
            :disabled="loading"
            class="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            size="lg"
            @keypress.enter="sendMessage"
          />
          <UButton
            :disabled="!isValidMessage(newMessage) || loading"
            :loading="loading"
            icon="i-heroicons-paper-airplane"
            size="lg"
            color="green"
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
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Pesan</h1>
        <UButton
          icon="i-heroicons-plus"
          color="green"
          @click="showNewChat = true"
        >
          Chat Baru
        </UButton>
      </div>

      <!-- Search Bar -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <UInput
          v-model="searchQuery"
          placeholder="Cari percakapan..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          class="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          class="flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors"
          @click="openChat(conversation.id)"
        >
          <UAvatar
            :src="getPartner(conversation)?.avatar_url"
            :alt="getPartner(conversation)?.full_name"
            size="lg"
          >
            <template #fallback>
              {{ getAvatarFallback(getPartner(conversation)?.full_name || '') }}
            </template>
          </UAvatar>
          
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-1">
              <h3 class="font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ getPartner(conversation)?.full_name }}
              </h3>
              <span class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {{ formatLastMessageTime(conversation.last_message?.created_at) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 truncate">
              {{ truncateMessage(conversation.last_message?.content || '', 50) }}
            </p>
          </div>
          
          <!-- Unread indicator -->
          <div v-if="conversation.unread_count > 0" class="flex-shrink-0">
            <UBadge color="green" variant="solid" size="sm">
              {{ conversation.unread_count }}
            </UBadge>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 mb-4" />
          <p class="text-lg font-medium mb-2">Belum ada percakapan</p>
          <p class="text-sm text-center">Mulai percakapan baru dengan menekan tombol "Chat Baru"</p>
        </div>
      </div>
    </div>

    <!-- New Chat Modal -->
    <UModal v-model="showNewChat">
      <UCard class="dark:bg-gray-800 dark:border-gray-700">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Mulai Chat Baru</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              class="dark:text-gray-400 dark:hover:text-gray-300"
              @click="showNewChat = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="userSearchQuery"
            placeholder="Cari pengguna..."
            icon="i-heroicons-magnifying-glass"
            class="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            @input="searchUsers"
          />

          <div class="max-h-64 overflow-y-auto space-y-2">
            <div
              v-for="user in searchResults"
              :key="user.id"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
              @click="startChat(user.id)"
            >
              <UAvatar
                :src="user.avatar_url"
                :alt="user.full_name"
                size="sm"
              >
                <template #fallback>
                  {{ getAvatarFallback(user.full_name) }}
                </template>
              </UAvatar>
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ user.full_name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
              </div>
            </div>

            <div v-if="userSearchQuery && searchResults.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-user-group" class="w-8 h-8 mx-auto mb-2" />
              <p>Tidak ada pengguna ditemukan</p>
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>