<script setup lang="ts">
const { navsPrimary } = useNavMenu()
const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu()
const { openDropdown, toggleDropdown, closeDropdown, isDropdownOpen } = useNavDropdown()
const route = useRoute()

// Close dropdown when route changes
watch(() => route.path, () => {
  closeDropdown()
  closeMobileMenu()
})

// Handle click on nav item
const handleNavClick = (nav: any) => {
  if (nav.to) {
    closeMobileMenu()
    closeDropdown()
  }
}

// Dropdown hover delay management
let closeTimeout: NodeJS.Timeout | null = null

const handleDropdownEnter = (navTitle: string) => {
  // Clear any pending close timeout
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  // Open dropdown immediately
  toggleDropdown(navTitle)
}

const handleDropdownLeave = () => {
  // Add delay before closing to allow mouse movement to dropdown
  closeTimeout = setTimeout(() => {
    closeDropdown()
  }, 200) // 200ms delay
}

const handleDropdownContentEnter = () => {
  // Cancel close when mouse enters dropdown content
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

const handleDropdownContentLeave = () => {
  // Close immediately when leaving dropdown content
  closeDropdown()
}

// Click handler for toggle
const handleDropdownClick = (navTitle: string) => {
  toggleDropdown(navTitle)
}

// Click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdowns = document.querySelectorAll('[data-dropdown-container]')
  
  let isClickInside = false
  dropdowns.forEach(dropdown => {
    if (dropdown.contains(target)) {
      isClickInside = true
    }
  })
  
  if (!isClickInside) {
    closeDropdown()
  }
}

// Cleanup on unmount
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 px-4 rounded-xl backdrop-blur-sm">
    
    <!-- Mobile Layout: Logo + Menu -->
    <div class="w-full sm:hidden flex flex-col items-center bg-gradient-to-r from-green-50 via-green-25 to-green-50 dark:from-green-950 dark:via-green-900 dark:to-green-950 rounded-xl p-4">
      <NavLogo class="mb-4 justify-center" />

      <!-- Mobile Bottom Sheet Menu Layout with scroll -->
      <div class="w-full max-w-sm mx-auto">
        <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-green-400/50 scrollbar-track-transparent">
          <div class="grid grid-cols-3 gap-3 min-w-fit">
            <template v-for="(nav, index) in navsPrimary" :key="index">
              <!-- Mobile: If has children, show parent as clickable -->
              <template v-if="nav.children">
                <div 
                  v-for="child in nav.children"
                  :key="child.to"
                  class="mobile-nav-item"
                >
                  <ULink
                    v-slot="{ isActive }"
                    :to="child.to"
                    exact
                    custom
                  >
                    <div 
                      class="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ease-out cursor-pointer whitespace-nowrap min-w-[80px]"
                      :class="isActive ? 'mobile-active' : ''"
                      @click="handleNavClick(child)"
                    >
                      <div class="flex flex-col items-center">
                        <div class="mobile-icon-wrapper p-2 rounded-full transition-all duration-300">
                          <UIcon
                            v-if="child.icon"
                            :name="child.icon"
                            class="mobile-icon text-xl transition-all duration-300"
                          />
                        </div>
                        <span class="mobile-text mt-1 text-xs font-medium transition-all duration-300 text-center">
                          {{ child.title }}
                        </span>
                      </div>
                    </div>
                  </ULink>
                </div>
              </template>
              
              <!-- Mobile: Regular nav item -->
              <ULink
                v-else
                v-slot="{ isActive }"
                :to="nav.to"
                exact
                custom
              >
                <div 
                  class="mobile-nav-item flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ease-out cursor-pointer whitespace-nowrap min-w-[80px]"
                  :class="isActive ? 'mobile-active' : ''"
                  @click="handleNavClick(nav)"
                >
                  <div class="flex flex-col items-center">
                    <div class="mobile-icon-wrapper p-2 rounded-full transition-all duration-300">
                      <UIcon
                        v-if="nav.icon"
                        :name="nav.icon"
                        class="mobile-icon text-xl transition-all duration-300"
                      />
                    </div>
                    <span class="mobile-text mt-1 text-xs font-medium transition-all duration-300 text-center">
                      {{ nav.title }}
                    </span>
                  </div>
                </div>
              </ULink>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Layout with dropdown support -->
    <div class="hidden xl:flex md:flex sm:flex w-full justify-center">
      <div class="flex items-center justify-center gap-2 py-2 flex-wrap">
        <template v-for="(nav, index) in navsPrimary" :key="index">
          
          <!-- Desktop: Dropdown Menu -->
          <div v-if="nav.children" class="relative" data-dropdown-container>
            <button
              class="desktop-nav-link flex items-center gap-2 font-medium px-6 py-3 text-sm rounded-lg transition-all duration-300 ease-out whitespace-nowrap"
              :class="{ 'desktop-dropdown-active': isDropdownOpen(nav.title) }"
              @click="handleDropdownClick(nav.title)"
              @mouseenter="handleDropdownEnter(nav.title)"
              @mouseleave="handleDropdownLeave"
            >
              <UIcon
                v-if="nav.icon"
                :name="nav.icon"
                class="desktop-icon text-base transition-all duration-300"
              />
              <span class="desktop-text transition-all duration-300">{{ nav.title }}</span>
              <UIcon
                name="i-heroicons-chevron-down"
                class="text-xs transition-transform duration-300"
                :class="{ 'rotate-180': isDropdownOpen(nav.title) }"
              />
            </button>

            <!-- Dropdown Content -->
            <Transition name="dropdown">
              <div
                v-if="isDropdownOpen(nav.title)"
                class="absolute top-full left-0 mt-1 min-w-[200px] bg-white/95 dark:bg-green-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-green-100/50 dark:border-green-700/50 py-2 z-[100]"
                @mouseenter="handleDropdownContentEnter"
                @mouseleave="handleDropdownContentLeave"
              >
                <ULink
                  v-for="child in nav.children"
                  :key="child.to"
                  v-slot="{ isActive }"
                  :to="child.to"
                  custom
                >
                  <button
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-800/50 rounded-lg"
                    :class="{
                      'bg-green-100/70 dark:bg-green-800/70 text-green-700 dark:text-green-300 font-semibold': isActive,
                      'text-gray-700 dark:text-gray-200': !isActive
                    }"
                    @click="handleNavClick(child)"
                  >
                    <UIcon
                      v-if="child.icon"
                      :name="child.icon"
                      class="text-base"
                    />
                    <span>{{ child.title }}</span>
                  </button>
                </ULink>
              </div>
            </Transition>
          </div>

          <!-- Desktop: Regular Nav Link -->
          <ULink
            v-else
            :to="nav.to"
            variant="link"
            class="desktop-nav-link flex items-center gap-2 font-medium px-6 py-3 text-sm rounded-lg transition-all duration-300 ease-out whitespace-nowrap"
            color="gray"
            active-class="desktop-active"
            exact
          >
            <UIcon
              v-if="nav.icon"
              :name="nav.icon"
              class="desktop-icon text-base transition-all duration-300"
            />
            <span class="desktop-text transition-all duration-300">{{ nav.title }}</span>
          </ULink>
        </template>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ===== MOBILE STYLES ===== */
.mobile-nav-item {
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid transparent;
}

.mobile-nav-item:hover {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(16, 185, 129, 0.2);
  transform: translateY(-1px);
}

.mobile-nav-item:active {
  transform: translateY(0) scale(0.98);
}

.mobile-nav-item .mobile-icon-wrapper {
  background: transparent;
}

.mobile-nav-item:hover .mobile-icon-wrapper {
  background: rgba(16, 185, 129, 0.1);
}

.mobile-nav-item .mobile-icon {
  color: rgb(75, 85, 99);
}

.mobile-nav-item:hover .mobile-icon {
  color: rgb(16, 185, 129);
  transform: scale(1.1);
}

.mobile-nav-item .mobile-text {
  color: rgb(75, 85, 99);
}

.mobile-nav-item:hover .mobile-text {
  color: rgb(16, 185, 129);
  font-weight: 600;
}

.mobile-active {
  background: rgba(16, 185, 129, 0.1) !important;
  border-color: rgba(16, 185, 129, 0.3) !important;
  transform: translateY(-1px);
}

.mobile-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: rgb(16, 185, 129);
  border-radius: 0 0 2px 2px;
}

.mobile-active .mobile-icon-wrapper {
  background: rgba(16, 185, 129, 0.15) !important;
}

.mobile-active .mobile-icon {
  color: rgb(16, 185, 129) !important;
  transform: scale(1.1);
}

.mobile-active .mobile-text {
  color: rgb(16, 185, 129) !important;
  font-weight: 700;
}

/* Dark mode mobile */
.dark .mobile-nav-item {
  background: rgba(0, 0, 0, 0.3);
}

.dark .mobile-nav-item:hover {
  background: rgba(0, 0, 0, 0.5);
}

.dark .mobile-nav-item .mobile-icon,
.dark .mobile-nav-item .mobile-text {
  color: rgb(156, 163, 175);
}

.dark .mobile-active {
  background: rgba(16, 185, 129, 0.15) !important;
}

/* ===== DESKTOP STYLES ===== */
.desktop-nav-link {
  position: relative;
  color: rgb(55, 65, 81); /* gray-700 - better contrast */
  background: transparent;
  border: 1px solid transparent;
}

.desktop-nav-link:hover {
  color: rgb(16, 185, 129);
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.15);
  transform: translateY(-1px);
}

.desktop-nav-link:hover .desktop-icon {
  color: rgb(16, 185, 129);
  transform: scale(1.05);
}

.desktop-nav-link:hover .desktop-text {
  color: rgb(16, 185, 129);
}

/* Desktop Active State */
.desktop-active {
  color: rgb(16, 185, 129) !important;
  background: rgba(16, 185, 129, 0.08) !important;
  border-color: rgba(16, 185, 129, 0.2) !important;
  font-weight: 600;
}

.desktop-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: rgb(16, 185, 129);
  border-radius: 2px 2px 0 0;
}

.desktop-active .desktop-icon,
.desktop-active .desktop-text {
  color: rgb(16, 185, 129) !important;
}

/* Dropdown active state */
.desktop-dropdown-active {
  color: rgb(16, 185, 129);
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.15);
}

/* Dark mode desktop */
.dark .desktop-nav-link {
  color: rgb(229, 231, 235); /* gray-200 - better contrast */
}

.dark .desktop-nav-link:hover {
  color: rgb(34, 197, 94);
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.2);
}

.dark .desktop-nav-link:hover .desktop-icon,
.dark .desktop-nav-link:hover .desktop-text {
  color: rgb(34, 197, 94);
}

.dark .desktop-active {
  color: rgb(34, 197, 94) !important;
  background: rgba(34, 197, 94, 0.1) !important;
  border-color: rgba(34, 197, 94, 0.25) !important;
}

.dark .desktop-active::after {
  background: rgb(34, 197, 94);
}

.dark .desktop-active .desktop-icon,
.dark .desktop-active .desktop-text {
  color: rgb(34, 197, 94) !important;
}

/* Dropdown Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Focus states for accessibility */
.mobile-nav-item:focus,
.desktop-nav-link:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
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
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(34, 197, 94, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(34, 197, 94, 0.7);
}

/* Smooth scroll behavior */
.overflow-x-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
</style>
