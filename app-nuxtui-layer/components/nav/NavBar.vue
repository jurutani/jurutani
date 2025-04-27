<script setup lang="ts">
  const { isMobileMenuOpen, openMobileMenu } = useMobileMenu()
</script>
<template>
  <nav class="container mx-auto px-4">
    <div class="flex h-full items-center justify-between navbar-grid py-4">
      <div style="grid-area: logo" class="flex justify-center">
        <TheLogo />
      </div>
      <div
        data-pg-name="Hamburger"
        style="grid-area: hamburger"
        class="sm:hidden"
      >
        <NavHamburger @click="openMobileMenu" />
      </div>
      <div
        data-pg-name="NavBarPrimary"
        style="grid-area: primary-nav"
        class="hidden sm:flex"
      >
        <NavPrimary class="sm:w-full" />
      </div>
      <div data-pg-name="Searchbox" style="grid-area: search">
        <UFormGroup>
          <UInput
            placeholder="Search..."
            size="md"
            trailing-icon="i-material-symbols-search-rounded"
            class="w-full bg-gray-50 dark:bg-green-800 border-none shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary transition-all duration-300"
          />
        </UFormGroup>
      </div>
      <div data-pg-name="Profile" class="flex space-x-1" style="grid-area: profile">
        <ProfileActions class="!hidden sm:!flex" />
        <NavSecondary />
      </div>
    </div>
    
    <!-- Bottom sheet mobile menu -->
    <div 
      class="fixed bottom-0 left-0 right-0 z-50 sm:hidden transition-transform duration-300"
      :class="isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'"
    >
      <div 
        class="absolute inset-0 bg-opacity-0"
        @click="openMobileMenu"
      />
      <div class="relative bg-white dark:bg-green-900 rounded-t-3xl shadow-xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-center pt-2 pb-1">
          <div class="w-12 h-1.5 bg-gray-300 dark:bg-green-700 rounded-full"/>
        </div>
        <div class="p-4">
          <NavPrimary />
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped>
  .navbar-grid {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    grid-template-areas: 'hamburger logo profile' 'search search search';
    gap: 20px;
  }
  @media (min-width: 640px) {
    .navbar-grid {
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto;
      grid-template-areas: 'logo search profile' 'primary-nav primary-nav primary-nav';
      gap: 20px;
    }
  }
  @media (min-width: 1280px) {
    .navbar-grid {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      grid-template-rows: auto;
      grid-template-areas: 'logo primary-nav search profile';
      grid-column-gap: 32px;
    }
  }
</style>