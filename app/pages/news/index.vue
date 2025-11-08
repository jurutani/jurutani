<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { CreateButton } from '#components'
import { useAsyncData } from '#app'

definePageMeta({
  layout: 'default',
})

// SEO Optimization
useSeoOptimized('news')

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
  id?: string
  name: string
  value?: string
}

// Supabase client
const { supabase } = useSupabase()

// Data utama
const newsList = ref<News[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

// Filter & pagination
const currentCategory = ref('all')
const currentPage = ref(1)
const pageSize = 9
const totalPages = ref(1)
const totalItems = ref(0)
const categories = ref<Category[]>([])

// Ambil kategori dari tabel 'category_news'
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
  categories.value = categoriesData.value.map(cat => ({
    name: cat.name,
    value: cat.name
  }))
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
      .is('deleted_at', null)

    // Apply category filter jika bukan 'all'
    const query = currentCategory.value !== 'all' && currentCategory.value !== 'semua'
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
    totalItems.value = count || 0
    totalPages.value = Math.ceil(totalItems.value / pageSize)
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
  fetchNews()
})

// Computed untuk status
const isLoading = computed(() => loading.value)
const hasError = computed(() => !!error.value)
const hasData = computed(() => newsList.value.length > 0)
const showPagination = computed(() => !isLoading.value && hasData.value && totalPages.value > 1)

// Handler untuk category change
const handleCategoryChange = (category: string) => {
  // Reset ke halaman 1 saat kategori berubah
  currentCategory.value = category
  currentPage.value = 1
}

// Handler untuk pagination change
const handlePageChange = (page: number) => {
  currentPage.value = page
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
        Berita Tani Juru Tani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Dapatkan informasi terkini seputar dunia pertanian, teknologi, dan inovasi dengan
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">berita terpercaya</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">update teknologi</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">prestasi petani</span> yang menginspirasi.
      </p> 
    </div>
    
    <!-- Category Filter -->
    <AppCategoryFilter 
      :categories="categories" 
      :current-category="currentCategory"
      :show-all-option="true"
      all-option-text="Semua"
      all-option-value="all"
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
    <AppPagination 
      v-if="showPagination"
      :current-page="currentPage" 
      :total-pages="totalPages"
      :total-items="totalItems"
      :page-size="pageSize"
      :show-page-info="true"
      :show-first-last="true"
      @update:page="handlePageChange"
    />
    
    <CreateButton />
  </div>
</template>