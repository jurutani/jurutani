<script setup lang="ts">
interface User {
  id: string
  full_name: string
  email: string
  avatar_url?: string
  role?: string
}

interface Props {
  modelValue: boolean
  onStartChat?: (userId: string) => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  startChat: [userId: string]
}>()

const { searchUsers: searchUsersUtil } = useChatSearch()
const { getAvatarFallback } = useChatUtils()
const { getBadgeColor, getBadgeName } = useUserBadge()

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const userSearchQuery = ref('')
const searchResults = ref<User[]>([])
const searchingUsers = ref(false)

// Search users function
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
    console.error('Failed to search users:', error)
    searchResults.value = []
  } finally {
    searchingUsers.value = false
  }
}

// Watch with debounce using VueUse
watchDebounced(
  userSearchQuery,
  () => {
    searchUsers()
  },
  { debounce: 300 }
)

const handleStartChat = (userId: string) => {
  props.onStartChat?.(userId)
  emit('startChat', userId)
  showModal.value = false
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <UModal v-model:open="showModal">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon 
          name="heroicons:chat-bubble-left-right"
          class="w-6 h-6 text-green-500"
        />
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Mulai Chat Baru
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Cari pengguna untuk memulai percakapan
          </p>
        </div>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <UInput
          v-model="userSearchQuery"
          placeholder="Cari pengguna (nama, email, atau role)..."
          icon="heroicons:magnifying-glass"
          size="lg"
          class="w-full"
          :loading="searchingUsers"
        />

        <div class="max-h-64 overflow-y-auto space-y-2">
          <!-- Loading State -->
          <div v-if="searchingUsers" class="text-center py-4">
            <UIcon name="heroicons:arrow-path" class="w-6 h-6 mx-auto mb-2 animate-spin text-green-500" />
            <p class="text-sm text-gray-500 dark:text-gray-400">Mencari pengguna...</p>
          </div>

          <!-- Search Results -->
          <div
            v-for="user in searchResults"
            :key="user.id"
            class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
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
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ user.full_name }}</p>
                <UBadge 
                  v-if="user.role"
                  :color="getBadgeColor(user.role)"
                  variant="soft" 
                  size="xs"
                >
                  {{ getBadgeName(user.role) }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
            </div>
          </div>

          <!-- No Results -->
          <div v-if="userSearchQuery && !searchingUsers && searchResults.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon name="heroicons:user-group" class="w-8 h-8 mx-auto mb-2" />
            <p class="font-medium">Tidak ada pengguna ditemukan</p>
            <p class="text-sm">Coba kata kunci yang berbeda</p>
          </div>

          <!-- Initial State -->
          <div v-if="!userSearchQuery" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon name="heroicons:magnifying-glass" class="w-8 h-8 mx-auto mb-2" />
            <p class="font-medium">Cari Pengguna</p>
            <p class="text-sm">Masukkan nama, email, atau role untuk mencari pengguna</p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <UButton
          color="error"
          variant="solid"
          @click="closeModal"
        >
          Tutup
        </UButton>
      </div>
    </template>
  </UModal>
</template>
