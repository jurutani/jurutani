<script setup lang="ts">
import { useUserProfile } from '~/composables/useUserProfile'
import { toastStore } from '~/composables/useJuruTaniToast'
import { onClickOutside } from '@vueuse/core'

const { navsSecondary } = useNavMenu()
const { logout } = useAuth()
const { profile, avatarUrl, isAuthenticated } = useUserProfile()

const isOpen = ref(false)
const dropdownRef = ref(null)

const handleLogout = async () => {
  const result = await logout()
  
  if (result.success) {
    toastStore.success('Berhasil logout')
    isOpen.value = false
    await navigateTo('/')
    window.location.reload()
  } else {
    toastStore.error('Gagal logout')
    console.error('Logout failed:', result.error)
  }
}

const handleMenuClick = (to?: string) => {
  if (to) {
    navigateTo(to)
    isOpen.value = false
  }
}

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      type="button"
      class="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-full transition-all duration-200 hover:scale-105"
      :aria-label="isAuthenticated ? 'User menu' : 'Guest menu'"
      @click="isOpen = !isOpen"
    >
      <NavAvatar
        :src="avatarUrl"
        :alt="profile?.displayName || 'Guest'"
        size="md"
        :show-online-indicator="true"
        :is-authenticated="isAuthenticated"
      />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="fixed left-1/2 -translate-x-1/2 top-16 sm:absolute sm:left-auto sm:right-0 sm:translate-x-0 sm:top-auto mt-0 sm:mt-2 w-[calc(100vw-1rem)] max-w-[360px] sm:w-72 lg:w-80 bg-white dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-2xl shadow-xl z-[70] overflow-hidden"
      >
        <!-- User Info Section -->
        <div class="p-4 border-b border-green-200 dark:border-green-800">
          <div v-if="isAuthenticated && profile" class="flex items-center gap-3 mb-3">
            <NavAvatar
              :src="avatarUrl"
              :alt="profile.displayName"
              size="lg"
              :is-authenticated="true"
            />
            
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {{ profile.displayName }}
              </p>
              <p class="text-xs text-green-600 dark:text-green-400 truncate">
                {{ profile.email }}
              </p>
            </div>
          </div>

          <!-- Profile Actions -->
          <div class="flex items-center justify-center sm:justify-start">
            <NavProfileActions />
          </div>
        </div>

        <!-- Logout Button (Full Width) -->
        <div v-if="isAuthenticated" class="p-3 border-b border-green-200 dark:border-green-800">
          <UButton
            block
            color="error"
            size="lg"
            icon="i-heroicons-arrow-left-on-rectangle"
            @click="handleLogout"
          >
            Logout
          </UButton>
        </div>

        <!-- Auth Buttons (for non-authenticated users) -->
        <div v-else class="p-3 border-b border-green-200 dark:border-green-800 space-y-2">
          <UButton
            block
            color="success"
            size="lg"
            icon="i-heroicons-arrow-right-on-rectangle"
            to="/auth/login"
            @click="isOpen = false"
          >
            Sign In
          </UButton>
          <UButton
            block
            color="success"
            variant="outline"
            size="lg"
            icon="i-heroicons-user-plus"
            to="/auth/register"
            @click="isOpen = false"
          >
            Register
          </UButton>
        </div>

        <!-- Secondary Menu Grid (2 Columns) -->
        <div v-if="navsSecondary && navsSecondary.length > 0" class="p-3">
          <div class="grid grid-cols-2 gap-2">
            <UButton
              v-for="nav in navsSecondary"
              :key="nav.to"
              :to="nav.to"
              color="success"
              variant="ghost"
              class="!h-auto !p-3 flex-col gap-1.5"
              @click="isOpen = false"
            >
              <UIcon 
                :name="nav.icon" 
                class="size-6 text-green-600 dark:text-green-400" 
              />
              <span class="text-xs font-medium text-gray-700 dark:text-gray-200 text-center">
                {{ nav.title }}
              </span>
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
button {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:active {
  transform: scale(0.95);
}
</style>
