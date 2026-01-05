# Chat Types Documentation

File ini berisi dokumentasi lengkap untuk semua interface dan types yang digunakan dalam fitur chat aplikasi Juru Tani.

## 📁 Lokasi File
`app/types/chat.ts`

## 📋 Daftar Interface

### 1. ChatUser
Interface untuk user profile yang digunakan dalam chat.

```typescript
interface ChatUser {
  id: string
  full_name: string
  avatar_url?: string
  role?: string
  email?: string
  specialization?: string
}
```

**Penggunaan:**
- Digunakan sebagai type untuk `sender` dalam Message
- Digunakan sebagai type untuk `participant1` dan `participant2` dalam Conversation

---

### 2. Message
Interface untuk message dalam conversation.

```typescript
interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  image_url?: string
  created_at: string
  is_read: boolean
  sender?: ChatUser
}
```

**Penggunaan:**
- State messages di `useChat()`
- Parameter di berbagai utility functions
- Return type dari `sendMessage()` dan `getMessages()`

---

### 3. Conversation
Interface untuk conversation/percakapan.

```typescript
interface Conversation {
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
```

**Penggunaan:**
- State conversations di `useChat()`
- Return type dari `getUserConversations()` dan `getOrCreateConversation()`
- Parameter di utility functions

---

### 4. GroupedMessages
Interface untuk messages yang dikelompokkan berdasarkan tanggal.

```typescript
interface GroupedMessages {
  [dateKey: string]: Message[]
}
```

**Penggunaan:**
- Return type dari `groupMessagesByDate()` di `useChatUtils()`
- Digunakan untuk menampilkan messages dengan date separator

---

### 5. UserSearchResult
Interface untuk hasil pencarian user.

```typescript
interface UserSearchResult {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  role?: string
}
```

**Penggunaan:**
- Return type dari `searchUsers()` di `useChatSearch()`
- Digunakan di ChatNewChatModal untuk menampilkan hasil pencarian

---

### 6. ConversationPartner
Interface untuk informasi partner dalam conversation.

```typescript
interface ConversationPartner {
  id: string
  full_name: string
  avatar_url?: string
  role?: string
  specialization?: string
}
```

**Penggunaan:**
- Return type dari `getConversationPartner()` di `useChatUtils()`
- Digunakan untuk menampilkan info partner di chat UI

---

### 7. MessageInputState
Interface untuk state input message.

```typescript
interface MessageInputState {
  content: string
  imageFile?: File
  imagePreview?: string
}
```

**Penggunaan:**
- State management di komponen chat input
- Tracking user input dan image preview

---

### 8. ImageUploadOptions
Interface untuk opsi upload gambar.

```typescript
interface ImageUploadOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSize?: number
}
```

**Penggunaan:**
- Parameter untuk `compressImage()` function
- Konfigurasi image compression

---

### 9. ChatState
Interface untuk state management chat.

```typescript
interface ChatState {
  messages: Message[]
  conversations: Conversation[]
  currentConversation: Conversation | null
  loading: boolean
  error: string | null
  uploadingImage: boolean
}
```

**Penggunaan:**
- Dokumentasi state yang dikelola oleh `useChat()`
- Reference untuk state management

---

### 10. DeleteConfirmModalProps
Interface untuk props modal konfirmasi delete.

```typescript
interface DeleteConfirmModalProps {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: 'danger' | 'warning'
}
```

**Penggunaan:**
- Props untuk ChatDeleteConfirmModal component
- Konfigurasi modal konfirmasi

---

## 🎨 Types

### RoleBadgeColor
Type untuk warna badge role.

```typescript
type RoleBadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
```

**Penggunaan:**
- Return type dari `getRoleBadgeColor()` function
- Menentukan warna badge berdasarkan role user

---

### MessageEventType
Type untuk event types realtime message.

```typescript
type MessageEventType = 'INSERT' | 'UPDATE' | 'DELETE'
```

**Penggunaan:**
- Realtime subscription di `subscribeToMessages()`
- Event handling untuk perubahan messages

---

## 📊 Constants

### CHAT_CONSTANTS
Konstanta yang digunakan di seluruh fitur chat.

```typescript
const CHAT_CONSTANTS = {
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
```

**Penggunaan:**
- Validasi message length
- Validasi image upload
- Konfigurasi image compression
- Konfigurasi search behavior

---

## 🛡️ Type Guards

### isMessage()
Memeriksa apakah object adalah Message.

```typescript
const isMessage = (obj: any): obj is Message => {
  return obj && typeof obj.id === 'string' && typeof obj.conversation_id === 'string'
}
```

### isConversation()
Memeriksa apakah object adalah Conversation.

```typescript
const isConversation = (obj: any): obj is Conversation => {
  return obj && typeof obj.id === 'string' && typeof obj.participant1_id === 'string'
}
```

**Penggunaan:**
- Runtime type checking
- Validasi data dari API/database

---

## 📦 Import & Export

### Import di Composables

```typescript
// useChat.ts
import type { Message, Conversation, ChatState, ImageUploadOptions } from '~/types/chat'
import { CHAT_CONSTANTS } from '~/types/chat'

// useChatUtils.ts
import type { Message, Conversation, GroupedMessages } from '~/types/chat'

// useChatSearch.ts
import type { Conversation, Message, UserSearchResult } from '~/types/chat'
```

### Import di Components

```typescript
// Di Vue components
import type { Message, Conversation, UserSearchResult } from '~/types/chat'
import { CHAT_CONSTANTS } from '~/types/chat'
```

---

## 🔄 Migration dari Old Code

### Sebelum (Old)
```typescript
// useChat.ts
export interface Message {
  id: string
  // ...
}

export interface Conversation {
  id: string
  // ...
}
```

### Sesudah (New)
```typescript
// useChat.ts
import type { Message, Conversation } from '~/types/chat'
export type { Message, Conversation } from '~/types/chat'
```

---

## ✅ Benefits

1. **Centralized Types** - Semua types di satu tempat
2. **Reusability** - Mudah digunakan di berbagai file
3. **Maintainability** - Mudah di-maintain dan di-update
4. **Type Safety** - TypeScript type checking yang lebih baik
5. **Documentation** - Lebih mudah didokumentasikan
6. **Consistency** - Konsisten di seluruh aplikasi

---

## 📝 Best Practices

1. **Selalu import types dengan `type` keyword**
   ```typescript
   import type { Message } from '~/types/chat'
   ```

2. **Gunakan constants untuk magic numbers**
   ```typescript
   if (message.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH) {
     // ...
   }
   ```

3. **Gunakan type guards untuk runtime checking**
   ```typescript
   if (isMessage(data)) {
     // TypeScript knows data is Message
   }
   ```

4. **Export types yang perlu digunakan di luar**
   ```typescript
   export type { Message, Conversation } from '~/types/chat'
   ```

---

## 🔗 Related Files

- `app/composables/useChat.ts` - Main chat composable
- `app/composables/useChatUtils.ts` - Chat utility functions
- `app/composables/useChatSearch.ts` - Chat search functionality
- `app/components/Chat/*` - Chat components
- `app/pages/room-chat/*` - Chat pages

---

**Last Updated:** 2026-01-05
**Version:** 1.0.0
