<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { CreateButton } from '#components'
import { useAsyncData } from '#app'

// Types
interface Course {
  id: string
  category: string
  created_at: string
  title?: string
  description?: string
}

interface Category {
  id?: string
  name: string
  value?: string
}

// Supabase client
const { supabase } = useSupabase()

// Data utama
const courseList = ref<Course[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

// Filter & pagination
const currentCategory = ref('all')
const currentPage = ref(1)
const pageSize = 6
const totalPages = ref(1)
const totalItems = ref(0)
const categories = ref<Category[]>([])

// Search functionality
const searchQuery = ref('')
const searchLoading = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

// Ambil kategori dari tabel 'category'
const { data: categoriesData } = await useAsyncData('course-categories', async () => {
  try {
    const { data, error: catError } = await supabase
      .from('category')
      .select('name')
      .order('name', { ascending: true })

    if (catError) throw catError
    
    return data as Category[]
  } catch (err) {
    console.error('Error fetching course categories:', err)
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

// Fungsi fetch data yang dioptimasi dengan search
const fetchCourses = async () => {
  loading.value = true
  error.value = null

  try {
    // Build query dengan method chaining yang lebih efisien
    let baseQuery = supabase
      .from('courses')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    // Apply search filter jika ada search query
    if (searchQuery.value.trim()) {
      baseQuery = baseQuery.ilike('title', `%${searchQuery.value.trim()}%`)
    }

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

    courseList.value = data as Course[] || []
    totalItems.value = count || 0
    totalPages.value = Math.ceil(totalItems.value / pageSize)
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat memuat kursus'
    console.error('Error fetching courses:', err)
  } finally {
    loading.value = false
  }
}

// SSR-friendly data fetch on first load
await useAsyncData('courses', fetchCourses)

// Watch untuk search query dengan debounce
watch(searchQuery, () => {
  searchLoading.value = true
  
  // Clear timeout sebelumnya
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // Set timeout baru untuk debounce (500ms)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1 // Reset ke halaman 1 saat search
    fetchCourses().finally(() => {
      searchLoading.value = false
    })
  }, 500)
})

// Gunakan watchEffect untuk reaktivitas category dan pagination
watchEffect(() => {
  // Hanya jalankan jika bukan dari search (search sudah handled di watch)
  if (!searchLoading.value) {
    fetchCourses()
  }
})

// Computed untuk status
const isLoading = computed(() => loading.value || searchLoading.value)
const hasError = computed(() => !!error.value)
const hasData = computed(() => courseList.value.length > 0)
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

// Handler untuk clear search
const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

// Cleanup timeout saat component unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<template>
  <div class="course-page container mx-auto py-12">
    <!-- Course Section Header -->
    <div class="mx-auto mb-4 max-w-4xl text-center py-12">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Panduan Lengkap & Terstruktur</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Materi Edukasi JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Jelajahi koleksi lengkap materi edukasi dengan 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">panduan praktis</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">
        teknik berkelanjutan</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">strategi produktivitas</span> untuk mengoptimalkan usaha tani Anda.
      </p>
    </div>
    
    <!-- Search Bar -->
    <div class="mb-8">
      <div class="relative max-w-2xl mx-auto">
        <div class="relative">
          <UIcon 
            name="i-heroicons-magnifying-glass" 
            class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" 
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari materi berdasarkan judul..."
            class="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          >
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <!-- Loading indicator saat search -->
            <div v-if="searchLoading" class="animate-spin">
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-emerald-500" />
            </div>
            <!-- Clear button -->
            <button
              v-if="searchQuery"
              class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              @click="clearSearch"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          </div>
        </div>
        
        <!-- Search info -->
        <div v-if="searchQuery && !isLoading" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
          {{ totalItems > 0 ? `Ditemukan ${totalItems} materi` : 'Tidak ada materi yang ditemukan' }}
          untuk "<span class="font-medium text-emerald-600 dark:text-emerald-400">{{ searchQuery }}</span>"
        </div>
      </div>
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
    
    <!-- Course Content -->
    <div class="mt-8">
      <LoadingData v-if="isLoading" />      
      <ErrorData v-else-if="hasError" :error="error" />
      
      <!-- No results for search -->
      <div v-else-if="!hasData && searchQuery" class="text-center py-12">
        <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Tidak ada materi ditemukan
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda
        </p>
        <button
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          @click="clearSearch"
        >
          Hapus Pencarian
        </button>
      </div>
      
      <NotFoundData v-else-if="!hasData" />
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCardContent 
          v-for="course in courseList" 
          :key="course.id" 
          :course="course" 
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
    
  </div>
</template>

<style scoped>
.course-page {
  min-height: calc(100vh - 200px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .course-page {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Custom search bar styles */
.course-page input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>