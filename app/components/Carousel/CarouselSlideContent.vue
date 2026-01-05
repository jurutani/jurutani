<script setup lang="ts">
import type { HeroData } from '~/composables/useHeroData'

interface Props {
  item: HeroData
  index: number
  currentSlide: number
  isTransitioning: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="absolute inset-0 flex items-center justify-center px-4">
    <div
      class="max-w-xs sm:max-w-lg md:max-w-2xl w-full transform transition-all duration-1000 rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden group"
      :class="[
        currentSlide === index && !isTransitioning
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-8 opacity-0 scale-95'
      ]"
    >
      <!-- Glassmorphism Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-2xl" />

      <!-- Animated Shadow Effect -->
      <div class="absolute inset-0 rounded-2xl bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <!-- Enhanced Glass Effect on hover -->
      <div class="absolute -inset-0.5 bg-black/20 dark:bg-black/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      <!-- Content -->
      <div class="relative px-4 sm:px-6 md:px-8 py-8 md:py-12 text-center">
        <!-- Caption -->
        <p
          class="text-green-300 dark:text-green-400 font-semibold uppercase tracking-widest text-xs sm:text-sm mb-2 md:mb-3 transition-all duration-700 delay-200"
          :class="[
            currentSlide === index && !isTransitioning
              ? 'translate-x-0 opacity-100'
              : index % 2 === 0
                ? '-translate-x-8 opacity-0'
                : 'translate-x-8 opacity-0'
          ]"
        >
          {{ item.caption }}
        </p>

        <!-- Title -->
        <h2
          class="text-white dark:text-gray-50 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 leading-tight transition-all duration-700 delay-300"
          :class="[
            currentSlide === index && !isTransitioning
              ? 'translate-x-0 opacity-100'
              : index % 2 === 0
                ? 'translate-x-8 opacity-0'
                : '-translate-x-8 opacity-0'
          ]"
        >
          {{ item.title }}
        </h2>

        <!-- Description -->
        <p
          class="text-gray-100 dark:text-gray-200 text-sm sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed transition-all duration-700 delay-400"
          :class="[
            currentSlide === index && !isTransitioning
              ? 'translate-x-0 opacity-100'
              : index % 2 === 0
                ? '-translate-x-8 opacity-0'
                : 'translate-x-8 opacity-0'
          ]"
        >
          {{ item.description }}
        </p>

        <!-- Button -->
        <div
          class="transition-all duration-700 delay-500"
          :class="[
            currentSlide === index && !isTransitioning
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-4 opacity-0 scale-95'
          ]"
        >
          <UButton
            v-if="item.button_text"
            as="NuxtLink"
            :to="item.button_link"
            color="success"
            size="md"
            @click.stop
          >
            {{ item.button_text }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
