<script setup lang="ts">
import type { FoodWithPrice } from '~/types'

interface Props {
  food: FoodWithPrice
  compact?: boolean
}

const props = defineProps<Props>()

const { formatCurrency, formatDate, getCategoryIcon, getCategoryLabel } = useFoodPrices()
const { loadImageWithFallback, getFeatureImage } = useFoodImage()

// Image state
const foodImage = ref<string>('')
const imageLoading = ref(true)
const imageError = ref(false)

// Load image with fallback
const loadImage = async () => {
  imageLoading.value = true
  imageError.value = false
  
  try {
    const finalImageUrl = await loadImageWithFallback(props.food.image_url, props.food.slug)
    foodImage.value = finalImageUrl
  } catch (err) {
    console.error('Error loading image:', err)
    foodImage.value = getFeatureImage(props.food.slug)
    imageError.value = true
  } finally {
    imageLoading.value = false
  }
}

// Handle image error
const handleImageError = () => {
  if (!imageError.value) {
    imageError.value = true
    foodImage.value = getFeatureImage(props.food.slug)
  }
}

// Price change badge
const priceChangeBadge = computed(() => {
  if (!props.food.price_change) {
    return { color: 'neutral' as const, label: 'Stabil', icon: 'i-lucide-minus' }
  }

  const change = props.food.price_change
  const percent = props.food.price_change_percent || 0

  if (change > 0) {
    return {
      color: 'error' as const,
      label: `+${Math.abs(percent).toFixed(1)}%`,
      icon: 'i-lucide-trending-up'
    }
  } else if (change < 0) {
    return {
      color: 'success' as const,
      label: `${Math.abs(percent).toFixed(1)}%`,
      icon: 'i-lucide-trending-down'
    }
  }

  return { color: 'neutral' as const, label: 'Stabil', icon: 'i-lucide-minus' }
})

// Load image on mount
onMounted(() => {
  loadImage()
})

// Watch for food changes
watch(() => props.food.slug, () => {
  loadImage()
})
</script>

<template>
  <NuxtLink
    :to="`/food-prices/${food.slug}`"
    class="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
  >
    <!-- Image -->
    <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
      <!-- Loading placeholder -->
      <div v-if="imageLoading" class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-800 dark:border-t-emerald-400"></div>
        </div>
      </div>
      
      <!-- Image -->
      <img 
        v-else-if="foodImage"
        :src="foodImage" 
        :alt="food.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
        :class="{ 'opacity-0': imageLoading, 'opacity-100': !imageLoading }"
        loading="lazy"
        @error="handleImageError"
      />
      
      <!-- Fallback icon -->
      <div v-else class="w-full h-full flex items-center justify-center">
        <UIcon :name="getCategoryIcon(food.category)" class="w-16 h-16 text-gray-400" />
      </div>
      
      <!-- Price Change Badge -->
      <div v-if="!compact && food.price_change" class="absolute top-3 right-3">
        <UBadge 
          :color="priceChangeBadge.color"
          variant="solid"
          size="xs"
          class="shadow-md"
        >
          <div class="flex items-center gap-1">
            <UIcon :name="priceChangeBadge.icon" class="w-3 h-3" />
            {{ priceChangeBadge.label }}
          </div>
        </UBadge>
      </div>
      
      <!-- Category Badge -->
      <div v-if="!compact" class="absolute top-3 left-3">
        <UBadge 
          color="primary"
          variant="solid"
          size="xs"
          class="shadow-md"
        >
          {{ getCategoryLabel(food.category) }}
        </UBadge>
      </div>
    </div>

    <!-- Content -->
    <div :class="compact ? 'p-4' : 'p-5'">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
          :class="compact ? 'text-sm' : 'text-base'">
        {{ food.name }}
      </h3>
      
      <div v-if="!compact && food.description" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {{ food.description }}
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between mb-3">
        <div>
          <div class="font-bold text-emerald-600 dark:text-emerald-400"
               :class="compact ? 'text-base' : 'text-lg'">
            {{ formatCurrency(food.latest_price || 0) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-500">
            per {{ food.satuan }}
          </div>
        </div>

        <UIcon name="i-lucide-arrow-right" class="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
      </div>

      <!-- Date -->
      <div v-if="!compact && food.latest_price_date" class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
        <UIcon name="i-lucide-clock" class="w-3 h-3" />
        <span>{{ formatDate(food.latest_price_date) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* Smooth image transition */
img {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

/* Hover effects */
.group:hover img {
  filter: brightness(1.05);
}
</style>
