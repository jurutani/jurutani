<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { CreateButton } from '#components'
import { useAsyncData } from '#app'

// Types
interface News {
  id: string
  category: string
  status_news: string
  created_at: string
  title?: string
  content?: string
}

interface Category {
  name: string
}

// Supabase client
const { supabase } = useSupabase()

// Data utama
const newsList = ref<News[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

// Filter & pagination
const currentCategory = ref('Semua')
const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)
const categories = ref<string[]>(['Semua'])

// Computed untuk filtered news count
const filteredCount = ref(0)

// Ambil kategori dari tabel 'category-news'
const { data: categoriesData } = await useAsyncData('news-categories', async () => {
  try {
    const { data, error: catError } = await supabase
      .from('category_news')
      .select('name')
      .order('name', { ascending: true })

    if (catError) throw catError
    
    return data as Category[]
  } catch (err) {
    console.error('Error fetching news categories:', err)
    return []
  }
})

// Set categories setelah data dimuat
if (categoriesData.value) {
  categories.value = ['Semua', ...categoriesData.value.map(c => c.name)]
}

// Fungsi fetch data yang dioptimasi
const fetchNews = async () => {
  loading.value = true
  error.value = null

  try {
    // Build query dengan method chaining yang lebih efisien
    const baseQuery = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .eq('status_news', 'approved')

    // Apply category filter jika bukan 'Semua'
    const query = currentCategory.value !== 'Semua' 
      ? baseQuery.eq('category', currentCategory.value)
      : baseQuery

    // Apply pagination dan ordering
    const { data, error: fetchError, count } = await query
      .order('created_at', { ascending: false })
      .range(
        (currentPage.value - 1) * pageSize,
        currentPage.value * pageSize - 1
      )

    if (fetchError) throw fetchError

    newsList.value = data as News[] || []
    filteredCount.value = count || 0
    totalPages.value = Math.ceil(filteredCount.value / pageSize)
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat memuat berita'
    console.error('Error fetching news:', err)
  } finally {
    loading.value = false
  }
}

// SSR-friendly data fetch on first load
await useAsyncData('news', fetchNews)

// Gunakan watchEffect untuk reaktivitas yang lebih efisien
watchEffect(() => {
  // Reset ke halaman 1 saat kategori berubah
  if (currentCategory.value !== 'Semua') {
    currentPage.value = 1
  }
  fetchNews()
})

// Computed untuk status loading yang lebih baik
const isLoading = computed(() => loading.value)
const hasError = computed(() => !!error.value)
const hasData = computed(() => newsList.value.length > 0)
const showPagination = computed(() => !isLoading.value && hasData.value && totalPages.value > 1)

// Handler untuk pagination
const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handleGotoPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Handler untuk category change
const handleCategoryChange = (category: string) => {
  currentCategory.value = category
}
</script>

<template>
  <div class="news-page container mx-auto px-4 py-12">
    <!-- News Section Header -->
    <div class="mx-auto mb-6 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-newspaper" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Berita Terupdate Jurutani</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Berita Tani JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Dapatkan informasi terkini seputar dunia pertanian, teknologi, dan inovasi dengan
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">berita terpercaya</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">update teknologi</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">prestasi petani</span> yang menginspirasi.
      </p> 
    </div>
    
    <!-- Category Filter -->
    <NewsFilterCategory 
      :categories="categories" 
      :current-category="currentCategory" 
      @update:category="handleCategoryChange" 
    />
    
    <!-- News Content -->
    <div class="mt-8">
      <LoadingData v-if="isLoading" />      
      <ErrorData v-else-if="hasError" :error="error" />
      <NotFoundData v-else-if="!hasData" />
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NewsCardContent 
          v-for="news in newsList" 
          :key="news.id" 
          :news="news" 
        />
      </div>
    </div>
    
    <!-- Pagination -->
    <Pagination 
      v-if="showPagination"
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @prev="handlePrevPage" 
      @next="handleNextPage" 
      @goto="handleGotoPage" 
    />
    
    <CreateButton />
  </div>
</template>