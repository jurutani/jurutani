<!-- components/Chat/ConversationItem.vue -->
<script setup lang="ts">
import type { ConversationWithPartner } from '~/types/chat'

interface Props {
  conversation: ConversationWithPartner
}

interface Emits {
  (e: 'click', conversationId: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const { formatLastMessageTime, truncateMessage, getAvatarFallback } = useChatUtils()
</script>

<template>
  <div
    class="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
    @click="$emit('click', conversation.id)"
  >
    <UAvatar
      :src="conversation.partner?.avatar_url"
      :alt="conversation.partner?.full_name || 'User'"
      size="lg"
    >
      <template #fallback>
        {{ getAvatarFallback(conversation.partner?.full_name || 'Unknown') }}
      </template>
    </UAvatar>
    
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center mb-1">
        <h3 class="font-medium text-gray-900 truncate">
          {{ conversation.partner?.full_name || 'Unknown User' }}
        </h3>
        <span class="text-xs text-gray-500 flex-shrink-0">
          {{ formatLastMessageTime(conversation.last_message?.created_at) }}
        </span>
      </div>
      <p class="text-sm text-gray-600 truncate">
        {{ truncateMessage(conversation.last_message?.content || 'Belum ada pesan', 50) }}
      </p>
    </div>
    
    <!-- Unread indicator -->
    <div v-if="conversation.unread_count > 0" class="flex-shrink-0">
      <UBadge color="primary" variant="solid" size="sm">
        {{ conversation.unread_count }}
      </UBadge>
    </div>
  </div>
</template>