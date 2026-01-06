<script setup lang="ts">
// Empty props - pure presentation component
</script>

<template>
  <UCard
    class="absolute bottom-16 md:bottom-24 inset-x-0 mx-auto w-fit border-0 bg-black/20 dark:bg-white/5 backdrop-blur-sm"
  >
    <!-- Mobile indicator -->
    <div class="flex items-center gap-1 md:gap-2 md:hidden text-white/60 dark:text-white/70 text-xs font-medium">
      <UIcon name="i-heroicons-arrow-right" class="w-3 h-3 animate-pulse" />
      Geser
      <UIcon name="i-heroicons-arrow-left" class="w-3 h-3 animate-pulse" />
    </div>

    <!-- Desktop indicator -->
    <div class="hidden md:flex items-center gap-2 text-white/60 dark:text-white/70 text-sm font-medium">
      <UIcon name="i-heroicons-arrows-right-left" class="w-4 h-4" />
      Klik kiri/kanan untuk navigasi
    </div>
  </UCard>
</template>
