<script setup lang="ts">
import type { NewsUpdated } from '~/types/news'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Berita Terbaru',
  description: 'Berita dan artikel terbaru tentang pertanian dan agrikultur'
})

const { supabase } = useSupabase()
const { getImageUrl, getExcerpt, formatDate, getStatusBadge } = useNewsUpdatedUtils()

// Filters
const selectedCategory = ref<string>('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 9

// Fetch categories
const { data: categories } = await useAsyncData('category_news_updated', async () => {
  const { data, error } = await supabase
    .from('category_news')
    .select('name, value')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
})

const categoryItems = computed(() => {
  const items = [{ label: 'Semua Kategori', value: '' }]
  if (categories.value) {
    items.push(...categories.value.map(cat => ({
      label: cat.name,
      value: cat.value
    })))
  }
  return items
})

// Fetch news with filters
const { data: newsData, pending: loading, refresh } = await useAsyncData(
  'news_updated_list',
  async () => {
    let query = supabase
      .from('news_updated')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .eq('status_news', 'approved')

    // Apply category filter
    if (selectedCategory.value) {
      query = query.eq('category', selectedCategory.value)
    }

    // Apply search filter
    if (searchQuery.value) {
      query = query.or(`title.ilike.%${searchQuery.value}%,sub_title.ilike.%${searchQuery.value}%`)
    }

    // Sorting and pagination
    const from = (currentPage.value - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      items: data as NewsUpdated[],
      total: count || 0
    }
  },
  {
    watch: [selectedCategory, searchQuery, currentPage]
  }
)

const newsList = computed(() => newsData.value?.items || [])
const totalItems = computed(() => newsData.value?.total || 0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))
const hasData = computed(() => newsList.value.length > 0)

// Handle category change
function onCategoryChange(value: string) {
  selectedCategory.value = value
  currentPage.value = 1
}

// Handle search
function onSearch() {
  currentPage.value = 1
  refresh()
}
</script>

<template>
  <main class="container mx-auto px-4 py-12">
    <!-- Header -->
    <header class="mx-auto mb-8 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-newspaper" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Berita Terbaru</span>
      </div>
      
      <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
        Berita & Artikel Pertanian
      </h1>
      
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Dapatkan informasi terkini seputar dunia pertanian dan agrikultur
      </p>
    </header>

    <!-- Filters -->
    <div class="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      <!-- Search -->
      <div class="w-full md:w-96">
        <UInput
          v-model="searchQuery"
          placeholder="Cari berita..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          @keyup.enter="onSearch"
        >
          <template #trailing>
            <UButton
              v-if="searchQuery"
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="xs"
              @click="searchQuery = ''; onSearch()"
            />
          </template>
        </UInput>
      </div>

      <!-- Category Filter & Create Button -->
      <div class="flex gap-3 items-center w-full md:w-auto">
        <USelect
          v-model="selectedCategory"
          :options="categoryItems"
          placeholder="Pilih Kategori"
          size="lg"
          class="w-full md:w-64"
          @change="onCategoryChange"
        />
        
        <!-- Create Button -->
        <UButton
          to="/update/create"
          color="primary"
          size="lg"
          icon="i-lucide-plus"
        >
          Buat Berita
        </UButton>
      </div>
    </div>

    <!-- Active Filters -->
    <div v-if="searchQuery || selectedCategory" class="mb-6 flex items-center gap-2 flex-wrap">
      <span class="text-sm text-gray-600 dark:text-gray-400">Filter aktif:</span>
      
      <UBadge v-if="searchQuery" color="primary" variant="soft">
        <UIcon name="i-lucide-search" class="w-3 h-3" />
        "{{ searchQuery }}"
        <button @click="searchQuery = ''; onSearch()" class="ml-1">
          <UIcon name="i-lucide-x" class="w-3 h-3" />
        </button>
      </UBadge>
      
      <UBadge v-if="selectedCategory" color="primary" variant="soft">
        <UIcon name="i-lucide-folder" class="w-3 h-3" />
        {{ categoryItems.find(c => c.value === selectedCategory)?.label }}
        <button @click="selectedCategory = ''; onCategoryChange('')" class="ml-1">
          <UIcon name="i-lucide-x" class="w-3 h-3" />
        </button>
      </UBadge>
      
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        @click="searchQuery = ''; selectedCategory = ''; currentPage = 1"
      >
        Reset Semua
      </UButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-lg"></div>
        <div class="p-5 space-y-3">
          <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/4"></div>
          <div class="bg-gray-200 dark:bg-gray-700 h-6 rounded w-3/4"></div>
          <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-full"></div>
          <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- News Grid -->
    <div v-else-if="hasData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <NuxtLink
        v-for="news in newsList"
        :key="news.id"
        :to="`/update/${news.slug}`"
        class="group block"
      >
        <article class="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 bg-white dark:bg-gray-800">
          <!-- Image -->
          <div class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              :src="getImageUrl(news)"
              :alt="news.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            >
            
            <!-- Gallery badge -->
            <div v-if="news.images && news.images.length > 0" class="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full flex items-center gap-1">
              <UIcon name="i-lucide-images" class="w-3 h-3" />
              {{ news.images.length }}
            </div>
            
            <!-- Category badge -->
            <div class="absolute bottom-2 left-2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full shadow-lg">
              {{ news.category }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 space-y-3">
            <!-- Date -->
            <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <UIcon name="i-lucide-calendar" class="w-3 h-3" />
              <time>{{ formatDate(news.created_at) }}</time>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors min-h-14">
              {{ news.title }}
            </h3>

            <!-- Sub Title or Excerpt -->
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 min-h-18">
              {{ news.sub_title || getExcerpt(news.content) }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <!-- Attachments indicator -->
              <div v-if="news.attachments && news.attachments.length > 0" class="flex items-center gap-1 text-xs text-gray-500">
                <UIcon name="i-lucide-paperclip" class="w-3 h-3" />
                {{ news.attachments.length }} lampiran
              </div>
              <div v-else></div>
              
              <!-- Read more -->
              <span class="text-sm font-medium text-primary group-hover:gap-2 flex items-center gap-1 transition-all">
                Baca
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </article>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <UIcon name="i-heroicons-newspaper" class="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
      
      <h3 class="text-xl font-semibold mb-2">Belum ada berita</h3>
      
      <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {{ searchQuery || selectedCategory 
          ? 'Tidak ada berita yang sesuai dengan filter Anda. Coba ubah filter atau reset pencarian.' 
          : 'Belum ada berita yang dipublikasikan. Jadilah yang pertama membuat berita!' 
        }}
      </p>
      
      <div class="flex gap-3 justify-center">
        <UButton
          v-if="searchQuery || selectedCategory"
          color="neutral"
          variant="soft"
          @click="searchQuery = ''; selectedCategory = ''; currentPage = 1"
        >
          <UIcon name="i-lucide-refresh-cw" class="w-4 h-4" />
          Reset Filter
        </UButton>
        
        <UButton
          to="/update/create"
          color="primary"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          Buat Berita Pertama
        </UButton>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="hasData && totalPages > 1" class="flex justify-center mt-12">
      <UPagination
        v-model="currentPage"
        :total="totalItems"
        :page-size="pageSize"
        :max="7"
        show-first
        show-last
      />
    </div>
  </main>
</template>