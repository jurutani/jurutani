// composables/useChatUtils.ts
import type { Message, Conversation, GroupedMessages } from '~/types/chat'

export const useChatUtils = () => {

  // Format waktu untuk message
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // Jika hari ini
    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Jika kemarin
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.getDate() === yesterday.getDate()) {
      return 'Kemarin'
    }

    // Jika minggu ini
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString('id-ID', { weekday: 'short' })
    }

    // Jika lebih dari seminggu
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    })
  }

  // Format waktu untuk conversation list (last message)
  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // Jika dalam 1 menit
    if (diff < 60 * 1000) {
      return 'Baru saja'
    }

    // Jika dalam 1 jam
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes}m`
    }

    // Jika hari ini
    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Jika kemarin
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.getDate() === yesterday.getDate()) {
      return 'Kemarin'
    }

    // Jika minggu ini
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString('id-ID', { weekday: 'short' })
    }

    // Jika lebih dari seminggu
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    })
  }

  // Truncate message untuk preview
  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength).trim() + '...'
  }

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach(message => {
      const date = new Date(message.created_at)
      const dateKey = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  // Check if message is from current user
  const isOwnMessage = (message: Message, currentUserId: string) => {
    return message.sender_id === currentUserId
  }

  // Get conversation partner
  const getConversationPartner = (conversation: Conversation, currentUserId: string) => {
    return conversation.participant1_id === currentUserId
      ? conversation.participant2
      : conversation.participant1
  }

  // Count unread messages in conversation
  const countUnreadMessages = (messages: Message[], currentUserId: string) => {
    return messages.filter(msg =>
      !msg.is_read && msg.sender_id !== currentUserId
    ).length
  }

  // Get avatar fallback (first letter of full_name)
  const getAvatarFallback = (full_name: string) => {
    return full_name ? full_name.charAt(0).toUpperCase() : '?'
  }

  // Validate message content
  const isValidMessage = (content: string) => {
    return content && content.trim().length > 0 && content.trim().length <= 1000
  }

  // Get conversation title
  const getConversationTitle = (conversation: Conversation, currentUserId: string) => {
    const partner = getConversationPartner(conversation, currentUserId)
    return partner?.full_name || 'Unknown User'
  }

  // Scroll to bottom helper
  const scrollToBottom = (element: HTMLElement, smooth: boolean = true) => {
    if (!element) return

    element.scrollTo({
      top: element.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }

  return {
    formatMessageTime,
    formatLastMessageTime,
    truncateMessage,
    groupMessagesByDate,
    isOwnMessage,
    getConversationPartner,
    countUnreadMessages,
    getAvatarFallback,
    isValidMessage,
    getConversationTitle,
    scrollToBottom
  }
}
