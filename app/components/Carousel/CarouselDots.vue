<script setup lang="ts">
interface Props {
  totalSlides: number
  currentSlide: number
  onSlideChange: (index: number) => void
}

defineProps<Props>()
</script>

<template>
  <div class="absolute bottom-6 md:bottom-8 inset-x-0 flex justify-center gap-2 md:gap-3 z-20">
    <button
      v-for="index in totalSlides"
      :key="index"
      class="relative overflow-hidden rounded-full transition-all duration-500 hover:scale-110 touch-target"
      :class="[
        currentSlide === index - 1
          ? 'w-8 md:w-12 h-2 md:h-3 bg-linear-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 shadow-lg'
          : 'w-2 md:w-3 h-2 md:h-3 bg-white/40 hover:bg-white/60 dark:bg-white/20 dark:hover:bg-white/40 backdrop-blur-sm'
      ]"
      @click.stop="onSlideChange(index - 1)"
    >
      <div
        v-if="currentSlide === index - 1"
        class="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-full animate-pulse"
      />
    </button>
  </div>
</template>

<style scoped>
/* Touch target for better mobile usability */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
