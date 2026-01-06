<script setup lang="ts">
interface Message {
  id: string
  content: string
  image_url?: string
  created_at: string
  sender_id: string
}

interface Props {
  message: Message
  isOwnMessage: boolean
  formatTime: (time: string) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [messageId: string]
  imageClick: [imageUrl: string]
}>()

const handleImageClick = () => {
  if (props.message.image_url) {
    emit('imageClick', props.message.image_url)
  }
}
</script>

<template>
  <div 
    :class="[
      'flex group relative',
      isOwnMessage ? 'justify-end' : 'justify-start'
    ]"
  >
    <!-- Delete button for own messages -->
    <button
      v-if="isOwnMessage"
      class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-2 mt-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
      @click="$emit('delete', message.id)"
    >
      <UIcon name="i-heroicons-trash" class="w-4 h-4" />
    </button>

    <div 
      :class="[
        'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl shadow-sm',
        isOwnMessage 
          ? 'bg-green-500 dark:bg-green-600 text-white rounded-br-md' 
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
      ]"
    >
      <!-- Image Message -->
      <div v-if="message.image_url" class="mb-2">
        <img 
          :src="message.image_url" 
          :alt="message.content || 'Gambar'"
          class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="handleImageClick"
        >
      </div>
      
      <!-- Text Content -->
      <p v-if="message.content" class="text-sm leading-relaxed break-words">{{ message.content }}</p>
      
      <!-- Timestamp -->
      <p 
        :class="[
          'text-xs mt-1',
          isOwnMessage 
            ? 'text-green-100 dark:text-green-200' 
            : 'text-gray-500 dark:text-gray-400'
        ]"
      >
        {{ formatTime(message.created_at) }}
      </p>
    </div>
  </div>
</template>
