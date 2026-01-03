<!-- components/chat/NewChatModal.vue -->
<script setup lang="ts">
interface User {
  id: string
  full_name: string
  email: string
  avatar_url?: string
}

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  startChat: [userId: string]
}>()

const { searchUsers: searchUsersUtil } = useChatSearch()
const { getAvatarFallback } = useChatUtils()

const userSearchQuery = ref('')
const searchResults = ref<User[]>([])
const searchingUsers = ref(false)

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const searchUsers = async () => {
  if (userSearchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }
  
  try {
    searchingUsers.value = true
    const { getCurrentUser } = useChat()
    const currentUser = await getCurrentUser()
    const results = await searchUsersUtil(userSearchQuery.value, currentUser?.id)
    searchResults.value = results || []
  } catch (error) {
    // console.error('Failed to search users:', error)
    searchResults.value = []
  } finally {
    searchingUsers.value = false
  }
}

const handleStartChat = (userId: string) => {
  emit('startChat', userId)
  closeModal()
}

const closeModal = () => {
  showModal.value = false
  userSearchQuery.value = ''
  searchResults.value = []
}

// Reset search when modal opens
watch(showModal, (isOpen) => {
  if (isOpen) {
    userSearchQuery.value = ''
    searchResults.value = []
  }
})
</script>

<template>
  <UModal v-model="showModal">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Mulai Chat Baru</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>

      <div class="space-y-4">
        <!-- User Search -->
        <UInput
          v-model="userSearchQuery"
          placeholder="Cari pengguna..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          :loading="searchingUsers"
          @input="searchUsers"
        />

        <!-- Search Results -->
        <div class="max-h-80 overflow-y-auto">
          <div v-if="searchingUsers" class="flex items-center justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary-500" />
            <span class="ml-2 text-gray-500">Mencari pengguna...</span>
          </div>

          <div v-else-if="searchResults.length > 0" class="space-y-1">
            <div
              v-for="user in searchResults"
              :key="user.id"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 group"
              @click="handleStartChat(user.id)"
            >
              <UAvatar
                :src="user.avatar_url"
                :alt="user.full_name"
                size="sm"
              >
                <template #fallback>
                  {{ getAvatarFallback(user.full_name) }}
                </template>
              </UAvatar>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {{ user.full_name }}
                </p>
                <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
              </div>
              <UIcon 
                name="i-heroicons-chevron-right" 
                class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
              />
            </div>
          </div>

          <div v-else-if="userSearchQuery && !searchingUsers" class="text-center py-8">
            <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500 font-medium mb-1">Tidak ada pengguna ditemukan</p>
            <p class="text-sm text-gray-400">Coba kata kunci lain</p>
          </div>

          <div v-else class="text-center py-8">
            <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">Mulai ketik untuk mencari pengguna</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton
            color="gray"
            variant="soft"
            @click="closeModal"
          >
            Batal
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>