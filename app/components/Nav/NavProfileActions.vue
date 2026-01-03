<script setup lang="ts">
// Profile actions component with dark mode toggle
</script>

<template>
  <div class="flex flex-nowrap items-center justify-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-green-900/50 backdrop-blur-sm border border-green-100/50 dark:border-green-700/50 shadow-sm transition-all duration-300 hover:shadow-md">
    <DarkModeSwitch />
  </div>
</template>

<style scoped>
:deep(.u-button) {
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.u-button:hover) {
  transform: scale(1.05);
}
</style>
