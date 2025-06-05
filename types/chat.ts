// types/chat.ts
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  updated_at: string
  sender?: User
}

export interface Conversation {
  id: string
  created_at: string
  updated_at: string
  last_message?: Message
  unread_count: number
  participants: User[]
  // Helper computed properties
  partner?: User
}

export interface ConversationWithPartner extends Conversation {
  partner: User
}

export interface ChatSearchResult {
  id: string
  full_name: string
  email: string
  avatar_url?: string
}