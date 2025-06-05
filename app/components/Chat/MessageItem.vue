<!-- components/Chat/MessageItem.vue -->
<script setup lang="ts">
import type { Message } from '~/types/chat'

interface Props {
  message: Message
  isOwn: boolean
}

defineProps<Props>()

const { formatMessageTime } = useChatUtils()
</script>

<template>
  <div 
    :class="[
      'flex',
      isOwn ? 'justify-end' : 'justify-start'
    ]"
  >
    <div 
      :class="[
        'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl shadow-sm',
        isOwn 
          ? 'bg-primary-500 text-white rounded-br-md' 
          : 'bg-white text-gray-900 rounded-bl-md'
      ]"
    >
      <p class="text-sm leading-relaxed">{{ message.content }}</p>
      <p 
        :class="[
          'text-xs mt-1',
          isOwn 
            ? 'text-primary-100' 
            : 'text-gray-500'
        ]"
      >
        {{ formatMessageTime(message.created_at) }}
      </p>
    </div>
  </div>
</template>