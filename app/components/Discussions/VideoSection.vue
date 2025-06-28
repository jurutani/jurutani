<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { CreateButton, VideoCardContent } from '#components'
import { useAsyncData } from '#app'

// Types
interface Video {
  id: string
  category: string
  created_at: string
  title?: string
  description?: string
  url?: string
  thumbnail?: string
}

interface Category {
  id?: string
  name: string
  value?: string
}

// Supabase client
const { supabase } = useSupabase()

// Data utama
const videoList = ref<Video[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

// Filter & pagination
const currentCategory = ref('all')
const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)
const totalItems = ref(0)
const categories = ref<Category[]>([])

// Ambil kategori dari tabel 'category_videos' atau gunakan kategori statis
const { data: categoriesData } = await useAsyncData('video-categories', async () => {
  try {
    // Coba ambil dari tabel kategori terlebih dahulu
    const { data, error: catError } = await supabase
      .from('category_videos')
      .select('name')
      .order('name', { ascending: true })

    if (catError) {
      // Jika tabel kategori tidak ada, gunakan kategori statis
      console.warn('Category table not found, using static categories')
      return [
        { name: 'Pertanian' },
        { name: 'Peternakan' },
        { name: 'Teknologi' },
        { name: 'Lainya' }
      ]
    }
    
    return data as Category[]
  } catch (err) {
    console.error('Error fetching video categories:', err)
    // Fallback ke kategori statis
    return [
      { name: 'Pertanian' },
      { name: 'Peternakan' },
      { name: 'Teknologi' },
      { name: 'Lainya' }
    ]
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
const fetchVideos = async () => {
  loading.value = true
  error.value = null

  try {
    // Build query dengan method chaining yang lebih efisien
    const baseQuery = supabase
      .from('videos')
      .select('*', { count: 'exact' })
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

    videoList.value = data as Video[] || []
    totalItems.value = count || 0
    totalPages.value = Math.ceil(totalItems.value / pageSize)
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat memuat video'
    console.error('Error fetching videos:', err)
  } finally {
    loading.value = false
  }
}

// SSR-friendly data fetch on first load
await useAsyncData('videos', fetchVideos)

// Gunakan watchEffect untuk reaktivitas yang lebih efisien
watchEffect(() => {
  fetchVideos()
})

// Computed untuk status
const isLoading = computed(() => loading.value)
const hasError = computed(() => !!error.value)
const hasData = computed(() => videoList.value.length > 0)
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
  <div class="video-page container mx-auto px-4 py-12">
    <!-- Video Section Header -->
    <div class="mx-auto mb-6 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-play-circle" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Pembelajaran Visual & Interaktif</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Video Edukasi JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Akses koleksi lengkap video pembelajaran pertanian dengan 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">tutorial praktis</span>, 
        <span class="font-semibold text-teal-600 dark:text-teal-400">teknik modern</span>, dan  
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">tips ahli</span> untuk meningkatkan produktivitas dan keterampilan pertanian Anda.
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
    
    <!-- Video Content -->
    <div class="mt-8">
      <LoadingData v-if="isLoading" />      
      <ErrorData v-else-if="hasError" :error="error" />
      <NotFoundData v-else-if="!hasData" />
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <VideoCardContent 
          v-for="video in videoList" 
          :key="video.id" 
          :video="video" 
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

<style scoped>
.video-page {
  min-height: calc(100vh - 200px);
}
</style>