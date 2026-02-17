<script setup lang="ts">
interface Message {
  id: string
  content: string
  image_url?: string
  created_at: string
  updated_at?: string
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
  edit: [messageId: string, content: string]
  imageClick: [imageUrl: string]
}>()

const handleImageClick = () => {
  if (props.message.image_url) {
    emit('imageClick', props.message.image_url)
  }
}

const handleCopy = async () => {
  if (props.message.content) {
    try {
      await navigator.clipboard.writeText(props.message.content)
      // Could add toast notification here
      toastStore.success('Pesan berhasil disalin')
    } catch (err) {
      console.error('Failed to copy:', err)
      toastStore.error('Gagal menyalin pesan')
    }
  }
}

const handleEdit = () => {
  emit('edit', props.message.id, props.message.content)
}

const handleDelete = () => {
  emit('delete', props.message.id)
}

// Check if message was edited
const isEdited = computed(() => {
  if (!props.message.updated_at || !props.message.created_at) return false
  const created = new Date(props.message.created_at).getTime()
  const updated = new Date(props.message.updated_at).getTime()
  return updated > created + 1000 // Allow 1 second difference for server processing
})

// Menu items
const menuItems = computed(() => {
  const items = [
    {
      label: 'Copy',
      icon: 'i-lucide-copy',
      onClick: handleCopy,
      disabled: !props.message.content
    }
  ]

  if (props.isOwnMessage) {
    items.push(
      {
        label: 'Edit',
        icon: 'i-lucide-pencil',
        onClick: handleEdit,
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash-2',
        onClick: handleDelete,
      }
    )
  }

  return items
})
</script>

<template>
  <div 
    :class="[
      'flex group relative transition-all duration-200 gap-2',
      isOwnMessage ? 'justify-end' : 'justify-start'
    ]"
  >
    <!-- Message Bubble -->
    <div 
      :class="[
        'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl transition-all duration-200',
        'hover:shadow-md',
        isOwnMessage 
          ? 'bg-linear-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-br-md shadow-sm' 
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
        <!-- Edited Indicator -->
        <span 
          v-if="isEdited"
          :class="[
            'text-[10px] italic',
            isOwnMessage 
              ? 'text-green-100 dark:text-green-200' 
              : 'text-gray-400 dark:text-gray-500'
          ]"
        >
          edited
        </span>
        
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
          name="i-lucide-check"
          :class="[
            'w-3.5 h-3.5',
            'text-green-100 dark:text-green-200'
          ]"
        />
      </div>
    </div>

    <!-- Three Dots Menu Button -->
    <UDropdownMenu
      :items="[menuItems]"
      :popper="{ placement: isOwnMessage ? 'bottom-end' : 'bottom-start' }"
    >
      <UButton
        icon="i-lucide-more-vertical"
        color="neutral"
        variant="ghost"
        size="xs"
        class="shrink-0 self-center"
      />
    </UDropdownMenu>
  </div>
</template>
