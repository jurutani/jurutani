<script setup lang="ts">
const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu()
</script>

<template>
  <UButton
    size="xl"
    color="green"
    variant="ghost"
    class="!py-2 !rounded-xl leading-none text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-300 dark:hover:text-green-200 dark:hover:bg-green-800/50 transition-all duration-300"
    :icon="
      isMobileMenuOpen
        ? 'i-heroicons-x-mark'
        : 'i-heroicons-bars-3'
    "
    :aria-label="isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
    :aria-expanded="isMobileMenuOpen"
    @click="toggleMobileMenu"
  >
    <span class="sr-only">{{ isMobileMenuOpen ? 'Tutup menu' : 'Buka menu' }}</span>
  </UButton>
</template>

<style scoped>
/* Smooth icon transition */
:deep(svg) {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(button:hover svg) {
  transform: scale(1.1);
}

:deep(button:active svg) {
  transform: scale(0.95);
}
</style>
