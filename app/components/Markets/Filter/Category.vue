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
      <UButton
        v-for="category in categories"
        :key="category"
        :color="currentCategory === category ? 'green' : 'gray'"
        :variant="currentCategory === category ? 'solid' : 'soft'"
        class="rounded-full text-sm font-medium"
        @click="selectCategory(category)"
      >
        {{ category === 'all' ? 'Semua Produk' : category }}
      </UButton>
    </div>
  </div>
</template>