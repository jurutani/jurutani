<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  showOnlineIndicator?: boolean
  isAuthenticated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: '/profile.png',
  alt: 'User avatar',
  size: 'md',
  showOnlineIndicator: false,
  isAuthenticated: false,
})

// Handle image load error
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  console.error('Avatar image failed to load:', target.src)
  target.src = '/profile.png'
}

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }
  return sizes[props.size]
})

// Track mounted state to prevent hydration mismatch
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

// Ring classes - use isMounted to prevent hydration mismatch
const ringClasses = computed(() => 
  isMounted.value && props.isAuthenticated 
    ? 'ring-green-500/30 hover:ring-green-500/50' 
    : 'ring-gray-300/30 hover:ring-gray-300/50'
)
</script>

<template>
  <div 
    class="relative rounded-full overflow-hidden ring-2 transition-all duration-200"
    :class="[sizeClasses, ringClasses]"
  >
    <img
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="handleImageError"
    />
    
    <!-- Online indicator -->
    <div
      v-if="showOnlineIndicator && isAuthenticated"
      class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-green-950 rounded-full"
      aria-label="Online"
    />
  </div>
</template>

<style scoped>
img {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

div:hover img {
  transform: scale(1.05);
}
</style>
