<script setup lang="ts">
const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  currentCategory: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:category']);

const selectCategory = (category) => {
  emit('update:category', category);
};
</script>

<template>
  <div class="markets-filter">
    <div class="flex flex-wrap gap-2 justify-center">
      <button
        v-for="category in categories"
        :key="category"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          currentCategory === category
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="selectCategory(category)"
      >
        {{ category === 'all' ? 'Semua Produk' : category }}
      </button>
    </div>
  </div>
</template>