<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

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
const ADMIN_ID = 'dcbee036-0c31-43de-93b8-4e0e05d6498c'

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
    const conversation = await getOrCreateConversation(ADMIN_ID) as any
    if (!conversation) {
      throw new Error('Failed to create conversation with admin')
    }
    
    toast.add({
      title: 'Berhasil',
      description: 'Chat dengan admin telah dibuat',
      color: 'success'
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
    <ChatRoomHeader
      title="Chat Admin"
      subtitle="Hubungi admin JuruTani"
      back-to="/discussions"
      back-label="Kembali ke Diskusi"
      :show-action-button="!hasAdminConversation"
      action-button-label="Chat dengan Admin"
      action-button-icon="heroicons:chat-bubble-left-right"
      action-button-color="success"
      :action-button-loading="loading"
      @action="startChatWithAdmin"
    />

    <!-- Loading State -->
    <ChatLoadingState v-if="loading" />

    <!-- Content -->
    <div v-else class="flex-1 overflow-y-auto bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-900">
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
              <UBadge color="success" variant="soft">
                Admin
              </UBadge>
            </div>
          </div>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Hubungi admin untuk bantuan teknis, pertanyaan tentang platform, atau masalah lainnya yang memerlukan bantuan langsung.
          </p>
          
          <UButton
            icon="heroicons:chat-bubble-left-right"
            color="success"
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
        <UIcon name="heroicons:user-circle" class="w-10 h-10 mb-4 text-blue-500" />
        <p class="text-lg font-semibold">Ada pertanyaan lebih lanjut?</p>
        <p class="text-sm text-center mt-2">
          Silakan hubungi tim support kami untuk bantuan
        </p>
      </div>
    </div>
  </div>
</template>