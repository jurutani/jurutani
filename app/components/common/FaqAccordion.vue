<script setup lang="ts">
/**
 * FaqAccordion - Enhanced FAQ Accordion Component
 * With search, filter, and smooth animations
 */

import type { FaqItem } from '~/data/types'

interface Props {
  items: FaqItem[]
  searchable?: boolean
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchable: false,
  defaultOpen: false
})

const searchQuery = ref('')
const openItems = ref<Set<number>>(new Set())

// Initialize default open state
if (props.defaultOpen && props.items.length > 0) {
  openItems.value.add(0)
}

const filteredItems = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) {
    return props.items
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item => 
    item.question.toLowerCase().includes(query) || 
    item.answer.toLowerCase().includes(query)
  )
})

const toggleItem = (index: number) => {
  if (openItems.value.has(index)) {
    openItems.value.delete(index)
  } else {
    openItems.value.add(index)
  }
}

const isOpen = (index: number) => openItems.value.has(index)
</script>

<template>
  <div>
    <!-- Search Bar -->
    <div v-if="searchable" class="mb-6">
      <div class="relative">
        <UIcon 
          name="i-lucide-search" 
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pertanyaan..."
          class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all"
        />
      </div>
      
      <!-- Results count -->
      <p 
        v-if="searchQuery"
        class="mt-2 text-sm text-gray-600 dark:text-gray-400"
      >
        Ditemukan {{ filteredItems.length }} pertanyaan
      </p>
    </div>

    <!-- Accordion Items -->
    <div 
      v-if="filteredItems.length > 0"
      class="space-y-3"
    >
      <div
        v-for="(item, index) in filteredItems"
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md"
      >
        <!-- Question Button -->
        <button
          @click="toggleItem(index)"
          class="w-full px-6 py-4 flex items-center justify-between gap-4 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-750"
          :aria-expanded="isOpen(index)"
        >
          <span class="font-medium text-lg text-gray-800 dark:text-white flex-1">
            {{ item.question }}
          </span>
          <UIcon 
            :name="isOpen(index) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="text-green-600 dark:text-green-400 text-xl transition-transform duration-300 flex-shrink-0"
            :class="{ 'rotate-180': isOpen(index) }"
          />
        </button>

        <!-- Answer Content -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div 
            v-show="isOpen(index)"
            class="overflow-hidden"
          >
            <div class="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
              {{ item.answer }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- No results message -->
    <div 
      v-else
      class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl"
    >
      <UIcon name="i-lucide-search-x" class="text-5xl text-gray-400 mb-4 mx-auto" />
      <p class="text-gray-600 dark:text-gray-400">
        Tidak ada pertanyaan yang cocok dengan pencarian Anda.
      </p>
    </div>

    <!-- Slot for additional content -->
    <slot />
  </div>
</template>
