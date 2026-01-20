<script setup lang="ts">
import type { ConversationPartner } from '~/types/chat'

interface Props {
  partner: ConversationPartner | null
  messagesCount?: number
  showBackButton?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'back': []
  'clearMessages': []
  'toggleSidebar': []
}>()

const { getBadgeColor, getBadgeName } = useUserBadge()
const { getAvatarFallback } = useChatUtils()
</script>

<template>
  <div class="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
    <div class="flex items-center justify-between">
      <!-- Left: Partner Info -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- Mobile: Sidebar Toggle -->
        <UButton
          v-if="showBackButton"
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="neutral"
          size="sm"
          class="lg:hidden"
          @click="emit('toggleSidebar')"
        />
        
        <!-- Partner Avatar & Info -->
        <div v-if="partner" class="flex items-center gap-3 min-w-0">
          <div class="relative">
            <UAvatar
              :src="partner.avatar_url"
              :alt="partner.full_name"
              size="md"
            >
              <template #fallback>
                {{ getAvatarFallback(partner.full_name || '') }}
              </template>
            </UAvatar>
            <!-- Online Status Indicator -->
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 dark:bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
          </div>
          
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {{ partner.full_name }}
            </h3>
            <div class="flex items-center gap-2">
              <UBadge 
                :color="getBadgeColor(partner.role)" 
                variant="solid" 
                size="xs"
              >
                {{ getBadgeName(partner.role) }}
              </UBadge>
              <span class="text-xs text-gray-500 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>
        
        <div v-else class="flex items-center gap-3">
          <USkeleton class="w-10 h-10 rounded-full" />
          <div class="space-y-2">
            <USkeleton class="w-32 h-4" />
            <USkeleton class="w-20 h-3" />
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-2">
        <!-- Clear Messages Button -->
        <UButton
          v-if="messagesCount && messagesCount > 0"
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          size="sm"
          :disabled="!messagesCount"
          @click="emit('clearMessages')"
        >
          <span class="hidden sm:inline">Hapus Semua</span>
        </UButton>
      </div>
    </div>
  </div>
</template>
