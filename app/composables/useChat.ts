// composables/useChat.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  image_url?: string
  created_at: string
  is_read: boolean
  sender?: {
    id: string
    full_name: string
    avatar_url?: string
    role?: string
  }
}

export interface Conversation {
  id: string
  participant1_id: string
  participant2_id: string
  last_message?: string
  last_message_at?: string
  created_at: string
  updated_at: string
  participant1?: {
    id: string
    full_name: string
    avatar_url?: string
    role?: string
  }
  participant2?: {
    id: string
    full_name: string
    avatar_url?: string
    role?: string
  }
}

export const useChat = () => {
  const messages = ref<Message[]>([])
  const conversations = ref<Conversation[]>([])
  const currentConversation = ref<Conversation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const uploadingImage = ref(false)

  let messageSubscription: any = null

  // Get current user
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Compress image function
  const compressImage = (file: File, maxWidth = 800, maxHeight = 600, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Upload image to storage
  const uploadImage = async (file: File): Promise<string> => {
    try {
      uploadingImage.value = true
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      // Compress image before upload
      const compressedFile = await compressImage(file)

      const fileExt = compressedFile.name.split('.').pop()
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`
      
      const { data, error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, compressedFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to upload image'
      throw err
    } finally {
      uploadingImage.value = false
    }
  }

  // Send image message
  const sendImageMessage = async (conversationId: string, imageFile: File, caption?: string) => {
    try {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      // Upload image first
      const imageUrl = await uploadImage(imageFile)

      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: caption?.trim() || '',
          image_url: imageUrl,
          is_read: false
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, role)
        `)
        .single()

      if (sendError) throw sendError

      // Update conversation last_message
      await supabase
        .from('conversations')
        .update({
          last_message: caption?.trim() || '📷 Image',
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send image'
      throw err
    }
  }

  // Get atau create conversation antara 2 user
  const getOrCreateConversation = async (otherUserId: string) => {
    try {
      loading.value = true
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      // Cek apakah conversation sudah ada
      const { data: existingConversation, error: fetchError } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url, role),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url, role)
        `)
        .or(`and(participant1_id.eq.${currentUser.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${currentUser.id})`)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (existingConversation) {
        currentConversation.value = existingConversation
        return existingConversation
      }

      // Buat conversation baru
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: currentUser.id,
          participant2_id: otherUserId
        })
        .select(`
          *,
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url, role),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url, role)
        `)
        .single()

      if (createError) throw createError

      currentConversation.value = newConversation
      return newConversation
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get conversation'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get semua conversations untuk user
  const getUserConversations = async () => {
    try {
      loading.value = true
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url, role),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url, role)
        `)
        .or(`participant1_id.eq.${currentUser.id},participant2_id.eq.${currentUser.id}`)
        .order('updated_at', { ascending: false })

      if (fetchError) throw fetchError

      conversations.value = data || []
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch conversations'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get messages dalam conversation
  const getMessages = async (conversationId: string) => {
    try {
      loading.value = true
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, role)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      messages.value = data || []
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch messages'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Kirim message
  const sendMessage = async (conversationId: string, content: string, imageFile?: File) => {
    try {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: content.trim(),
          image_url: imageUrl,
          is_read: false
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, role)
        `)
        .single()

      if (sendError) throw sendError

      // Update conversation last_message
      await supabase
        .from('conversations')
        .update({
          last_message: content.trim() || (imageUrl ? '📷 Image' : ''),
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)

      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send message'
      throw err
    }
  }

  // Delete conversation (enhanced with image cleanup)
  const deleteConversation = async (conversationId: string) => {
    try {
      loading.value = true
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      // First get all messages with images to delete from storage
      const { data: messagesWithImages } = await supabase
        .from('messages')
        .select('image_url')
        .eq('conversation_id', conversationId)
        .not('image_url', 'is', null)

      // Delete images from storage
      if (messagesWithImages && messagesWithImages.length > 0) {
        const imageUrls = messagesWithImages.map(msg => msg.image_url).filter(Boolean)
        for (const imageUrl of imageUrls) {
          try {
            // Extract file path from public URL
            const urlParts = imageUrl.split('/chat-images/')
            if (urlParts.length > 1) {
              const filePath = urlParts[1]
              await supabase.storage.from('chat-images').remove([filePath])
            }
          } catch (imgError) {
            console.error('Failed to delete image:', imgError)
          }
        }
      }

      // Delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId)

      if (messagesError) throw messagesError

      // Then delete the conversation
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)
        .or(`participant1_id.eq.${currentUser.id},participant2_id.eq.${currentUser.id}`)

      if (conversationError) throw conversationError

      // Remove from local state
      conversations.value = conversations.value.filter(c => c.id !== conversationId)
      
      if (currentConversation.value?.id === conversationId) {
        currentConversation.value = null
        messages.value = []
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete conversation'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete single message (enhanced with image cleanup)
  const deleteMessage = async (messageId: string) => {
    try {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      // First get the message to check if it has an image
      const { data: messageToDelete } = await supabase
        .from('messages')
        .select('image_url')
        .eq('id', messageId)
        .eq('sender_id', currentUser.id)
        .single()

      if (messageToDelete?.image_url) {
        try {
          // Extract file path from public URL and delete from storage
          const urlParts = messageToDelete.image_url.split('/chat-images/')
          if (urlParts.length > 1) {
            const filePath = urlParts[1]
            await supabase.storage.from('chat-images').remove([filePath])
          }
        } catch (imgError) {
          console.error('Failed to delete image:', imgError)
        }
      }

      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', currentUser.id) // Only allow deleting own messages

      if (deleteError) throw deleteError

      // Remove from local state
      messages.value = messages.value.filter(m => m.id !== messageId)

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete message'
      throw err
    }
  }

  // Clear all messages in a conversation (keep conversation)
  const clearConversationMessages = async (conversationId: string) => {
    try {
      loading.value = true
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      // Get all messages with images to delete from storage
      const { data: messagesWithImages } = await supabase
        .from('messages')
        .select('image_url')
        .eq('conversation_id', conversationId)
        .not('image_url', 'is', null)

      // Delete images from storage
      if (messagesWithImages && messagesWithImages.length > 0) {
        const imageUrls = messagesWithImages.map(msg => msg.image_url).filter(Boolean)
        for (const imageUrl of imageUrls) {
          try {
            const urlParts = imageUrl.split('/chat-images/')
            if (urlParts.length > 1) {
              const filePath = urlParts[1]
              await supabase.storage.from('chat-images').remove([filePath])
            }
          } catch (imgError) {
            console.error('Failed to delete image:', imgError)
          }
        }
      }

      // Delete all messages
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId)

      if (deleteError) throw deleteError

      // Update conversation to clear last message
      await supabase
        .from('conversations')
        .update({
          last_message: null,
          last_message_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)

      // Clear local messages
      messages.value = []

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to clear messages'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mark messages as read
  const markAsRead = async (conversationId: string) => {
    try {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) return

      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', currentUser.id)
        .eq('is_read', false)
    } catch (err) {
      console.error('Failed to mark messages as read:', err)
    }
  }

  // Subscribe ke realtime messages
  const subscribeToMessages = (conversationId: string) => {
    if (messageSubscription) {
      messageSubscription.unsubscribe()
    }

    messageSubscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Fetch message dengan sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, role)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            messages.value.push(data)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          messages.value = messages.value.filter(m => m.id !== payload.old.id)
        }
      )
      .subscribe()
  }

  // Unsubscribe dari realtime
  const unsubscribeFromMessages = () => {
    if (messageSubscription) {
      messageSubscription.unsubscribe()
      messageSubscription = null
    }
  }

  // Get other participant dalam conversation
  const getOtherParticipant = async () => {
    if (!currentConversation.value) return null

    const currentUser = await getCurrentUser()
    if (!currentUser) return null

    const conv = currentConversation.value
    return conv.participant1_id === currentUser.id 
      ? conv.participant2 
      : conv.participant1
  }

  // Get unread message count for a conversation
  const getUnreadCount = computed(() => {
    return (conversationId: string) => {
      return messages.value.filter(m => 
        m.conversation_id === conversationId && 
        !m.is_read && 
        m.sender_id !== getCurrentUser()?.id
      ).length
    }
  })

  // Check if file is valid image
  const isValidImageFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize
  }

  // Cleanup
  onUnmounted(() => {
    unsubscribeFromMessages()
  })

  return {
    // State
    messages,
    conversations,
    currentConversation,
    loading,
    error,
    uploadingImage,

    // Methods
    getOrCreateConversation,
    getUserConversations,
    getMessages,
    sendMessage,
    sendImageMessage,
    uploadImage,
    compressImage,
    deleteConversation,
    deleteMessage,
    clearConversationMessages,
    markAsRead,
    subscribeToMessages,
    unsubscribeFromMessages,
    getOtherParticipant,
    getCurrentUser,
    isValidImageFile,

    // Computed
    getUnreadCount
  }
}