<script setup lang="ts">
/**
 * SectionHeader - Reusable Section Header Component
 * Clean, elegant header for content sections
 */

interface Props {
  title: string
  subtitle?: string
  badge?: {
    text: string
    icon?: string
  }
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  size: 'md'
})

const titleSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-2xl md:text-3xl'
    case 'lg': return 'text-3xl md:text-5xl'
    default: return 'text-3xl md:text-4xl'
  }
})

const alignClass = computed(() => {
  switch (props.align) {
    case 'left': return 'text-left'
    case 'right': return 'text-right'
    default: return 'text-center'
  }
})
</script>

<template>
  <div class="mb-12" :class="alignClass">
    <!-- Badge -->
    <div 
      v-if="badge"
      class="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
    >
      <UIcon v-if="badge.icon" :name="badge.icon" class="text-green-600 dark:text-green-400 text-sm" />
      <span class="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
        {{ badge.text }}
      </span>
    </div>

    <!-- Title -->
    <h2 
      class="font-bold text-gray-800 dark:text-white mb-4 relative inline-block"
      :class="titleSizeClass"
    >
      {{ title }}
      
      <!-- Animated Underline -->
      <span 
        v-if="align === 'center'"
        class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
      />
      <span 
        v-else-if="align === 'left'"
        class="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
      />
      <span 
        v-else-if="align === 'right'"
        class="absolute -bottom-2 right-0 w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
      />
    </h2>

    <!-- Subtitle -->
    <p 
      v-if="subtitle"
      class="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed"
      :class="{ 'mx-auto': align === 'center' }"
    >
      {{ subtitle }}
    </p>

    <!-- Slot for custom content -->
    <slot />
  </div>
</template>
