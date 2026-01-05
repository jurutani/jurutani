// types/chat.ts
// Interface dan types untuk fitur chat

/**
 * Interface untuk user profile yang digunakan dalam chat
 */
export interface ChatUser {
    id: string
    full_name: string
    avatar_url?: string
    role?: string
    email?: string
    specialization?: string
}

/**
 * Interface untuk message dalam conversation
 */
export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    image_url?: string
    created_at: string
    is_read: boolean
    sender?: ChatUser
}

/**
 * Interface untuk conversation/percakapan
 */
export interface Conversation {
    id: string
    participant1_id: string
    participant2_id: string
    last_message?: string
    last_message_at?: string
    created_at: string
    updated_at: string
    unread_count?: number
    participant1?: ChatUser
    participant2?: ChatUser
}

/**
 * Interface untuk grouped messages by date
 */
export interface GroupedMessages {
    [dateKey: string]: Message[]
}

/**
 * Interface untuk search result user
 */
export interface UserSearchResult {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    role?: string
}

/**
 * Type untuk role badge color
 */
export type RoleBadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

/**
 * Interface untuk conversation partner info
 */
export interface ConversationPartner {
    id: string
    full_name: string
    avatar_url?: string
    role?: string
    specialization?: string
}

/**
 * Interface untuk message input state
 */
export interface MessageInputState {
    content: string
    imageFile?: File
    imagePreview?: string
}

/**
 * Interface untuk image upload options
 */
export interface ImageUploadOptions {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    maxSize?: number
}

/**
 * Interface untuk chat state
 */
export interface ChatState {
    messages: Message[]
    conversations: Conversation[]
    currentConversation: Conversation | null
    loading: boolean
    error: string | null
    uploadingImage: boolean
}

/**
 * Interface untuk chat utils return type
 */
export interface ChatUtils {
    formatMessageTime: (timestamp: string) => string
    formatLastMessageTime: (timestamp: string) => string
    truncateMessage: (message: string, maxLength?: number) => string
    groupMessagesByDate: (messages: Message[]) => GroupedMessages
    isOwnMessage: (message: Message, currentUserId: string) => boolean
    getConversationPartner: (conversation: Conversation, currentUserId: string) => ChatUser | undefined
    countUnreadMessages: (messages: Message[], currentUserId: string) => number
    getAvatarFallback: (full_name: string) => string
    isValidMessage: (content: string) => boolean
    getConversationTitle: (conversation: Conversation, currentUserId: string) => string
    scrollToBottom: (element: HTMLElement, smooth?: boolean) => void
}

/**
 * Interface untuk chat search return type
 */
export interface ChatSearch {
    searchUsers: (query: string, excludeUserId?: string) => Promise<UserSearchResult[]>
    searchConversations: (conversations: Conversation[], query: string, currentUserId: string) => Conversation[]
    searchMessages: (messages: Message[], query: string) => Message[]
}

/**
 * Type untuk message event types
 */
export type MessageEventType = 'INSERT' | 'UPDATE' | 'DELETE'

/**
 * Interface untuk realtime message payload
 */
export interface RealtimeMessagePayload {
    new?: Message
    old?: Message
    eventType: MessageEventType
}

/**
 * Interface untuk delete confirmation modal props
 */
export interface DeleteConfirmModalProps {
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    loading?: boolean
    variant?: 'danger' | 'warning'
}

/**
 * Constants untuk chat
 */
export const CHAT_CONSTANTS = {
    MAX_MESSAGE_LENGTH: 1000,
    MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    IMAGE_COMPRESSION: {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.8
    },
    SEARCH_MIN_LENGTH: 2,
    SEARCH_DEBOUNCE_MS: 300
} as const

/**
 * Type guards
 */
export const isMessage = (obj: any): obj is Message => {
    return obj && typeof obj.id === 'string' && typeof obj.conversation_id === 'string'
}

export const isConversation = (obj: any): obj is Conversation => {
    return obj && typeof obj.id === 'string' && typeof obj.participant1_id === 'string'
}
