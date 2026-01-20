<script setup lang="ts">
  import { toastStore } from '~/composables/useJuruTaniToast'
  import { useChat } from '~/composables/useChat'
  import { useChatUtils } from '~/composables/useChatUtils'
  import { useUserBadge } from '~/composables/useUserBadge'

  const router = useRouter()
  const route = useRoute()

  // Chat composables
  const {
    conversations,
    getUserConversations,
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
    scrollToBottom,
    getConversationPartner,
    getAvatarFallback
  } = useChatUtils()

  const { getBadgeColor, getBadgeName } = useUserBadge()

  // Reactive States
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
  const sendMessage = async () => {
    if (!newMessage.value.trim() || loading.value) return

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

  const { toggleSidebar } = useChatLayout()

  const handleClearMessages = () => {
    confirmClearConversation()
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

      // SEO Optimization untuk chat room (private page)
      useSeoMeta({
        title: 'Room Chat - JuruTani',
        description: 'Room chat untuk berdiskusi dengan pengguna lain di JuruTani',
        robots: 'noindex, follow',
        ogTitle: 'Room Chat - JuruTani',
        ogDescription: 'Ruang percakapan pribadi di JuruTani',
        ogImage: '/og-image.jpg',
      })

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
  <div v-if="conversationId" class="flex flex-col h-full bg-white dark:bg-gray-900">
    <!-- Chat Header -->
    <ChatHeader
      :partner="partnerInfo"
      :messages-count="messages.length"
      :show-back-button="true"
      @back="toggleSidebar"
      @clear-messages="handleClearMessages"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Messages Container - Scrollable -->
    <div 
      ref="messagesContainer" 
      class="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4"
    >
      <!-- Loading Skeleton -->
      <ChatMessageSkeleton v-if="loading && messages.length === 0" :count="5" />
      
      <!-- Empty State -->
      <div v-else-if="messages.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center text-gray-500 dark:text-gray-400 space-y-3">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100">Belum ada pesan</p>
            <p class="text-sm">Mulai percakapan dengan mengirim pesan</p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div v-else class="space-y-4">
        <div v-for="(messagesGroup, date) in groupedMessages" :key="date" class="space-y-3">
          <!-- Date Separator -->
          <div class="flex justify-center">
            <UBadge variant="soft" color="neutral" size="sm" class="dark:bg-gray-700 dark:text-gray-300">
              {{ date }}
            </UBadge>
          </div>
          
          <!-- Messages -->
          <ChatMessageBubble
            v-for="message in messagesGroup"
            :key="message.id"
            :message="message"
            :is-own-message="isOwnMessage(message, currentUser?.id)"
            :format-time="formatMessageTime"
            @delete="confirmDeleteMessage"
            @image-click="handleImageClick"
          />
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
              class="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
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
      <ChatDeleteConfirmModal
        v-model:model-value="showDeleteConfirm"
        title="Hapus Pesan"
        message="Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan."
        @confirm="handleDeleteMessage"
        @cancel="cancelDeleteMessage"
      />

      <!-- Clear Conversation Confirmation -->
      <ChatDeleteConfirmModal
        v-model:model-value="showClearConfirm"
        title="Hapus Semua Pesan"
        message="Apakah Anda yakin ingin menghapus semua pesan dalam percakapan ini? Tindakan ini tidak dapat dibatalkan."
        :loading="loading"
        confirm-text="Hapus Semua"
        @confirm="handleClearConversation"
        @cancel="cancelClearConversation"
      />

    <!-- Message Input - Fixed at bottom -->
    <div class="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageSelect"
      >
      
      <ChatMessageInput
        v-model="newMessage"
        :loading="loading"
        :uploading-image="uploadingImage"
        @send="sendMessage"
        @upload-image="triggerImageUpload"
      />
    </div>
  </div>
  
  <!-- No Conversation Selected -->
  <div v-else class="flex flex-col items-center justify-center h-full p-8">
    <div class="text-center text-gray-500 dark:text-gray-400 space-y-4">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-10 h-10" />
      </div>
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Pilih Percakapan</h2>
        <p>Pilih percakapan dari sidebar untuk mulai chat</p>
      </div>
    </div>
  </div>
</template>