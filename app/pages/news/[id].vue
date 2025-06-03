<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'

// Types
interface NewsItem {
  id: string
  title: string
  sub_title?: string
  content: string
  category?: string
  status_news: string
  link?: string
  image_url?: string
  attachment_url?: string
  author?: string
  author_id?: string
  created_at: string
  updated_at: string
  published_at?: string
}

// Composables
const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()

// State
const newsId = route.params.id as string
const news = ref<NewsItem | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Computed
const imageUrl = computed(() => {
  if (!news.value?.image_url) return null
  
  // Check if it's already a full URL
  if (news.value.image_url.startsWith('http')) {
    return news.value.image_url
  }
  
  // Get public URL from Supabase storage
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(news.value.image_url)
  
  return data.publicUrl
})

const attachmentUrl = computed(() => {
  if (!news.value?.attachment_url) return null
  
  // Check if it's already a full URL
  if (news.value.attachment_url.startsWith('http')) {
    return news.value.attachment_url
  }
  
  // Get public URL from Supabase storage
  const { data } = supabase.storage
    .from('news-attachments')
    .getPublicUrl(news.value.attachment_url)
  
  return data.publicUrl
})

const attachmentFileName = computed(() => {
  if (!news.value?.attachment_url) return ''
  return news.value.attachment_url.split('/').pop() || 'Lampiran'
})

const attachmentFileType = computed(() => {
  if (!news.value?.attachment_url) return 'FILE'
  const fileName = attachmentFileName.value
  const extension = fileName.split('.').pop()
  return extension?.toUpperCase() || 'FILE'
})

// Methods
const fetchNewsDetail = async (): Promise<void> => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', newsId)
      .eq('status_news', 'approved')
      .single()

    if (fetchError) {
      console.error('Error fetching news:', fetchError)
      error.value = 'Gagal memuat berita'
      return
    }

    if (!data) {
      error.value = 'Berita tidak ditemukan'
      return
    }

    news.value = data
  } catch (err) {
    console.error('Unexpected error:', err)
    error.value = 'Terjadi kesalahan yang tidak terduga'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatCategory = (category?: string): string => {
  if (!category) return 'Lainnya'
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const goBack = (): void => {
  router.push('/news')
}

const openAttachment = (): void => {
  if (attachmentUrl.value) {
    window.open(attachmentUrl.value, '_blank', 'noopener,noreferrer')
  }
}

const openLink = (): void => {
  if (news.value?.link) {
    window.open(news.value.link, '_blank', 'noopener,noreferrer')
  }
}

// Lifecycle
onMounted(() => {
  fetchNewsDetail()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button 
            class="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            @click="goBack"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            <span class="font-medium">Kembali ke Berita</span>
          </button>
          
          <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UIcon name="i-heroicons-newspaper" class="w-5 h-5" />
            <span class="font-semibold">JuruTani News</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
        <p class="text-gray-600 dark:text-gray-400 mt-4">Memuat berita...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Oops! Terjadi Kesalahan</h3>
          <p class="text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
          <UButton color="red" variant="outline" @click="goBack">
            Kembali ke Daftar Berita
          </UButton>
        </div>
      </div>

      <!-- News Content -->
      <article v-else-if="news" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Hero Image -->
        <div class="relative h-64 md:h-80 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="news.title"
            class="w-full h-full object-cover"
            @error="console.log('Image failed to load:', imageUrl)"
          >
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center text-green-600 dark:text-green-400">
              <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p class="text-sm opacity-75">Tidak ada gambar</p>
            </div>
          </div>

          <!-- Category Badge -->
          <div class="absolute top-4 right-4">
            <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full shadow-sm">
              <UIcon name="i-heroicons-tag" class="w-3 h-3" />
              {{ formatCategory(news.category) }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8">
          <!-- Title -->
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
            {{ news.title }}
          </h1>

          <!-- Subtitle -->
          <h2 v-if="news.sub_title" class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {{ news.sub_title }}
          </h2>

          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-user" class="w-4 h-4" />
              <span>{{ news.author || 'Tim JuruTani' }}</span>
            </div>
            
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              <span>{{ formatDate(news.published_at || news.created_at) }}</span>
            </div>
            
            <div v-if="news.updated_at && news.updated_at !== news.created_at" class="flex items-center gap-1">
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
              <span>Diperbarui {{ formatDate(news.updated_at) }}</span>
            </div>
          </div>

          <!-- Main Content -->
          <div 
            class="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 hover:prose-a:text-green-700 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-a:text-green-400"
            v-html="news.content"
          />

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <!-- External Link -->
            <UButton
              v-if="news.link"
              color="green"
              variant="outline"
              icon="i-heroicons-link"
              class="flex-1 sm:flex-none"
              @click="openLink"
            >
              Baca Selengkapnya
            </UButton>

            <!-- Attachment -->
            <UButton
              v-if="attachmentUrl"
              color="blue" 
              variant="outline"
              icon="i-heroicons-paper-clip"
              class="flex-1 sm:flex-none"
              @click="openAttachment"
            >
              Unduh {{ attachmentFileType }}
            </UButton>
          </div>

          <!-- Attachment Info -->
          <div v-if="attachmentUrl" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">
                  {{ attachmentFileType }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
                  {{ attachmentFileName }}
                </p>
                <p class="text-xs text-blue-600 dark:text-blue-400">
                  Klik tombol untuk mengunduh lampiran
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose h1, .prose h2, .prose h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.prose h1 {
  font-size: 1.875rem;
}

.prose h2 {
  font-size: 1.5rem;
}

.prose h3 {
  font-size: 1.25rem;
}

.prose ul, .prose ol {
  margin: 1.25rem 0;
  padding-left: 1.75rem;
}

.prose li {
  margin: 0.75rem 0;
}

.prose blockquote {
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 4px solid #10b981;
  font-style: italic;
  color: #6b7280;
}

.dark .prose blockquote {
  color: #9ca3af;
  border-left-color: #34d399;
}
</style>