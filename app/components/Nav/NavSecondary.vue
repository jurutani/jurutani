<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { ref, onMounted } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'

const { navsSecondary } = useNavMenu()
const { logout } = useSupabase()
const { supabase } = useSupabase()
const currentUserId = ref(null)
const user = ref(null)
const isLoading = ref(true)

// Fetch current user ID and set it to the user ref
const fetchCurrentUser = async () => {
  try {
    isLoading.value = true
    const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !userData) {
      user.value = null
      return
    }

    // Fetch profile from 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('avatar_url, full_name, id')
      .eq('id', userData.id)
      .single()

    if (profileError || !profileData) {
      console.error('Error fetching profile:', profileError)
      user.value = {
        id: userData.id,
        email: userData.email,
        full_name: userData.email?.split('@')[0] || 'User',
        avatar_url: '/profile.png'
      }
      return
    }

    // Gabungkan data user auth dan profile
    user.value = {
      id: userData.id,
      email: userData.email,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url ? `${profileData.avatar_url}?t=${Date.now()}` : '/profile.png'
    }
    
    currentUserId.value = userData.id
  } catch (err) {
    console.error('Error fetching current user:', err)
    user.value = null
  } finally {
    isLoading.value = false
  }
}

// Handle image error
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  console.error('Profile image failed to load:', target.src)
  target.src = '/profile.png'
}

onMounted(() => {
  fetchCurrentUser()
})

const dropdownItems = [
  [
    {
      slot: 'account',
      disabled: true,
    }
  ],
]

// Function untuk handle logout
const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    toastStore.success('Berhasil logout')
    // clear local user state
    user.value = null
    currentUserId.value = null

    // navigate home and force a full reload to refresh session/UI
    await navigateTo('/')
    window.location.reload()
  } else {
    toastStore.error('Gagal logout')
    console.error('Logout failed:', result.error)
  }
}
</script>

<template>
  <UDropdown
    :popper="{ placement: 'bottom-start' }"
    :ui="{
      container: '!-ml-2 sm:ml-auto',
      rounded: 'rounded-xl',
      width: 'w-full sm:w-64',
      item: { disabled: 'cursor-text select-text opacity-100' },
      base: 'bg-white/95 dark:bg-green-900/95 backdrop-blur-xl border border-green-100/50 dark:border-green-700/50 shadow-xl',
    }"
    :items="dropdownItems"
  >
    <!-- Avatar with loading state -->
    <div class="relative">
      <UAvatar
        v-if="!isLoading && user?.avatar_url"
        :src="user.avatar_url"
        :alt="user.full_name || 'User Avatar'"
        size="lg"
        class="sm:ml-2 ring-2 ring-green-500/20 hover:ring-green-500/40 transition-all duration-300 cursor-pointer"
        @error="handleImageError"
      />
      <UAvatar
        v-else-if="!isLoading"
        src="/profile.png"
        alt="Default Avatar"
        size="lg"
        class="sm:ml-2 ring-2 ring-green-500/20 hover:ring-green-500/40 transition-all duration-300 cursor-pointer"
      />
      <div
        v-else
        class="w-10 h-10 sm:ml-2 rounded-full bg-green-100 dark:bg-green-800 animate-pulse"
      />
      
      <!-- Online indicator -->
      <div
        v-if="user"
        class="absolute bottom-0 right-0 sm:right-2 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"
      />
    </div>

    <template #account>
      <div class="my-2 w-full px-3">
        <NavProfileActions class="sm:!hidden mb-2" />

        <!-- User Info (if logged in) -->
        <div v-if="user" class="mb-4 pb-4 border-b border-green-200 dark:border-green-700">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="user.avatar_url"
              :alt="user.full_name"
              size="md"
              @error="handleImageError"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {{ user.full_name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ user.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Tombol Sign In & Register atau Logout -->
        <div class="grid sm:grid-cols-1 grid-cols-2 gap-2 mt-4">
          <template v-if="user">
            <button
              class="col-span-2 font-bold w-full py-2.5 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border border-red-600 hover:border-red-700 text-white shadow-sm rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              type="button"
              @click="handleLogout"
            >
              <UIcon name="i-heroicons-arrow-left-on-rectangle" class="text-white w-5 h-5" />
              Logout
            </button>
          </template>

          <template v-else>
            <NuxtLink to="/auth/login" class="col-span-1">
              <UButton
                class="font-bold w-full py-2.5 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 border-none text-white shadow-sm rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                size="md"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="text-white w-5 h-5" />
                Sign In
              </UButton>
            </NuxtLink>

            <NuxtLink to="/auth/register" class="col-span-1">
              <UButton
                class="font-bold w-full py-2.5 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 border-none text-white shadow-sm rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                size="md"
              >
                <UIcon name="i-heroicons-user-plus" class="text-white w-5 h-5" />
                Register
              </UButton>
            </NuxtLink>
          </template>
        </div>

        <!-- Secondary Navigation Items -->
        <div class="grid grid-cols-2 gap-2 mt-4">
          <ULink
            v-for="(nav, index) in navsSecondary"
            :key="nav.to"
            v-slot="{ isActive, navigate }"
            :to="nav.to"
            custom
          >
            <button 
              class="flex flex-col items-center justify-center p-3 rounded-lg w-full transition-all duration-300 hover:scale-[1.02]"
              :class="{
                'bg-green-100/70 dark:bg-green-700/70 shadow-sm': isActive,
                'hover:bg-green-50 dark:hover:bg-green-800/40': true
              }"
              @click="navigate"
            >
              <UIcon
                v-if="nav.icon"
                :name="nav.icon"
                class="text-[22px] mb-1 transition-transform duration-300"
                :class="isActive ? 'text-green-700 dark:text-green-300 scale-110' : 'text-green-600 dark:text-green-400'"
              />
              <span 
                class="text-[10px] font-medium"
                :class="isActive ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-green-700 dark:text-green-300'"
              >
                {{ nav.title }}
              </span>
            </button>
          </ULink>
        </div>
      </div>
    </template>
  </UDropdown>
</template>

<style scoped>
/* Smooth transitions */
:deep(.u-avatar) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.u-avatar:hover) {
  transform: scale(1.05);
}

/* Dropdown animation */
:deep(.u-dropdown-content) {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
