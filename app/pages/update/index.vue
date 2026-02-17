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

// Get image URL helper
function getImageUrl(news: NewsUpdated): string {
  const { supabase } = useSupabase()
  
  // Priority: cover_image, then first image from gallery, then placeholder
  const imagePath = news.cover_image || (news.images && news.images.length > 0 ? news.images[0] : null)
  
  if (!imagePath) return '/placeholder.png'
  
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(imagePath)
  
  return data.publicUrl || '/placeholder.png'
}

// Get excerpt from TipTap JSON content
function getExcerpt(content: any, maxLength: number = 150): string {
  if (!content || !content.content) return ''
  
  // Extract text from TipTap JSON
  let text = ''
  
  function extractText(node: any) {
    if (node.text) {
      text += node.text
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any) => extractText(child))
    }
  }
  
  extractText(content)
  
  text = text.trim()
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

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
        />
      </div>

      <!-- Category Filter & Create Button -->
      <div class="flex gap-3 items-center w-full md:w-auto">
        <USelect
          v-model="selectedCategory"
          :options="categoryItems"
          placeholder="Pilih Kategori"
          class="w-full md:w-64"
          @change="onCategoryChange"
        />
        
        <!-- Create Button (always visible) -->
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

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-4"></div>
        <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
        <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
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
        <article class="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <!-- Image -->
          <div class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              :src="getImageUrl(news)"
              :alt="news.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <!-- Gallery badge -->
            <div v-if="news.images && news.images.length > 0" class="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center gap-1">
              <UIcon name="i-lucide-images" class="w-3 h-3" />
              {{ news.images.length }}
            </div>
            <!-- Category badge -->
            <div class="absolute bottom-2 left-2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
              {{ news.category }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <!-- Date -->
            <time class="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
              {{ formatDate(news.created_at) }}
            </time>

            <!-- Title -->
            <h3 class="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {{ news.title }}
            </h3>

            <!-- Sub Title or Excerpt -->
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {{ news.sub_title || getExcerpt(news.content) }}
            </p>

            <!-- Attachments indicator -->
            <div v-if="news.attachments && news.attachments.length > 0" class="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <UIcon name="i-lucide-paperclip" class="w-3 h-3" />
              {{ news.attachments.length }} lampiran
            </div>
          </div>
        </article>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <UIcon name="i-heroicons-newspaper" class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
      <h3 class="text-xl font-semibold mb-2">Belum ada berita</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ searchQuery || selectedCategory ? 'Tidak ada berita yang sesuai dengan filter Anda' : 'Belum ada berita yang dipublikasikan' }}
      </p>
      <UButton
        v-if="searchQuery || selectedCategory"
        color="neutral"
        @click="searchQuery = ''; selectedCategory = ''; currentPage = 1"
      >
        Reset Filter
      </UButton>
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