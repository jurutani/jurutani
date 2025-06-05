// composables/useChat.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();
export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  is_read: boolean
  sender?: {
    id: string
    full_name: string
    avatar_url?: string
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
  }
  participant2?: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

export const useChat = () => {
  const messages = ref<Message[]>([])
  const conversations = ref<Conversation[]>([])
  const currentConversation = ref<Conversation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  let messageSubscription: any = null

  // Get current user (sesuaikan dengan auth system Anda)
  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
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
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url)
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
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url)
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
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, avatar_url),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, avatar_url)
        `)
        .or(`participant1_id.eq.${currentUser.id},participant2_id.eq.${currentUser.id}`)
        .order('updated_at', { ascending: false })

      if (fetchError) throw fetchError

      conversations.value = data || []
      console.log('Conversations:', conversations.value)
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
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      messages.value = data || []
      console.log('Messages:', messages.value)
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch messages'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Kirim message
  const sendMessage = async (conversationId: string, content: string) => {
    try {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) throw new Error('User not authenticated')

      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: content.trim(),
          is_read: false
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
        `)
        .single()

      if (sendError) throw sendError

      // Update conversation last_message
      await supabase
        .from('conversations')
        .update({
          last_message: content.trim(),
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
              sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            messages.value.push(data)
          }
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

    // Methods
    getOrCreateConversation,
    getUserConversations,
    getMessages,
    sendMessage,
    markAsRead,
    subscribeToMessages,
    unsubscribeFromMessages,
    getOtherParticipant,
    getCurrentUser
  }
}