<script setup lang="ts">
defineProps<{
  categories: string[]
  currentCategory: string
}>()

const emit = defineEmits<{
  'update:category': [category: string]
}>()

const formatCategory = (category: string): string => {
  if (category === 'all') return 'Semua'
  return category.charAt(0).toUpperCase() + category.slice(1)
}
</script>

<template>
  <div class="category-filter my-6">
    <div class="flex flex-wrap justify-center gap-2 md:gap-4">
      <button
        v-for="category in categories"
        :key="category"
        class="px-4 py-2 rounded-full text-sm font-medium transition-colors border"
        :class="[
          currentCategory === category
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
        ]"
        @click="emit('update:category', category)"
      >
        {{ formatCategory(category) }}
      </button>
    </div>
  </div>
</template>
