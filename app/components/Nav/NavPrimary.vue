<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { navsPrimary } = useNavMenu()
const route = useRoute()

// Emit untuk close mobile menu setelah navigate
const emit = defineEmits<{
  navigate: []
}>()

// Check if route is active
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

// Handle navigation
const handleNavigate = () => {
  emit('navigate')
}

// Convert nav children to dropdown items
const getDropdownItems = (children: any[]): DropdownMenuItem[][] => {
  return [
    children.map(child => ({
      label: child.title,
      icon: child.icon,
      to: child.to,
      class: isActive(child.to!) ? 'bg-green-100 dark:bg-green-900 font-semibold text-green-700 dark:text-green-300' : '',
    }))
  ]
}
</script>

<template>
  <div class="w-full">
    <!-- Mobile Layout: Grid with Logo -->
    <div class="xl:hidden flex flex-col items-center bg-gradient-to-r from-green-50 via-green-25 to-green-50 dark:from-green-950 dark:via-green-900 dark:to-green-950 rounded-xl p-4">
      <NavLogo class="mb-4" />

      <!-- Mobile Grid Menu (3 Columns) -->
      <div class="w-full max-w-md mx-auto">
        <div class="grid grid-cols-3 gap-2">
          <template v-for="nav in navsPrimary" :key="nav.title">
            <!-- Mobile: If has children, show all children -->
            <template v-if="nav.children">
              <NuxtLink
                v-for="child in nav.children"
                :key="child.to"
                :to="child.to"
                class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-green-900/30 hover:bg-green-50 dark:hover:bg-green-900/50 border border-transparent hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 group"
                :class="{ 
                  'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600': isActive(child.to!) 
                }"
                @click="handleNavigate"
              >
                <UIcon
                  v-if="child.icon"
                  :name="child.icon"
                  class="size-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200"
                />
                <span class="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">
                  {{ child.title }}
                </span>
              </NuxtLink>
            </template>
            
            <!-- Mobile: Regular nav item -->
            <NuxtLink
              v-else
              :to="nav.to"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-green-900/30 hover:bg-green-50 dark:hover:bg-green-900/50 border border-transparent hover:border-green-200 dark:hover:border-green-700 transition-all duration-200 group"
              :class="{ 
                'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600': isActive(nav.to!) 
              }"
              @click="handleNavigate"
            >
              <UIcon
                v-if="nav.icon"
                :name="nav.icon"
                class="size-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200"
              />
              <span class="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">
                {{ nav.title }}
              </span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>

    <!-- Desktop Layout: Horizontal Menu -->
    <nav class="hidden xl:flex items-center justify-center gap-1" aria-label="Primary navigation">
      <template v-for="nav in navsPrimary" :key="nav.title">
        <!-- Desktop: Dropdown Menu with Hover -->
        <UDropdownMenu
          v-if="nav.children"
          :items="getDropdownItems(nav.children)"
          mode="hover"
          :open-delay="150"
          :close-delay="200"
          :ui="{
            content: 'w-48 bg-white dark:bg-green-950 border border-green-200 dark:border-green-800 z-[70]',
            item: 'rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/50',
            itemLeadingIcon: 'shrink-0 size-5 text-green-600 dark:text-green-400',
          }"
        >
          <UButton
            variant="ghost"
            color="primary"
            trailing-icon="heroicons:chevron-down-20-solid"
            class="font-medium hover:bg-green-50 dark:hover:bg-green-900/30"
            :aria-label="`${nav.title} menu`"
          >
            <UIcon
              v-if="nav.icon"
              :name="nav.icon"
              class="mr-2"
            />
            {{ nav.title }}
          </UButton>
        </UDropdownMenu>

        <!-- Desktop: Regular Link -->
        <UButton
          v-else
          :to="nav.to"
          variant="ghost"
          color="primary"
          class="font-medium hover:bg-green-50 dark:hover:bg-green-900/30"
          :class="{ 
            'bg-green-100 dark:bg-green-900 font-semibold text-green-700 dark:text-green-300': isActive(nav.to!) 
          }"
        >
          <UIcon
            v-if="nav.icon"
            :name="nav.icon"
            class="mr-2"
          />
          {{ nav.title }}
        </UButton>
      </template>
    </nav>
  </div>
</template>

<style scoped>
/* Focus visible states for accessibility */
:deep(.u-button:focus-visible) {
  outline: 2px solid rgb(34 197 94);
  outline-offset: 2px;
}

/* Smooth hover transitions */
:deep(.u-button) {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Active link enhancement */
:deep(.router-link-active) {
  font-weight: 600;
}

/* Dropdown animation */
:deep([data-headlessui-state="open"]) {
  animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure dropdown is always on top */
:deep([role="menu"]) {
  z-index: 99999 !important;
}

/* Dropdown menu wrapper */
:deep([id^="headlessui-menu"]) {
  z-index: 99999 !important;
}

/* Icon hover effect */
:deep(.group:hover .shrink-0) {
  transform: scale(1.1);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
