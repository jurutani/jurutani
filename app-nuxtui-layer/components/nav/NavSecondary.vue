<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'

const { navsSecondary } = useNavMenu()
const { user, logout, loading } = useSupabase()

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
    // Logout berhasil, mungkin redirect atau show notification
    // Contoh redirect ke homepage:
    window.location.href = '/'
  } else {
    alert('Logout gagal: ' + result.error)
  }
}
</script>


<template>
  <UDropdown
    :popper="{ placement: 'bottom-start' }"
    :ui="{
      container: '!-ml-2 sm:ml-auto',
      rounded: '',
      width: 'w-full sm:w-64',
      item: { disabled: 'cursor-text select-text opacity-100' },
      base: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border border-green-100 dark:border-green-800',
    }"
    :items="dropdownItems"
  >
    <UAvatar
      src="/profile.png"
      alt="Avatar"
      size="lg"
      class="sm:ml-2"
    />

    <template #account>
      <div class="my-2 w-full px-3">
        <!-- Logo dan Judul -->
        <div class="flex items-center space-x-2 mb-3">
          <img src="/jurutani.png" alt="Logo Juru Tani" class="w-8 h-8" >
          <span class="font-semibold text-green-700 dark:text-green-200 text-lg">Juru Tani</span>
        </div>

        <ProfileActions class="sm:!hidden mb-2" />

        <!-- Tombol Sign In & Register atau Logout -->
        <div class="grid sm:grid-cols-1 grid-cols-2 gap-2 mt-4">

          <button
            class="col-span-2 font-bold w-full py-2 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border-none text-white shadow-sm"
            type="button"
            @click="handleLogout"
          >
            <UIcon name="i-heroicons-arrow-left-on-rectangle" class="text-white w-5 h-5" />
            Logout
          </button>
          <template v-if="user">
            <!-- Jika sudah login, tampilkan tombol Logout penuh -->
            <button
              class="col-span-2 font-bold w-full py-2 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border-none text-white shadow-sm"
              type="button"
              @click="handleLogout"
            >
              <UIcon name="i-heroicons-arrow-left-on-rectangle" class="text-white w-5 h-5" />
              Logout
            </button>
          </template>

          <template v-else>
            <!-- Jika belum login, tampilkan Sign In dan Register -->
            <NuxtLink to="/auth/login" class="col-span-1">
              <UButton
                class="font-bold w-full py-2 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 border-none text-white shadow-sm"
                size="md"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="text-white w-5 h-5" />
                Sign In
              </UButton>
            </NuxtLink>

            <NuxtLink to="/auth/register" class="col-span-1">
              <UButton
                class="font-bold w-full py-2 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 border-none text-white shadow-sm"
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
              class="flex flex-col items-center justify-center p-3 rounded-md w-full transition-all duration-300"
              :class="{
                'bg-green-200/70 dark:bg-green-700/70': isActive,
                'hover:bg-green-200/40 dark:hover:bg-green-700/40': true
              }"
              @click="navigate"
            >
              <UIcon
                v-if="nav.icon"
                :name="nav.icon"
                class="text-[22px] mb-1"
                :class="isActive ? 'text-green-700 dark:text-green-300' : 'text-green-600 dark:text-green-400'"
              />
              <span 
                class="text-[10px] font-medium"
                :class="isActive ? 'text-green-800 dark:text-green-200' : 'text-green-700 dark:text-green-300'"
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
