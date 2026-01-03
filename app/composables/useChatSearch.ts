import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();

// composables/useChatSearch.ts
export const useChatSearch = () => {
  const searchUsers = async (query: string, excludeUserId?: string) => {
    try {
      if (!query || query.trim().length < 2) {
        return []
      }

      let searchQuery = supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role')
        .ilike('full_name', `%${query.trim()}%`)
        .limit(10)

      if (excludeUserId) {
        searchQuery = searchQuery.neq('id', excludeUserId)
      }

      const { data, error } = await searchQuery

      if (error) throw error

      return data || []
    } catch (error) {
      // console.error('Error searching users:', error)
      return []
    }
  }

  const searchConversations = (conversations: Conversation[], query: string, currentUserId: string) => {
    if (!query || query.trim().length === 0) {
      return conversations
    }

    const searchTerm = query.toLowerCase().trim()

    return conversations.filter(conversation => {
      const partner = conversation.participant1_id === currentUserId
        ? conversation.participant1
        : conversation.participant2

      const partnerName = partner?.full_name?.toLowerCase() || ''
      const lastMessage = conversation.last_message?.toLowerCase() || ''

      return partnerName.includes(searchTerm) || lastMessage.includes(searchTerm)
    })
  }

  const searchMessages = (messages: Message[], query: string) => {
    if (!query || query.trim().length === 0) {
      return messages
    }

    const searchTerm = query.toLowerCase().trim()

    return messages.filter(message =>
      message.content.toLowerCase().includes(searchTerm)
    )
  }

  return {
    searchUsers,
    searchConversations,
    searchMessages
  }
}