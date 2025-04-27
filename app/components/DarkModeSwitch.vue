<script setup lang="ts">
  import { isDark, toggleDark } from '@/composables/dark'
</script>

<template>
  <div>
    <UButton
      variant="ghost"
      class="!rounded-xl text-green-700 dark:text-green-300 hover:bg-green-100/50 dark:hover:bg-green-700/30 transition-all"
      aria-label="Toggle theme"
      size="sm"
      @click="toggleDark()"
    >
      <transition name="slide" mode="out-in">
        <UIcon
          v-if="isDark"
          name="i-material-symbols-dark-mode-outline"
          class="text-2xl"
        />
        <UIcon
          v-else
          name="i-material-symbols-light-mode-outline"
          class="text-2xl"
        />
      </transition>
    </UButton>
  </div>
</template>

<style scoped lang="postcss">
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.15s ease;
}

.slide-enter-from {
  transform: translateY(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
}

.slide-leave-to {
  transform: translateY(100%);
}
</style>
