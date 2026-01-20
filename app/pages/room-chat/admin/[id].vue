<!-- pages/room-chat/[id].vue -->
<script setup lang="ts">
import { toastStore } from '~/composables/useJuruTaniToast'
import { useChat } from '~/composables/useChat'
import { useChatUtils } from '~/composables/useChatUtils'
import { useChatSearch } from '~/composables/useChatSearch'
import { useUserBadge } from '~/composables/useUserBadge'

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
  sendImageMessage,
  subscribeToMessages,
  unsubscribeFromMessages,
  markAsRead,
  deleteMessage,
  clearConversationMessages,
  uploadingImage,
  isValidImageFile
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
const { getBadgeColor, getBadgeName } = useUserBadge()

// Reactive States
const searchQuery = ref('')
const showNewChat = ref(false)
const userSearchQuery = ref('')
const searchResults = ref([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const currentUser = ref(null)
const imageInput = ref<HTMLInputElement>()
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const imageCaption = ref('')
const showImagePreview = ref(false)
const showDeleteConfirm = ref(false)
const messageToDelete = ref<string | null>(null)
const showClearConfirm = ref(false)

const conversationId = computed(() => route.params.id as string)

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
    toastStore.error('Gagal mengirim pesan, Silakan coba lagi nanti')
  }
}

// Image handling methods
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  if (!isValidImageFile(file)) {
    toastStore.error('File harus berupa gambar (JPEG, PNG, GIF, WebP) dan maksimal 10MB')
    return
  }
  
  selectedImage.value = file
  imageCaption.value = ''
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
    showImagePreview.value = true
  }
  reader.readAsDataURL(file)
}

const sendImageMessageChat = async () => {
  if (!selectedImage.value || uploadingImage.value) return
  
  try {
    await sendImageMessage(conversationId.value, selectedImage.value, imageCaption.value)
    
    // Reset image state
    resetImageState()
    
    await nextTick()
    if (messagesContainer.value) scrollToBottom(messagesContainer.value)
    
    toastStore.success('Gambar berhasil dikirim')
  } catch (error) {
    console.error('Gagal mengirim gambar:', error)
    toastStore.error('Gagal mengirim gambar, Silakan coba lagi nanti')
  }
}

const resetImageState = () => {
  selectedImage.value = null
  imagePreview.value = null
  imageCaption.value = ''
  showImagePreview.value = false
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const cancelImagePreview = () => {
  resetImageState()
}

// Message deletion methods
const confirmDeleteMessage = (messageId: string) => {
  messageToDelete.value = messageId
  showDeleteConfirm.value = true
}

const handleDeleteMessage = async () => {
  if (!messageToDelete.value) return
  
  try {
    await deleteMessage(messageToDelete.value)
    toastStore.success('Pesan berhasil dihapus')
  } catch (error) {
    console.error('Gagal menghapus pesan:', error)
    toastStore.error('Gagal menghapus pesan')
  } finally {
    showDeleteConfirm.value = false
    messageToDelete.value = null
  }
}

const cancelDeleteMessage = () => {
  showDeleteConfirm.value = false
  messageToDelete.value = null
}

// Clear conversation methods
const confirmClearConversation = () => {
  showClearConfirm.value = true
}

const handleClearConversation = async () => {
  try {
    await clearConversationMessages(conversationId.value)
    toastStore.success('Semua pesan berhasil dihapus')
  } catch (error) {
    console.error('Gagal menghapus semua pesan:', error)
    toastStore.error('Gagal menghapus semua pesan')
  } finally {
    showClearConfirm.value = false
  }
}

const cancelClearConversation = () => {
  showClearConfirm.value = false
}

const goBack = () => {
  router.push('/room-chat')
}

const handleImageClick = (imageUrl: string) => {
  window.open(imageUrl, '_blank')
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

    if (conversationId.value) {
      await getMessages(conversationId.value)
      await markAsRead(conversationId.value)
      subscribeToMessages(conversationId.value)

      // Fetch conversation data if not already loaded
      let conversationData = currentConversation.value
      if (!conversationData || conversationData.id !== conversationId.value) {
        conversationData = conversations.value.find(c => c.id === conversationId.value)
        if (!conversationData) {
          await getUserConversations()
          conversationData = conversations.value.find(c => c.id === conversationId.value)
        }
        if (conversationData) {
          currentConversation.value = conversationData
        }
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
        <div class="flex items-center gap-2">
          <div class="flex flex-col items-center gap-1">
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
              :color="getBadgeColor(partnerInfo?.role)" 
              variant="solid" 
              size="xs"
            >{{ getBadgeName(partnerInfo?.role) }}</UBadge>
          </div>
          <!-- Clear Conversation Button -->
          <UButton
            icon="i-heroicons-trash"
            color="error"
            variant="ghost"
            size="sm"
            :disabled="messages.length === 0"
            @click="confirmClearConversation"
          >
            Hapus Semua
          </UButton>
        </div>
      </div>

      <!-- Messages Container -->
      <div 
        ref="messagesContainer" 
        class="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4"
      >
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center text-gray-500 dark:text-gray-400">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 mx-auto mb-2" />
            <p>Belum ada pesan</p>
            <p class="text-sm">Mulai percakapan dengan mengirim pesan</p>
          </div>
        </div>

        <div v-for="(messagesGroup, date) in groupedMessages" :key="date" class="space-y-3">
          <!-- Date Separator -->
          <div class="flex justify-center">
            <UBadge variant="soft" color="neutral" size="sm" class="dark:bg-gray-700 dark:text-gray-300">
              {{ date }}
            </UBadge>
          </div>
          
          <!-- Messages -->
          <div 
            v-for="message in messagesGroup" 
            :key="message.id"
            :class="[
              'flex group relative',
              isOwnMessage(message, currentUser?.id) ? 'justify-end' : 'justify-start'
            ]"
          >
            <!-- Delete button for own messages -->
            <button
              v-if="isOwnMessage(message, currentUser?.id)"
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 mt-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
              @click="confirmDeleteMessage(message.id)"
            >
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
            </button>

            <div 
              :class="[
                'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl shadow-sm',
                isOwnMessage(message, currentUser?.id) 
                  ? 'bg-green-500 dark:bg-green-600 text-white rounded-br-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
              ]"
            >
              <!-- Image Message -->
              <div v-if="message.image_url" class="mb-2">
                <img 
                  :src="message.image_url" 
                  :alt="message.content || 'Gambar'"
                  class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  @click="handleImageClick(message.image_url)"
                >
              </div>
              
              <!-- Text Content -->
              <p v-if="message.content" class="text-sm leading-relaxed">{{ message.content }}</p>
              
              <!-- Timestamp -->
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

      <!-- Image Preview Modal -->
      <UModal v-model:open="showImagePreview">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Preview Gambar</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="cancelImagePreview"
            />
          </div>
        </template>

        <template #body>
          <div class="space-y-4">
            <!-- Image Preview -->
            <div v-if="imagePreview" class="flex justify-center">
              <img 
                :src="imagePreview" 
                alt="Preview"
                class="max-w-full max-h-64 object-contain rounded-lg"
              >
            </div>

            <!-- Caption Input -->
            <UTextarea
              v-model="imageCaption"
              placeholder="Tambahkan keterangan (opsional)..."
              :rows="3"
            />
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              :disabled="uploadingImage"
              @click="cancelImagePreview"
            >
              Batal
            </UButton>
            <UButton
              :loading="uploadingImage"
              :disabled="!selectedImage"
              @click="sendImageMessageChat"
            >
              Kirim Gambar
            </UButton>
          </div>
        </template>
      </UModal>

      <!-- Delete Message Confirmation -->
      <UModal v-model:open="showDeleteConfirm">
        <template #header>
          <h3 class="text-lg font-semibold">Hapus Pesan</h3>
        </template>

        <template #body>
          <p class="text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </template>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="cancelDeleteMessage"
            >
              Batal
            </UButton>
            <UButton
              color="error"
              @click="handleDeleteMessage"
            >
              Hapus
            </UButton>
          </div>
        </template>
      </UModal>

      <!-- Clear Conversation Confirmation -->
      <UModal v-model:open="showClearConfirm">
        <template #header>
          <h3 class="text-lg font-semibold">Hapus Semua Pesan</h3>
        </template>

        <template #body>
          <p class="text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus semua pesan dalam percakapan ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </template>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              @click="cancelClearConversation"
            >
              Batal
            </UButton>
            <UButton
              color="error"
              :loading="loading"
              @click="handleClearConversation"
            >
              Hapus Semua
            </UButton>
          </div>
        </template>
      </UModal>

      <!-- Message Input -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-16">
        <div class="flex gap-3">
          <!-- Hidden file input -->
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageSelect"
          >
          
          <!-- Image upload button -->
          <UButton
            icon="i-heroicons-photo"
            color="neutral"
            variant="ghost"
            size="lg"
            :disabled="uploadingImage"
            @click="triggerImageUpload"
          />
          
          <!-- Text input -->
          <UInput
            v-model="newMessage"
            placeholder="Ketik pesan..."
            :disabled="loading || uploadingImage"
            class="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            size="lg"
            @keypress.enter="sendMessage"
          />
          
          <!-- Send button -->
          <UButton
            :disabled="(!isValidMessage(newMessage)) || loading || uploadingImage"
            :loading="loading"
            icon="i-heroicons-paper-airplane"
            size="lg"
            color="success"
            @click="sendMessage"
          >
            Kirim
          </UButton>
        </div>
      </div>
    </div>

    <!-- Chat List View -->
    <div v-else class="flex flex-col h-full items-center justify-center">
      <div class="text-center text-gray-500 dark:text-gray-400">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-xl font-semibold mb-2">Belum ada Percakapan</h2>
        <p>Pilih percakapan dari daftar untuk mulai chat</p>
      </div>
    </div>
  </div>
</template>