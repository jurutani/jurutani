<script setup lang="ts">
import { isDark, toggleDark } from '@/composables/dark'

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <UButton
    variant="ghost"
    size="sm"
    aria-label="Toggle theme"
    class="!rounded-xl text-green-700 dark:text-green-300
           hover:bg-green-100/50 dark:hover:bg-green-700/30
           transition-all"
    @click="toggleDark()"
  >
    <transition name="slide" mode="out-in">
      <UIcon
        v-if="isMounted && isDark"
        name="i-lucide-moon"
        class="text-2xl"
      />
      <UIcon
        v-else-if="isMounted"
        name="i-lucide-sun"
        class="text-2xl"
      />
      <div v-else class="text-2xl w-6 h-6" />
    </transition>
  </UButton>
</template>

<style scoped>
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
