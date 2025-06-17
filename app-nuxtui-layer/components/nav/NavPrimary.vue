<script setup lang="ts">
const { navsPrimary } = useNavMenu()
const { isMobileMenuOpen, openMobileMenu } = useMobileMenu()
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-6 px-4 rounded-xl backdrop-blur-sm border border-green-100 dark:border-green-800 shadow-sm">
    
    <!-- Mobile Layout: Logo + Menu -->
    <div class="w-full sm:hidden flex flex-col items-center bg-gradient-to-r from-green-50 via-green-25 to-blue-50 dark:from-green-950 dark:via-green-900 dark:to-green-950 rounded-xl p-4">
      <TheLogo class="mb-4 justify-center" />

      <!-- Mobile Bottom Sheet Menu Layout -->
      <div class="w-full grid grid-cols-3 gap-3">
        <ULink
          v-for="(nav, index) in navsPrimary" 
          :key="index"
          v-slot="{ isActive }"
          :to="nav.to"
          exact
          custom
        >
          <div 
            class="mobile-nav-item flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ease-out cursor-pointer"
            :class="isActive ? 'mobile-active' : ''"
            @click="openMobileMenu"
          >
            <div class="flex flex-col items-center">
              <div class="mobile-icon-wrapper p-2 rounded-full transition-all duration-300">
                <UIcon
                  v-if="nav.icon"
                  :name="nav.icon"
                  class="mobile-icon text-xl transition-all duration-300"
                />
                <UIcon
                  v-else
                  name="i-material-symbols-apps-rounded"
                  class="mobile-icon text-xl transition-all duration-300"
                />
              </div>
              <span class="mobile-text mt-1 text-xs font-medium transition-all duration-300">
                {{ nav.title }}
              </span>
            </div>
          </div>
        </ULink>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden sm:flex w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-green-400/50 scrollbar-track-transparent justify-center">
      <div class="flex items-center gap-1 py-1">
        <ULink
          v-for="(nav, index) in navsPrimary"
          :key="index"
          :label="nav.title"
          :to="nav.to"
          variant="link"
          class="desktop-nav-link flex-shrink-0 items-center gap-2 font-medium px-4 py-2.5 text-sm rounded-lg transition-all duration-300 ease-out"
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
  color: rgb(75, 85, 99); /* gray-600 */
}

.mobile-nav-item:hover .mobile-icon {
  color: rgb(16, 185, 129);
  transform: scale(1.1);
}

.mobile-nav-item .mobile-text {
  color: rgb(75, 85, 99); /* gray-600 */
}

.mobile-nav-item:hover .mobile-text {
  color: rgb(16, 185, 129);
  font-weight: 600;
}

/* Mobile Active State */
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
  color: rgb(156, 163, 175); /* gray-400 */
}

.dark .mobile-active {
  background: rgba(16, 185, 129, 0.15) !important;
}

/* ===== DESKTOP STYLES ===== */
.desktop-nav-link {
  position: relative;
  color: rgb(75, 85, 99); /* gray-600 */
  background: transparent;
  border: 1px solid transparent;
  align-items: center;
  display: flex;
  gap: 0.5rem;
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

.desktop-active .desktop-icon {
  color: rgb(16, 185, 129) !important;
}

.desktop-active .desktop-text {
  color: rgb(16, 185, 129) !important;
}

/* Dark mode desktop */
.dark .desktop-nav-link {
  color: rgb(156, 163, 175); /* gray-400 */
}

.dark .desktop-nav-link:hover {
  color: rgb(34, 197, 94); /* green-500 */
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

/* Focus states for accessibility */
.mobile-nav-item:focus,
.desktop-nav-link:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}

/* Prevent layout shift */
.mobile-nav-item,
.desktop-nav-link,
.mobile-icon,
.desktop-icon,
.mobile-text,
.desktop-text {
  will-change: transform, color, background-color;
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

/* Touch feedback for mobile */
@media (hover: none) and (pointer: coarse) {
  .mobile-nav-item:active {
    background: rgba(16, 185, 129, 0.15);
    transform: scale(0.95);
  }
}
</style>