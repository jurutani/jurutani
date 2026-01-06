<!-- Example: User Card Component -->
<script setup lang="ts">
import { useUserBadge } from '~/composables/useUserBadge'

interface User {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  role?: string
}

const props = defineProps<{
  user: User
}>()

const { getBadgeColor, getBadgeName, getBadgeDescription, isExpertRole } = useUserBadge()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <div class="flex items-center gap-3">
      <!-- Avatar -->
      <UAvatar
        :src="user.avatar_url"
        :alt="user.full_name"
        size="lg"
      />
      
      <!-- User Info -->
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100">
            {{ user.full_name }}
          </h3>
          
          <!-- Role Badge using useUserBadge -->
          <UBadge 
            v-if="user.role"
            :color="getBadgeColor(user.role)"
            variant="soft"
            size="sm"
            :title="getBadgeDescription(user.role)"
          >
            {{ getBadgeName(user.role) }}
          </UBadge>
          
          <!-- Expert Indicator -->
          <UIcon 
            v-if="isExpertRole(user.role)"
            name="i-heroicons-check-badge-solid"
            class="w-5 h-5 text-green-500"
            title="Verified Expert"
          />
        </div>
        
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ user.email }}
        </p>
      </div>
    </div>
  </div>
</template>
