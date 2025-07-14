<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAsyncData } from '#app'

// Types
interface Announcement {
  id: string
  category: string
  created_at: string
  deleted_at?: string
  archived_at?: string
  title?: string
  content?: string
  image_url?: string // Kolom baru untuk image URL
  attachments?: string[] // Array string untuk nama file attachments
}

interface Category {
  id?: string
  name: string
  value?: string
}

// Supabase client
const { supabase } = useSupabase()

// Data utama
const announcements = ref<Announcement[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

// Filter & pagination
const currentCategory = ref('all')
const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)
const totalItems = ref(0)
const categories = ref<Category[]>([])

// Ambil kategori dari tabel 'category_meetings' atau sesuai dengan struktur database Anda
const { data: categoriesData } = await useAsyncData('announcement-categories', async () => {
  try {
    // Jika ada tabel khusus untuk kategori meetings, gunakan ini:
    // const { data, error: catError } = await supabase
    //   .from('category_meetings')
    //   .select('name')
    //   .order('name', { ascending: true })

    // Atau jika menggunakan hardcoded categories seperti sebelumnya:
    const hardcodedCategories = ['Online', 'Offline', 'Lainya']
    
    return hardcodedCategories.map(cat => ({ name: cat })) as Category[]
  } catch (err) {
    console.error('Error fetching announcement categories:', err)
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

// Fungsi untuk generate URL image dan attachment
const generateImageUrl = (id: string, imageFileName?: string) => {
  if (!imageFileName) return null
  return supabase.storage
    .from('meetings')
    .getPublicUrl(`${id}/image/${imageFileName}`)
    .data.publicUrl
}

const generateAttachmentUrl = (id: string, attachmentFileName: string) => {
  return supabase.storage
    .from('meetings')
    .getPublicUrl(`${id}/attachment/${attachmentFileName}`)
    .data.publicUrl
}

// Fungsi fetch data yang dioptimasi
const fetchAnnouncements = async () => {
  loading.value = true
  error.value = null

  try {
    // Build query dengan method chaining yang lebih efisien
    const baseQuery = supabase
      .from('meetings')
      .select('id, category, created_at, title, content, image_url, attachments', { count: 'exact' })
      .is('deleted_at', null)
      .is('archived_at', null)

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

    // Process data untuk menambahkan full URLs
    const processedData = (data as Announcement[] || []).map(item => ({
      ...item,
      // Generate full URL untuk image
      fullImageUrl: generateImageUrl(item.id, item.image_url),
      // Generate full URLs untuk attachments
      fullAttachmentUrls: item.attachments?.map(filename => ({
        filename,
        url: generateAttachmentUrl(item.id, filename)
      })) || []
    }))

    announcements.value = processedData
    totalItems.value = count || 0
    totalPages.value = Math.ceil(totalItems.value / pageSize)
  } catch (err: any) {
    error.value = err.message || 'Terjadi kesalahan saat memuat pengumuman'
    console.error('Error fetching announcements:', err)
  } finally {
    loading.value = false
  }
}

// SSR-friendly data fetch on first load
await useAsyncData('announcements', fetchAnnouncements)

// Gunakan watchEffect untuk reaktivitas yang lebih efisien
watchEffect(() => {
  fetchAnnouncements()
})

// Computed untuk status
const isLoading = computed(() => loading.value)
const hasError = computed(() => !!error.value)
const hasData = computed(() => announcements.value.length > 0)
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
  <div class="announcement-page container mx-auto px-4 py-12">
    <!-- Header Section -->
    <div class="mx-auto mb-6 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-users" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Pengembangan Kemampuan Pertanian</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Pengumuman Course & Pelatihan
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Temukan berbagai kesempatan untuk mengembangkan kemampuan pertanian melalui
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">kursus bersertifikat</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">pelatihan praktis</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">workshop inovatif</span> yang diselenggarakan oleh JuruTani.
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

    <!-- Announcements Content -->
    <div class="mt-8">
      <LoadingData v-if="isLoading" />      
      <ErrorData v-else-if="hasError" :error="error" />
      <NotFoundData v-else-if="!hasData" />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnnouncementCardContent 
          v-for="item in announcements" 
          :key="item.id" 
          :announcement="item" 
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