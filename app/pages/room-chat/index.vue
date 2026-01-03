<!-- pages/room-chat/index.vue - Fixed Delete Conversation Function -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toastStore } from '~/composables/useJuruTaniToast'

// Emits
const emit = defineEmits(['update:searchQuery'])

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

const { searchConversations, searchUsers: searchUsersUtil } = useChatSearch()

// Reactive data
const searchQuery = ref('')
const showNewChat = ref(false)
const userSearchQuery = ref('')
const searchResults = ref([])
const searchingUsers = ref(false)
const currentUser = ref(null)
const deletingConversationId = ref(null)

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
  showNewChat.value = true
}

const startChat = async (userId: string) => {
  try {
    const conversation = await getOrCreateConversation(userId)
    showNewChat.value = false
    userSearchQuery.value = ''
    searchResults.value = []
    
    toast.add({
      title: 'Berhasil',
      description: 'Chat baru dengan ahli pertanian telah dibuat',
      color: 'green'
    })
    
    router.push(`/room-chat/${conversation.id}`)
  } catch (error) {
    // console.error('Failed to start chat:', error)
    toastStore.error('Gagal membuat chat baru')
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
    
    toastStore.success('Percakapan berhasil dihapus')
    
    // Refresh conversations list
    await getUserConversations()
  } catch (error) {
    // console.error('Failed to delete conversation:', error)
    toastStore.error('Gagal menghapus percakapan')
  } finally {
    deletingConversationId.value = null
  }
}

// Search users for new chat
const searchUsers = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }
  
  try {
    searchingUsers.value = true
    searchResults.value = await searchUsersUtil(query.trim())
  } catch (error) {
    // console.error('Failed to search users:', error)
    toastStore.error('Gagal mencari pengguna')
    searchResults.value = []
  } finally {
    searchingUsers.value = false
  }
}

// Watch for user search query changes
watch(userSearchQuery, (newQuery) => {
  searchUsers(newQuery)
}, { debounce: 500 })

// Lifecycle
onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser()
    await getUserConversations()
  } catch (error) {
    // console.error('Failed to load conversations:', error)
    toastStore.error('Gagal memuat conversation')
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
  <div class="flex flex-col h-screen max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl">
    <!-- Chat Header Component -->
    <div class="flex items-center justify-between p-4 border-b border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <NuxtLink 
          to="/discussions" 
          class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
          aria-label="Kembali ke Diskusi"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>        
        <div>
          <h1 class="text-2xl font-bold text-green-800 dark:text-green-300">Juru Tani Chat</h1>
          <p class="text-sm text-green-600 dark:text-green-400">Konsultasi dengan ahli pertanian</p>
        </div>
      </div>
      
      <!-- New Chat Button -->
      <UButton
        icon="i-heroicons-plus"
        color="green"
        @click="handleNewChat"
      >
        Chat Baru
      </UButton>
    </div>

    <!-- Search Bar -->
    <div class="p-4 border-b border-green-100 dark:border-gray-700 bg-green-25 dark:bg-gray-800">
      <UInput
        :model-value="searchQuery"
        placeholder="Cari conversation dengan petani atau ahli..."
        icon="i-heroicons-magnifying-glass"
        size="lg"
        color="green"
        variant="outline"
        class="w-full"
        :ui="{
          icon: { 
            trailing: { pointer: '' },
            base: 'text-green-500 dark:text-green-400'
          },
          base: 'border-green-200 dark:border-gray-600 focus:border-green-400 dark:focus:border-green-500 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
          placeholder: 'placeholder-gray-500 dark:placeholder-gray-400'
        }"
        @update:model-value="updateSearchQuery"
      />
      
      <!-- Search Results Count -->
      <div v-if="searchQuery.trim()" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {{ filteredConversations.length }} conversation ditemukan
        <UButton
          variant="ghost"
          size="xs"
          color="gray"
          @click="handleClearSearch"
        >
          Bersihkan
        </UButton>
      </div>
    </div>

    <!-- Loading State Component -->
    <ChatLoadingState v-if="loading" />

    <!-- Conversation List -->
    <div v-else class="flex-1 overflow-y-auto bg-gradient-to-br from-white to-green-25 dark:from-gray-900 dark:to-gray-900">
      <div class="divide-y divide-green-100 dark:divide-gray-700">
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

      <!-- Empty State Component -->
      <div
        v-if="!loading && filteredConversations.length === 0"
        class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
      >
        <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-10 h-10 mb-4 text-green-400" />
        <p class="text-lg font-semibold">Belum ada percakapan dimulai</p>
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
            placeholder="Cari pengguna (nama, email, atau role)..."
            icon="i-heroicons-magnifying-glass"
            size="lg"
            class="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            :loading="searchingUsers"
          />

          <!-- Search Results -->
          <div class="max-h-64 overflow-y-auto space-y-2">
            <div v-if="searchingUsers" class="text-center py-4">
              <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 mx-auto mb-2 animate-spin text-green-500" />
              <p class="text-sm text-gray-500 dark:text-gray-400">Mencari pengguna...</p>
            </div>

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
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <p class="font-medium text-gray-900 dark:text-gray-100">{{ user.full_name }}</p>
                  <UBadge 
                    v-if="user.role === 'pakar'"
                    color="green" 
                    variant="soft" 
                    size="xs"
                  >
                    Pakar
                  </UBadge>
                  <UBadge 
                    v-else-if="user.role === 'penyuluh'"
                    color="blue" 
                    variant="soft" 
                    size="xs"
                  >
                    Penyuluh
                  </UBadge>
                  <UBadge 
                    v-else-if="user.role === 'admin'"
                    color="green" 
                    variant="soft" 
                    size="xs"
                  >
                    Admin
                  </UBadge>
                  <UBadge 
                    v-else-if="user.role === 'petani'"
                    color="gray" 
                    variant="soft" 
                    size="xs"
                  >
                    Petani
                  </UBadge>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
              </div>
            </div>

            <!-- No Results -->
            <div v-if="userSearchQuery && !searchingUsers && searchResults.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-user-group" class="w-8 h-8 mx-auto mb-2" />
              <p class="font-medium">Tidak ada pengguna ditemukan</p>
              <p class="text-sm">Coba kata kunci yang berbeda</p>
            </div>

            <!-- Initial State -->
            <div v-if="!userSearchQuery" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 mx-auto mb-2" />
              <p class="font-medium">Cari Pengguna</p>
              <p class="text-sm">Masukkan nama, email, atau role untuk mencari pengguna</p>
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>