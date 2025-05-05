<script setup lang="ts">
  // ...
</script>

<template>
  <div class="flex flex-nowrap items-center justify-center gap-2 p-2 rounded-xl bg-gradient-to-r from-green-50 via-green-100 to-green-50 dark:from-green-900 dark:via-green-800 dark:to-green-900 shadow-sm">
    <DarkModeSwitch />
  </div>
</template>

<style scoped>
/* Tambahkan sentuhan halus jika mau */
:deep(.u-button) {
  font-weight: 500;
}
</style>
