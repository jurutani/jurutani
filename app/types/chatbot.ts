/**
 * Chatbot-related type definitions
 * Used by chatbot components
 */

export interface ChatbotMessage {
    id: string
    content: string
    sender: 'user' | 'bot'
    timestamp: string
    type?: 'text' | 'image' | 'file'
}
