<!-- pages/room-chat/index.vue - Halaman daftar conversation -->
 <script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toastStore } from '~/composables/useJuruTaniToast'

// Composables
const router = useRouter()
const toast = useToast()

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

// Reactive data
const searchQuery = ref('')
const showNewChat = ref(false)
const userSearchQuery = ref('')
const searchResults = ref([])
const searchingUsers = ref(false)
const currentUser = ref(null)

// Computed properties
const filteredConversations = computed(() => {
  if (!currentUser.value || !conversations.value) return []
  return searchConversations(conversations.value, searchQuery.value, currentUser.value.id)
})

// Methods
const getPartner = (conversation) => {
  if (!currentUser.value) return null
  return getConversationPartner(conversation, currentUser.value.id)
}

const openChat = (conversationId: string) => {
  router.push(`/room-chat/${conversationId}`)
}

const startChat = async (userId: string) => {
  try {
    const conversation = await getOrCreateConversation(userId)
    showNewChat.value = false
    userSearchQuery.value = ''
    searchResults.value = []
    
    toast.add({
      title: 'Berhasil',
      description: 'Chat baru telah dibuat',
      color: 'green'
    })
    
    router.push(`/room-chat/${conversation.id}`)
  } catch (error) {
    console.error('Failed to start chat:', error)
    toastStore.error('Gagal memulai chat', 'Terjadi kesalahan saat membuat chat baru')
  }
}

const searchUsers = async () => {
  if (userSearchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }
  
  try {
    searchingUsers.value = true
    const results = await searchUsersUtil(userSearchQuery.value, currentUser.value?.id)
    searchResults.value = results || []
  } catch (error) {
    console.error('Failed to search users:', error)
    toastStore.error('Gagal mencari pengguna', 'Terjadi kesalahan saat mencari pengguna')
  } finally {
    searchingUsers.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser()
    await getUserConversations()
  } catch (error) {
    console.error('Failed to load conversations:', error)
    toastStore.error('Gagal memuat conversation', 'Terjadi kesalahan saat mengambil data conversation')
  }
})

// Meta
useHead({
  title: 'Chat - Daftar Conversation'
})
</script>
<template>
  <div class="flex flex-col h-screen max-w-4xl mx-auto bg-white">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <h1 class="text-2xl font-bold text-gray-900">Chat</h1>
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        variant="solid"
        @click="showNewChat = true"
      >
        Chat Baru
      </UButton>
    </div>

    <!-- Search Bar -->
    <div class="p-4 border-b border-gray-200">
      <UInput
        v-model="searchQuery"
        placeholder="Cari conversation..."
        icon="i-heroicons-magnifying-glass"
        size="lg"
        class="w-full"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
        <p class="text-gray-500">Memuat conversation...</p>
      </div>
    </div>

    <!-- Conversation List -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="divide-y divide-gray-100">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
          @click="openChat(conversation.id)"
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
            
            <!-- Role Badge -->
            <UBadge
              v-if="getPartner(conversation)?.role"
              color="green"
              variant="soft"
              size="xs"
              class="absolute -top-1 -right-1"
            >
              {{ getPartner(conversation).role }}
            </UBadge>
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
      <div v-if="!loading && filteredConversations.length === 0" class="flex flex-col items-center justify-center h-64 px-4">
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
            @click="showNewChat = true"
          >
            Mulai Chat Baru
          </UButton>
        </div>
      </div>
    </div>

    <!-- New Chat Modal -->
    <UModal v-model="showNewChat">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Mulai Chat Baru</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              class="-my-1"
              @click="showNewChat = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <!-- User Search -->
          <UInput
            v-model="userSearchQuery"
            placeholder="Cari pengguna..."
            icon="i-heroicons-magnifying-glass"
            size="lg"
            :loading="searchingUsers"
            @input="searchUsers"
          />

          <!-- Search Results -->
          <div class="max-h-80 overflow-y-auto">
            <div v-if="searchingUsers" class="flex items-center justify-center py-8">
              <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
              <span class="ml-2 text-gray-500">Mencari pengguna...</span>
            </div>

            <div v-else-if="searchResults.length > 0" class="space-y-1">
              <div
                v-for="user in searchResults"
                :key="user.id"
                class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 group"
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
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                    {{ user.full_name }}
                  </p>
                  <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
                </div>
                <UIcon 
                  name="i-heroicons-chevron-right" 
                  class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                />
              </div>
            </div>

            <div v-else-if="userSearchQuery && !searchingUsers" class="text-center py-8">
              <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 font-medium mb-1">Tidak ada pengguna ditemukan</p>
              <p class="text-sm text-gray-400">Coba kata kunci lain</p>
            </div>

            <div v-else class="text-center py-8">
              <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">Mulai ketik untuk mencari pengguna</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="gray"
              variant="soft"
              @click="showNewChat = false"
            >
              Batal
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

