<!-- pages/admin-chat/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  deleteConversation,
  loading 
} = useChat()

const { 
  formatLastMessageTime, 
  truncateMessage, 
  getConversationPartner,
  getAvatarFallback 
} = useChatUtils()

// Admin ID
const ADMIN_ID = 'ce967618-14a4-41f9-a814-f919be31e545'

// Reactive data
const currentUser = ref(null)
const deletingConversationId = ref(null)
const adminUser = ref(null)
const hasAdminConversation = ref(false)

// Methods
const getPartner = (conversation) => {
  if (!currentUser.value) return null
  return getConversationPartner(conversation, currentUser.value.id)
}

const openChat = (conversationId: string) => {
  router.push(`/room-chat/${conversationId}`)
}

const startChatWithAdmin = async () => {
  try {
    const conversation = await getOrCreateConversation(ADMIN_ID)
    
    toast.add({
      title: 'Berhasil',
      description: 'Chat dengan admin telah dibuat',
      color: 'green'
    })
    
    router.push(`/room-chat/${conversation.id}`)
  } catch (error) {
    console.error('Failed to start chat with admin:', error)
    toastStore.error('Gagal membuat chat dengan admin')
  }
}

// Handle delete conversation
const handleDeleteConversation = async (conversationId: string) => {
  try {
    deletingConversationId.value = conversationId
    
    await deleteConversation(conversationId)
    
    toastStore.success('Percakapan berhasil dihapus')
    
    // Refresh conversations list
    await getUserConversations()
    checkAdminConversation()
  } catch (error) {
    console.error('Failed to delete conversation:', error)
    toastStore.error('Gagal menghapus percakapan')
  } finally {
    deletingConversationId.value = null
  }
}

// Check if user already has conversation with admin
const checkAdminConversation = () => {
  if (!currentUser.value || !conversations.value) return
  
  hasAdminConversation.value = conversations.value.some(conv => {
    return conv.participant1_id === ADMIN_ID || conv.participant2_id === ADMIN_ID
  })
}

// Get admin conversations only
const adminConversations = computed(() => {
  if (!currentUser.value || !conversations.value) return []
  
  return conversations.value.filter(conv => {
    return conv.participant1_id === ADMIN_ID || conv.participant2_id === ADMIN_ID
  })
})

// Get admin user info
const getAdminUser = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('id', ADMIN_ID)
      .single()
    
    if (error) throw error
    adminUser.value = data
  } catch (error) {
    console.error('Failed to get admin user:', error)
  }
}

// Lifecycle
onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser()
    await Promise.all([
      getUserConversations(),
      getAdminUser()
    ])
    checkAdminConversation()
  } catch (error) {
    console.error('Failed to load data:', error)
    toastStore.error('Gagal memuat data')
  }
})

// Watch conversations for changes
watch(conversations, () => {
  checkAdminConversation()
})

// Meta
useHead({
  title: 'Chat Admin - JuruTani',
  meta: [
    { name: 'description', content: 'Chat langsung dengan admin JuruTani' }
  ]
})
</script>

<template>
  <div class="flex flex-col h-screen max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl">
    <!-- Header -->
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
          <h1 class="text-2xl font-bold text-green-800 dark:text-green-300">Chat Admin</h1>
          <p class="text-sm text-green-600 dark:text-green-400">Hubungi admin JuruTani</p>
        </div>
      </div>
      
      <!-- Chat with Admin Button -->
      <UButton
        v-if="!hasAdminConversation"
        icon="i-heroicons-chat-bubble-left-right"
        color="green"
        :loading="loading"
        @click="startChatWithAdmin"
      >
        Chat dengan Admin
      </UButton>
    </div>

    <!-- Loading State -->
    <ChatLoadingState v-if="loading" />

    <!-- Content -->
    <div v-else class="flex-1 overflow-y-auto bg-gradient-to-br from-white to-green-25 dark:from-gray-900 dark:to-gray-900">
      <!-- Admin Info Card (if no conversation exists) -->
      <div v-if="!hasAdminConversation && adminUser" class="p-6">
        <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-green-100 dark:border-gray-700 p-6">
          <div class="flex items-center gap-4 mb-4">
            <UAvatar
              :src="adminUser.avatar_url"
              :alt="adminUser.full_name"
              size="lg"
              class="ring-2 ring-green-200 dark:ring-green-800"
            >
              <template #fallback>
                {{ getAvatarFallback(adminUser.full_name) }}
              </template>
            </UAvatar>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ adminUser.full_name }}
              </h3>
              <UBadge color="green" variant="soft">
                Admin
              </UBadge>
            </div>
          </div>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Hubungi admin untuk bantuan teknis, pertanyaan tentang platform, atau masalah lainnya yang memerlukan bantuan langsung.
          </p>
          
          <UButton
            icon="i-heroicons-chat-bubble-left-right"
            color="green"
            block
            :loading="loading"
            @click="startChatWithAdmin"
          >
            Mulai Chat dengan Admin
          </UButton>
        </div>
      </div>

      <!-- Conversation List (if conversation exists) -->
      <div v-if="hasAdminConversation" class="divide-y divide-green-100 dark:divide-gray-700">
        <ChatConversationItem
          v-for="conversation in adminConversations"
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

      <!-- Empty State (if no admin user found) -->
      <div
        v-if="!loading && !adminUser"
        class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400"
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 mb-4 text-yellow-400" />
        <p class="text-lg font-semibold">Admin tidak ditemukan</p>
        <p class="text-sm text-center mt-2">
          Silakan hubungi support untuk bantuan lebih lanjut
        </p>
      </div>
    </div>
  </div>
</template>