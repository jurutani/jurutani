<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { CreateButton } from '#components'
import { useAsyncData } from '#app'

// Supabase client
const { supabase } = useSupabase()

// Data utama
const marketsList = ref([])
const error = ref<any>(null)
const loading = ref(true)

// Filter & pagination
const currentCategory = ref('Semua')
const categories = ['Semua', 'Hasil Pertanian', 'Hasil Peternakan', 'Produk Olahan', 'Penunjang Pertanian', 'Lainya']
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = ref(1)

// Fungsi fetch data
const fetchMarkets = async () => {
  loading.value = true
  error.value = null

  try {
    let query = supabase
      .from('markets')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .is('archived_at', null)
      .eq('status', 'Approved') // perbaikan di sini
      .order('created_at', { ascending: false })
      .range(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value - 1
      )

    if (currentCategory.value !== 'Semua') {
      query = query.eq('category', currentCategory.value)
    }

    const { data, error: fetchError, count } = await query

    if (fetchError) throw fetchError

    marketsList.value = data || []
    totalPages.value = Math.ceil((count || 0) / pageSize.value)
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
}

// SSR-friendly data fetch on first load
await useAsyncData('markets', () => fetchMarkets())

// Watchers untuk filter dan pagination
watch(currentCategory, () => {
  currentPage.value = 1
  fetchMarkets()
})

watch(currentPage, () => {
  fetchMarkets()
})
</script>

<template>
  <div class="markets-page container mx-auto px-4">
    <!-- Pasar Section Header -->
    <div class="mx-auto mb-16 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
        </svg>
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Marketplace Petani Terpercaya</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Pasar Tani JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Jelajahi marketplace produk lokal dengan pilihan lengkap 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">hasil pertanian segar</span>, 
        <span class="font-semibold text-teal-600 dark:text-teal-400">produk peternakan berkualitas</span>, dan 
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">olahan artisan</span> langsung dari petani dan produsen terpercaya.
      </p>
    </div>
    
    <!-- Category Filter -->
    <MarketsFilterCategory 
      :categories="categories" 
      :current-category="currentCategory" 
      @update:category="currentCategory = $event" 
    />
    
    <!-- Markets Content -->
    <div class="mt-8">
      <LoadingData v-if="loading"/>      
      <ErrorData v-else-if="error" />
      <NotFoundData v-else-if="marketsList.length === 0" />
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MarketsCardContent 
          v-for="product in marketsList" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
    
    <!-- Pagination -->
    <Pagination 
      v-if="!loading && marketsList.length > 0" 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @prev="currentPage > 1 ? currentPage-- : null" 
      @next="currentPage < totalPages ? currentPage++ : null" 
      @goto="page => currentPage = page" 
    />
    <CreateButton />
  </div>
</template>