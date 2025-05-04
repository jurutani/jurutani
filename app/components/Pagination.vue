<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  prev: []
  next: []
  goto: [page: number]
}>()

const pageNumbers = computed(() => {
  const pages = []
  const maxPagesToShow = 5

  if (props.totalPages <= maxPagesToShow) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    const startPage = Math.max(2, props.currentPage - 1)
    const endPage = Math.min(props.totalPages - 1, props.currentPage + 1)

    if (startPage > 2) pages.push('...')
    for (let i = startPage; i <= endPage; i++) pages.push(i)
    if (endPage < props.totalPages - 1) pages.push('...')
    pages.push(props.totalPages)
  }

  return pages
})
</script>

<template>
  <div class="pagination flex justify-center items-center space-x-2 my-8">
    <!-- Tombol Sebelumnya -->
    <button
      class="px-3 py-1 rounded border font-medium"
      :class="[
        currentPage === 1
          ? 'bg-green-100 text-green-400 border-green-200 cursor-not-allowed'
          : 'bg-white text-green-700 border-green-400 hover:bg-green-50'
      ]"
      :disabled="currentPage === 1"
      @click="emit('prev')"
    >
      &laquo;
    </button>

    <!-- Nomor Halaman -->
    <template v-for="(page, index) in pageNumbers" :key="index">
      <button
        v-if="page !== '...'"
        class="px-3 py-1 rounded border font-medium transition"
        :class="[
          page === currentPage
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-green-700 border-green-400 hover:bg-green-100'
        ]"
        @click="emit('goto', page)"
      >
        {{ page }}
      </button>
      <span v-else class="px-2 text-green-500">...</span>
    </template>

    <!-- Tombol Selanjutnya -->
    <button
      class="px-3 py-1 rounded border font-medium"
      :class="[
        currentPage === totalPages
          ? 'bg-green-100 text-green-400 border-green-200 cursor-not-allowed'
          : 'bg-white text-green-700 border-green-400 hover:bg-green-50'
      ]"
      :disabled="currentPage === totalPages"
      @click="emit('next')"
    >
      &raquo;
    </button>
  </div>
</template>
