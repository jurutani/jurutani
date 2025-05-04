<script setup lang="ts">
const { navsSecondary } = useNavMenu()

// Organize dropdown items for account section
const dropdownItems = [
  [
    {
      slot: 'account',
      disabled: true,
    },
    ...navsSecondary.map((nav) => ({
      slot: nav.to.replace(/^\//, '').replaceAll('/', '-'),
      label: nav.title,
      icon: nav.icon,
      to: nav.to,
      activeClass: 'text-primary',
    })),
  ],
]
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
      src="https://avatars.githubusercontent.com/u/73772701?v=4"
      alt="Avatar"
      size="lg"
      class="sm:ml-2 border-2 border-green-500 hover:border-green-600 transition-all duration-300"
    />

    <template #account>
      <div class="my-2 w-full px-3">
        <ProfileActions class="sm:!hidden" />
        
        <!-- Perbaiki ukuran tombol -->
        <NuxtLink to="/auth/login">
          <UButton
            class="font-bold my-4 w-full py-2 text-sm bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 border-none text-white shadow-sm"
            size="md"
          >
            Sign In / Join Us
          </UButton>
        </NuxtLink>


        <!-- Secondary Navigation Items -->
        <div class="grid grid-cols-3 gap-2 mt-2">
          <ULink
            v-for="(nav, index) in navsSecondary"
            :key="index"
            v-slot="{ isActive, navigate }"
            :to="nav.to"
            custom
          >
            <button 
              class="flex flex-col items-center justify-center p-3 rounded-md w-full transition-all duration-300 hover:bg-green-200/40 dark:hover:bg-green-700/40"
              :class="isActive ? 'bg-green-200/70 dark:bg-green-700/70' : ''"
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

<style scoped>
/* Additional hover styles for better feeling */
:deep(.u-dropdown-item-base:hover) {
  background-color: rgba(34, 197, 94, 0.08);
}
</style>
