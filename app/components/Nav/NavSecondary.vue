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
        class="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[400px] max-w-md bg-white dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-2xl shadow-xl z-[70] overflow-hidden"
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
          <button
            type="button"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            @click="handleLogout"
          >
            <UIcon name="heroicons:arrow-left-on-rectangle" class="size-5" />
            <span>Logout</span>
          </button>
        </div>

        <!-- Auth Buttons (for non-authenticated users) -->
        <div v-else class="p-3 border-b border-green-200 dark:border-green-800 space-y-2">
          <NuxtLink
            to="/auth/login"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            @click="isOpen = false"
          >
            <UIcon name="heroicons:arrow-right-on-rectangle" class="size-5" />
            <span>Sign In</span>
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-green-900 border border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-800 rounded-xl transition-all duration-200 font-medium"
            @click="isOpen = false"
          >
            <UIcon name="heroicons:user-plus" class="size-5" />
            <span>Register</span>
          </NuxtLink>
        </div>

        <!-- Secondary Menu Grid (2 Columns) -->
        <div v-if="navsSecondary && navsSecondary.length > 0" class="p-3">
          <div class="grid grid-cols-2 gap-2">
            <NuxtLink
              v-for="nav in navsSecondary"
              :key="nav.to"
              :to="nav.to"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-green-900/30 hover:bg-green-50 dark:hover:bg-green-900/50 border border-transparent hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 group"
              @click="isOpen = false"
            >
              <UIcon 
                :name="nav.icon" 
                class="size-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" 
              />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                {{ nav.title }}
              </span>
            </NuxtLink>
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
