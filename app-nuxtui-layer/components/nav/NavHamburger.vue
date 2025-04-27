<script setup lang="ts">
const { isMobileMenuOpen, openMobileMenu } = useMobileMenu()
</script>

<template>
  <UButton
    size="xl"
    color="green"
    variant="ghost"
    class="!py-2 !rounded-xl leading-none text-green-700 hover:text-green-800 hover:bg-green-100 transition-all"
    :icon="
      isMobileMenuOpen
        ? 'i-material-symbols-close'
        : 'i-material-symbols-menu'
    "
    @click="openMobileMenu"
  >
    <span class="sr-only">Open main menu</span>
  </UButton>
</template>

<style scoped></style>
