<script setup lang="ts">
const { navsPrimary } = useNavMenu()
const { isMobileMenuOpen, openMobileMenu } = useMobileMenu()
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-6 px-4 rounded-xl backdrop-blur-sm border border-green-100 dark:border-green-800 shadow-sm">
    
    <!-- Mobile Layout: Logo + Menu -->
    <div class="w-full sm:hidden flex flex-col items-center bg-gradient-to-r from-green-200 via-green-100 to-blue-100 dark:from-green-900 dark:via-green-800 dark:to-green-900 rounded-xl p-4">
      <TheLogo class="mb-4" />

      <!-- Mobile Bottom Sheet Menu Layout -->
      <div class="w-full grid grid-cols-3 gap-4">
        <div 
          v-for="(nav, index) in navsPrimary" 
          :key="index"
          class="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
          @click="openMobileMenu"
        >
          <ULink
            v-slot="{ isActive }">
            <div class="flex flex-col items-center">
              <div class="p-2 rounded-full" :class="isActive ? 'bg-green-100 dark:bg-green-800' : ''">
                <UIcon
                  v-if="nav.icon"
                  :name="nav.icon"
                  class="text-2xl"
                  :class="isActive ? 'text-primary' : 'text-green-600 dark:text-green-300'"
                />
                <UIcon
                  v-else
                  name="i-material-symbols-apps-rounded"
                  class="text-2xl"
                  :class="isActive ? 'text-primary' : 'text-green-600 dark:text-green-300'"
                />
              </div>
              <span class="mt-1 text-xs font-medium" :class="isActive ? 'text-primary' : 'text-green-800 dark:text-green-200'">
                {{ nav.title }}
              </span>
            </div>
          </ULink>
        </div>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden sm:flex w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-green-400/50 scrollbar-track-transparent">
      <div class="flex items-center gap-4 ml-4 py-1">
        <ULink
          v-for="(nav, index) in navsPrimary"
          :key="index"
          :label="nav.title"
          :to="nav.to"
          variant="link"
          class="nav-link flex-shrink-0 items-center gap-1 font-medium text-green-800 dark:text-green-200 hover:text-primary transition-all duration-300 px-3 py-1 text-sm"
          color="gray"
          active-class="active-link text-primary font-bold"
          exact
        >
          <UIcon
            v-if="nav.icon"
            :name="nav.icon"
            class="text-base text-green-600 dark:text-green-300 mr-2 mt-2"
          />
          <span>{{ nav.title }}</span>
        </ULink>
      </div>
    </div>

  </div>
</template>

<style scoped>
.nav-link {
  position: relative;
  border-radius: 0.5rem;
}

.nav-link:hover {
  background-color: rgba(0, 128, 0, 0.05);
  transform: translateY(-1px);
}

.active-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  border-radius: 3px;
}

/* Scrollbar styles */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-green-400\/50 {
  scrollbar-color: rgba(34, 197, 94, 0.5) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(34, 197, 94, 0.5);
  border-radius: 10px;
}
</style>
