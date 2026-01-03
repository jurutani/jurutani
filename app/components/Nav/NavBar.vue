<script setup lang="ts">
const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu()
const { isScrolled } = useNavbarScroll()

// Close mobile menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const mobileMenu = document.querySelector('.mobile-menu-content')
  const hamburger = document.querySelector('[data-navbar-hamburger]')
  
  if (isMobileMenuOpen.value && mobileMenu && hamburger) {
    if (!mobileMenu.contains(target) && !hamburger.contains(target)) {
      closeMobileMenu()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav 
    class="container max-w-6xl mx-auto px-4 transition-all duration-300 rounded-2xl overflow-visible"
    :class="{
      'fixed top-0 left-0 right-0 z-50': true,
      'bg-white/80 dark:bg-emerald-900/80 backdrop-blur-2xl shadow-lg border border-white/20 dark:border-emerald-700/30': isScrolled,
      'bg-transparent': !isScrolled
    }"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="flex h-full items-center justify-between navbar-grid py-2 lg:pb-4 rounded-2xl overflow-visible">
      <!-- Logo -->
      <div style="grid-area: logo" class="flex justify-center items-center">
        <NavLogo />
      </div>
      
      <!-- Hamburger (Mobile) -->
      <div
        data-navbar-hamburger
        style="grid-area: hamburger"
        class="xl:hidden flex items-center justify-center"
      >
        <NavHamburger />
      </div>
      
      <!-- Primary Navigation (Desktop) -->
      <div
        style="grid-area: primary-nav"
        class="hidden xl:flex max-w-6xl justify-center items-center"
      >
        <NavPrimary class="w-full" />
      </div>
      
      <!-- Profile Actions + Avatar (Desktop) -->
      <div class="flex space-x-1 items-center justify-center" style="grid-area: profile">
        <NavProfileActions class="!hidden sm:!flex" />
        <NavSecondary />
      </div>
    </div>
  </nav>

  <!-- Mobile Menu Bottom Sheet -->
  <Transition name="slide-up">
    <div 
      v-if="isMobileMenuOpen"
      class="fixed bottom-0 left-0 right-0 z-50 xl:hidden"
    >
      <div 
        class="absolute inset-0 bg-black/20 backdrop-blur-sm"
        @click="closeMobileMenu"
      />
      <div class="mobile-menu-content relative bg-white/95 dark:bg-emerald-900/95 backdrop-blur-xl rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto border-t border-white/30 dark:border-emerald-700/30">
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-12 h-1.5 bg-gray-300/70 dark:bg-emerald-600/70 rounded-full"/>
        </div>
        <div class="p-4">
          <NavPrimary />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.navbar-grid {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto;
  grid-template-areas: 'hamburger logo profile';
  gap: 20px;
  align-items: center;
}

@media (min-width: 640px) {
  .navbar-grid {
    grid-template-columns: auto auto auto;
    grid-template-rows: auto;
    grid-template-areas: 'hamburger logo profile';
    align-items: center;
  }
}

@media (min-width: 768px) {
  .navbar-grid {
    grid-template-columns: auto auto auto;
    grid-template-rows: auto;
    grid-template-areas: 'hamburger logo profile';
    align-items: center;
  }
}

@media (min-width: 1280px) {
  .navbar-grid {
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    grid-template-areas: 'logo primary-nav profile';
    grid-column-gap: 32px;
    align-items: center;
  }
}

/* Animasi untuk Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* Smooth scroll padding for fixed navbar */
:global(html) {
  scroll-padding-top: 80px;
}
</style>
