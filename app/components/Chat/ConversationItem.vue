<!-- components/chat/ConversationItem.vue -->
<script setup lang="ts">
interface Partner {
  id: string
  full_name: string
  avatar_url?: string
  role?: string
  specialization?: string
}

interface Conversation {
  id: string
  last_message?: string
  last_message_at?: string
  unread_count?: number
}

interface Props {
  conversation: Conversation
  partner: Partner | null
  formatLastMessageTime: (time: string) => string
  truncateMessage: (message: string, length: number) => string
  getAvatarFallback: (name: string) => string
}

defineProps<Props>()
defineEmits(['openChat'])

// JuruTani specific role handling
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'pakar':
    case 'expert':
      return 'emerald'
    case 'penyuluh':
    case 'instructor':
      return 'blue'
    case 'admin':
      return 'purple'
    default:
      return 'gray'
  }
}

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'pakar':
    case 'expert':
      return 'Ahli JuruTani'
    case 'penyuluh':
    case 'instructor':
      return 'Penyuluh JuruTani'
    case 'admin':
      return 'Admin'
    default:
      return role
  }
}
</script>

<template>
  <div
    class="flex items-center gap-4 p-4 
           hover:bg-green-25 dark:hover:bg-green-900/20 
           cursor-pointer transition-all duration-200 group 
           border-l-4 border-transparent 
           hover:border-green-400 dark:hover:border-green-500
           dark:bg-gray-800 bg-white"
    @click="$emit('openChat', conversation.id)"
  >
    <!-- Avatar with JuruTani styling -->
    <div class="relative">
      <UAvatar
        :src="partner?.avatar_url"
        :alt="partner?.full_name"
        size="xl"
        class="ring-3 ring-green-100 dark:ring-green-800 
               group-hover:ring-green-200 dark:group-hover:ring-green-700 
               transition-all duration-200"
        :ui="{ 
          background: 'bg-green-100 dark:bg-green-800' 
        }"
      >
        <template #fallback>
          <span class="text-green-700 dark:text-green-300 font-semibold text-lg">
            {{ getAvatarFallback(partner?.full_name || '') }}
          </span>
        </template>
      </UAvatar>
      
      <!-- Online Status -->
      <div
class="absolute -bottom-1 -right-1 w-5 h-5 
                  bg-green-400 dark:bg-green-500 
                  border-3 border-white dark:border-gray-800 
                  rounded-full shadow-sm" />
    </div>
    
    <!-- Conversation Info -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1 min-w-0">
          <h3
class="font-bold text-lg 
                    text-gray-900 dark:text-gray-100 
                    truncate 
                    group-hover:text-green-700 dark:group-hover:text-green-400 
                    transition-colors leading-tight">
            {{ partner?.full_name }}
          </h3>
          
          <!-- Role Badge for JuruTani experts, now below the name -->
          <UBadge
            :color="getRoleBadgeColor(partner?.role || '')"
            variant="solid"
            size="sm"
            class="mt-1"
          >
            {{ getRoleDisplayName(partner?.role || '') }}
          </UBadge>
          
          <p
v-if="partner?.specialization" 
             class="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
            {{ partner.specialization }}
          </p>
        </div>
        
        <div class="flex flex-col items-end gap-1 ml-3">
          <span class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {{ conversation.last_message_at ? formatLastMessageTime(conversation.last_message_at) : '' }}
          </span>
          
          <!-- Unread Badge -->
          <UBadge 
            v-if="conversation.unread_count && conversation.unread_count > 0"
            color="green"
            variant="solid"
            size="sm"
            class="flex-shrink-0 shadow-sm animate-pulse"
          >
            {{ conversation.unread_count > 99 ? '99+' : conversation.unread_count }}
          </UBadge>
        </div>
      </div>
      
      <div class="flex items-center justify-between">
        <p
class="text-sm text-gray-600 dark:text-gray-300 
                 truncate pr-2 leading-relaxed">
          {{ truncateMessage(conversation.last_message || 'Belum ada pesan...', 65) }}
        </p>
      </div>
    </div>
    
    <!-- Chevron with agricultural icon -->
    <div class="flex flex-col items-center gap-1">
      <UIcon 
        name="i-heroicons-chevron-right" 
        class="w-5 h-5 text-green-400 dark:text-green-500 
               group-hover:text-green-600 dark:group-hover:text-green-400 
               transition-colors flex-shrink-0"
      />
      <UIcon 
        v-if="partner?.role === 'pakar'"
        name="i-heroicons-academic-cap" 
        class="w-3 h-3 text-green-500 dark:text-green-400"
      />
      <UIcon 
        v-else-if="partner?.role === 'penyuluh'"
        name="i-heroicons-megaphone" 
        class="w-3 h-3 text-blue-500 dark:text-blue-400"
      />
      <UIcon 
        v-else
        name="i-heroicons-user" 
        class="w-3 h-3 text-gray-400 dark:text-gray-500"
      />
    </div>
  </div>
</template>