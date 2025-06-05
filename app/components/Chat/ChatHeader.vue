<!-- components/chat/ChatHeader.vue -->
<script setup lang="ts">
interface Props {
  partnerInfo?: {
    id: string
    full_name: string
    avatar_url?: string
    email?: string
  } | null
  showBackButton?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  title: 'Chat'
})

const emit = defineEmits<{
  back: []
  newChat: []
}>()

const { getAvatarFallback } = useChatUtils()

const handleBack = () => {
  emit('back')
}

const handleNewChat = () => {
  emit('newChat')
}
</script>

<template>
  <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
    <div class="flex items-center gap-3">
      <UButton
        v-if="showBackButton"
        icon="i-heroicons-arrow-left"
        variant="ghost"
        size="sm"
        @click="handleBack"
      />
      
      <!-- Partner Info (untuk chat individual) -->
      <template v-if="partnerInfo">
        <UAvatar
          :src="partnerInfo.avatar_url"
          :alt="partnerInfo.full_name"
          size="md"
        >
          <template #fallback>
            {{ getAvatarFallback(partnerInfo.full_name || '') }}
          </template>
        </UAvatar>
        <div>
          <h2 class="font-semibold text-gray-900">{{ partnerInfo.full_name }}</h2>
          <p class="text-sm text-gray-500">Online</p>
        </div>
      </template>
      
      <!-- Title (untuk daftar chat) -->
      <h1 v-else class="text-2xl font-bold text-gray-900">{{ title }}</h1>
    </div>

    <!-- New Chat Button (hanya tampil di daftar chat) -->
    <UButton
      v-if="!partnerInfo"
      icon="i-heroicons-plus"
      color="primary"
      variant="solid"
      @click="handleNewChat"
    >
      Chat Baru
    </UButton>
  </div>
</template>