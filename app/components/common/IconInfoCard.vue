<script setup lang="ts">
/**
 * IconInfoCard - Single Card with Icon, Title, Description
 * Modern card design with hover effects and glassmorphism
 */

interface Props {
  icon: string
  title: string
  description: string
  color?: string
  link?: string
  variant?: 'default' | 'outlined' | 'gradient'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'green',
  variant: 'default',
  hoverable: true
})

const colorClass = computed(() => {
  const colors: Record<string, string> = {
    green: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
  }
  return colors[props.color] || colors.green
})

const cardClass = computed(() => {
  const base = 'group relative overflow-hidden rounded-xl p-6 transition-all duration-300'
  
  if (props.variant === 'outlined') {
    return `${base} bg-transparent border-2 border-gray-200 dark:border-gray-700 ${props.hoverable ? 'hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg' : ''}`
  }
  
  if (props.variant === 'gradient') {
    return `${base} bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 shadow-md ${props.hoverable ? 'hover:shadow-xl hover:-translate-y-1' : ''}`
  }
  
  // Default variant
  return `${base} bg-white dark:bg-gray-800 shadow-sm ${props.hoverable ? 'hover:shadow-lg hover:-translate-y-1' : ''}`
})
</script>

<template>
  <component
    :is="link ? 'NuxtLink' : 'div'"
    :to="link"
    :class="cardClass"
  >
    <!-- Hover Glow Effect -->
    <div 
      v-if="hoverable"
      class="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300 pointer-events-none"
    />

    <!-- Content Container -->
    <div class="relative z-10">
      <!-- Icon -->
      <div 
        class="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl transition-transform duration-300"
        :class="[colorClass, hoverable ? 'group-hover:scale-110' : '']"
      >
        <UIcon :name="icon" class="text-2xl" />
      </div>

      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3 transition-colors duration-300">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
        {{ description }}
      </p>

      <!-- Link Indicator -->
      <div 
        v-if="link"
        class="flex items-center gap-2 mt-4 text-green-600 dark:text-green-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <span>Lihat detail</span>
        <UIcon name="i-lucide-arrow-right" class="text-sm transition-transform group-hover:translate-x-1" />
      </div>
    </div>

    <!-- Slot for additional content -->
    <slot />
  </component>
</template>
