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

const showActions = ref(false)

const handleImageClick = () => {
  if (props.message.image_url) {
    emit('imageClick', props.message.image_url)
  }
}
</script>

<template>
  <div 
    :class="[
      'flex group relative transition-all duration-200',
      isOwnMessage ? 'justify-end' : 'justify-start'
    ]"
    @mouseenter="showActions = true"
    @mouseleave="showActions = false"
  >
    <!-- Delete button for own messages -->
    <button
      v-if="isOwnMessage && showActions"
      class="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:scale-110"
      @click="$emit('delete', message.id)"
    >
      <UIcon name="i-heroicons-trash" class="w-4 h-4" />
    </button>

    <div 
      :class="[
        'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl transition-all duration-200',
        'hover:shadow-md',
        isOwnMessage 
          ? 'bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-br-md shadow-sm' 
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md shadow-sm'
      ]"
    >
      <!-- Image Message -->
      <div v-if="message.image_url" class="mb-2 -mx-1">
        <img 
          :src="message.image_url" 
          :alt="message.content || 'Gambar'"
          class="max-w-full h-auto rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
          @click="handleImageClick"
        >
      </div>
      
      <!-- Text Content -->
      <p 
        v-if="message.content" 
        :class="[
          'text-[15px] leading-relaxed break-words',
          isOwnMessage ? 'text-white' : 'text-gray-900 dark:text-gray-100'
        ]"
      >
        {{ message.content }}
      </p>
      
      <!-- Timestamp & Status -->
      <div class="flex items-center justify-end gap-1.5 mt-1.5">
        <p 
          :class="[
            'text-[11px] font-medium',
            isOwnMessage 
              ? 'text-green-100 dark:text-green-200' 
              : 'text-gray-500 dark:text-gray-400'
          ]"
        >
          {{ formatTime(message.created_at) }}
        </p>
        
        <!-- Read Receipt for own messages -->
        <UIcon 
          v-if="isOwnMessage"
          name="i-heroicons-check-20-solid"
          :class="[
            'w-3.5 h-3.5',
            'text-green-100 dark:text-green-200'
          ]"
        />
      </div>
    </div>
  </div>
</template>

