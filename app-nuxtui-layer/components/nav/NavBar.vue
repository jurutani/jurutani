<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useMobileMenu()

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0

  // Tutup mobile menu saat scroll
  if (isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const mobileMenu = document.querySelector('.mobile-menu-content')
  const hamburger = document.querySelector('[data-pg-name="Hamburger"]')
  
  if (isMobileMenuOpen.value && mobileMenu && hamburger) {
    if (!mobileMenu.contains(target) && !hamburger.contains(target)) {
      closeMobileMenu()
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav 
    class="container mx-auto px-4 transition-all duration-300 rounded-2xl"
    :class="{
      'fixed top-0 left-0 right-0 z-50': true,
      'bg-gradient-to-r from-white/70 via-white/60 to-white/70 dark:from-emerald-900/70 dark:via-green-900/60 dark:to-teal-900/70 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-emerald-700/30': isScrolled,
      'bg-transparent': !isScrolled
    }"
  >
    <div class="flex h-full items-center justify-between navbar-grid pt-4 lg:pb-4 rounded-2xl">
      <div style="grid-area: logo" class="flex justify-center items-center">
         <ULink data-pg-name="Logo" class="flex items-center sm:flex-row" to="/">
            <img src="/LOGO02.png" alt="Logo" class="h-10" >
          </ULink>
      </div>
      
      <div
        data-pg-name="Hamburger"
        style="grid-area: hamburger"
        class="block xl:hidden flex items-center justify-center"
      >
        <NavHamburger @click="openMobileMenu" />
      </div>
      
      <div
        data-pg-name="NavBarPrimary"
        style="grid-area: primary-nav"
        class="hidden xl:flex w-full justify-center items-center"
      >
        <NavPrimary class="w-full" />
      </div>
      
      <div data-pg-name="Profile" class="flex space-x-1 items-center justify-center" style="grid-area: profile">
        <ProfileActions class="!hidden sm:!flex" />
        <NavSecondary />
      </div>
    </div>
  </nav>

  <!-- ✅ Ini di luar nav: fixed bottom, hanya di mobile -->
  <Transition name="slide-up">
    <div
      v-if="isMobileMenuOpen"
      class="fixed bottom-0 left-0 right-0 z-40 xl:hidden bg-gradient-to-t from-yellow/90 to-yellow/70 dark:from-emerald-900/90 dark:to-green-900/70 backdrop-blur-xl border-t border-yellow/20 dark:border-emerald-700/30 shadow-2xl rounded-t-2xl"
    >
      <div class="container mx-auto px-4 py-2">
        <NavPrimary />
      </div>
    </div>
  </Transition>

  <!-- ✅ Bottom sheet untuk tambahan mobile menu -->
  <Transition name="slide-up">
    <div 
      v-if="isMobileMenuOpen"
      class="fixed bottom-0 left-0 right-0 z-50 xl:hidden"
    >
      <div 
        class="absolute inset-0 bg-opacity-50"
        @click="closeMobileMenu"
      />
      <div class="mobile-menu-content relative bg-gradient-to-b from-white/95 to-white/85 dark:from-emerald-900/95 dark:to-teal-900/85 backdrop-blur-xl rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto border-t border-white/30 dark:border-emerald-700/30">
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
  grid-template-rows: auto auto;
  grid-template-areas: 'hamburger logo profile' 'search search search';
  gap: 20px;
  align-items: center;
}

@media (min-width: 640px) {
  .navbar-grid {
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    grid-template-areas: 'hamburger logo profile' 'search search search';
    align-items: center;
  }
}

@media (min-width: 768px) {
  .navbar-grid {
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    grid-template-areas: 'hamburger logo profile' 'search search search';
    align-items: center;
  }
}

@media (min-width: 1280px) {
  .navbar-grid {
    grid-template-columns: auto 1fr auto auto;
    grid-template-rows: auto;
    grid-template-areas: 'logo primary-nav search profile';
    grid-column-gap: 32px;
    align-items: center;
  }
}

/* Animasi untuk Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
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
</style>