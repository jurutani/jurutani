<script setup lang="ts">
import type { NewsUpdated } from '~/types/news'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { supabase } = useSupabase()

// Fetch news by slug
const { data: news, error } = await useAsyncData(
  `news_updated_${route.params.slug}`,
  async () => {
    const { data, error } = await supabase
      .from('news_updated')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('slug', route.params.slug)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data as NewsUpdated & { profiles: any }
  }
)

// Handle error
if (error.value || !news.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Berita tidak ditemukan'
  })
}

// SEO
useSeoMeta({
  title: news.value.title,
  description: news.value.sub_title || getExcerpt(news.value.content, 160),
  ogTitle: news.value.title,
  ogDescription: news.value.sub_title || getExcerpt(news.value.content, 160),
  ogImage: getCoverImageUrl(news.value),
  twitterCard: 'summary_large_image'
})

// Image gallery state
const selectedImageIndex = ref(0)
const isLightboxOpen = ref(false)

const allImages = computed(() => {
  const images: string[] = []
  if (news.value.cover_image) {
    images.push(news.value.cover_image)
  }
  if (news.value.images && news.value.images.length > 0) {
    images.push(...news.value.images)
  }
  return images
})

function getCoverImageUrl(newsItem: NewsUpdated): string {
  const imagePath = newsItem.cover_image || (newsItem.images && newsItem.images.length > 0 ? newsItem.images[0] : null)
  
  if (!imagePath) return '/placeholder.png'
  
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(imagePath)
  
  return data.publicUrl || '/placeholder.png'
}

function getImageUrl(path: string): string {
  if (!path) return '/placeholder.png'
  
  if (path.startsWith('http')) {
    return path
  }
  
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(path)
  
  return data.publicUrl || '/placeholder.png'
}

function getAttachmentUrl(path: string): string {
  if (!path) return ''
  
  if (path.startsWith('http')) {
    return path
  }
  
  const { data } = supabase.storage
    .from('news-attachments')
    .getPublicUrl(path)
  
  return data.publicUrl || ''
}

function openLightbox(index: number) {
  selectedImageIndex.value = index
  isLightboxOpen.value = true
}

function closeLightbox() {
  isLightboxOpen.value = false
}

function nextImage() {
  if (selectedImageIndex.value < allImages.value.length - 1) {
    selectedImageIndex.value++
  }
}

function prevImage() {
  if (selectedImageIndex.value > 0) {
    selectedImageIndex.value--
  }
}

// Extract text from TipTap JSON
function getExcerpt(content: any, maxLength: number = 150): string {
  if (!content || !content.content) return ''
  
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

// Format file size
function formatFileSize(bytes: number): string {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Get file icon
function getFileIcon(type: string): string {
  if (type.includes('pdf')) return 'i-lucide-file-text'
  if (type.includes('word') || type.includes('document')) return 'i-lucide-file-text'
  if (type.includes('excel') || type.includes('sheet')) return 'i-lucide-file-spreadsheet'
  return 'i-lucide-file'
}

// Download attachment
function downloadAttachment(attachment: any) {
  const url = getAttachmentUrl(attachment.url)
  if (url) {
    window.open(url, '_blank')
  }
}

// Fetch similar news
const { data: similarNews } = await useAsyncData(
  `similar_news_${route.params.slug}`,
  async () => {
    const { data, error } = await supabase
      .from('news_updated')
      .select('*')
      .eq('category', news.value.category)
      .eq('status_news', 'approved')
      .is('deleted_at', null)
      .neq('id', news.value.id)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) return []
    return data as NewsUpdated[]
  }
)
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <nav class="mb-6 text-sm">
      <ul class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <li><NuxtLink to="/" class="hover:text-primary">Home</NuxtLink></li>
        <li><UIcon name="i-lucide-chevron-right" class="w-4 h-4" /></li>
        <li><NuxtLink to="/update" class="hover:text-primary">Berita</NuxtLink></li>
        <li><UIcon name="i-lucide-chevron-right" class="w-4 h-4" /></li>
        <li class="text-gray-900 dark:text-white truncate">{{ news.title }}</li>
      </ul>
    </nav>

    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <!-- Category badge -->
        <div class="mb-4">
          <span class="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
            {{ news.category }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ news.title }}
        </h1>

        <!-- Sub title -->
        <p v-if="news.sub_title" class="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {{ news.sub_title }}
        </p>

        <!-- Meta info -->
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <!-- Author -->
          <div v-if="news.profiles" class="flex items-center gap-2">
            <div v-if="news.profiles.avatar_url" class="w-8 h-8 rounded-full overflow-hidden">
              <img :src="news.profiles.avatar_url" :alt="news.profiles.full_name" class="w-full h-full object-cover">
            </div>
            <UIcon v-else name="i-lucide-user-circle" class="w-8 h-8" />
            <span>{{ news.profiles.full_name || 'Pengguna' }}</span>
          </div>

          <!-- Date -->
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-calendar" class="w-4 h-4" />
            <time>{{ formatDate(news.created_at) }}</time>
          </div>
        </div>
      </header>

      <!-- Cover Image -->
      <div v-if="news.cover_image" class="mb-8 rounded-lg overflow-hidden">
        <img
          :src="getCoverImageUrl(news)"
          :alt="news.title"
          class="w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
          @click="openLightbox(0)"
        >
      </div>

      <!-- Content -->
      <article class="prose prose-lg dark:prose-invert max-w-none mb-12">
        <UEditor
          :model-value="news.content"
          :editable="false"
          content-type="json"
          class="border-0"
        />
      </article>

      <!-- Gallery -->
      <section v-if="news.images && news.images.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Galeri Foto</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(image, index) in news.images"
            :key="index"
            class="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            @click="openLightbox(news.cover_image ? index + 1 : index)"
          >
            <img
              :src="getImageUrl(image)"
              :alt="`Gallery ${index + 1}`"
              class="w-full h-full object-cover"
            >
          </div>
        </div>
      </section>

      <!-- Attachments -->
      <section v-if="news.attachments && news.attachments.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Lampiran</h2>
        <div class="space-y-3">
          <div
            v-for="(attachment, index) in news.attachments"
            :key="index"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            @click="downloadAttachment(attachment)"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <UIcon :name="getFileIcon(attachment.type || '')" class="w-6 h-6 text-primary flex-shrink-0" />
              <div class="min-w-0 flex-1">
                <p class="font-medium truncate">{{ attachment.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(attachment.size || 0) }}</p>
              </div>
            </div>
            <UButton color="primary" variant="ghost" icon="i-lucide-download" />
          </div>
        </div>
      </section>

      <!-- External Link -->
      <section v-if="news.link" class="mb-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-external-link" class="w-5 h-5 text-primary" />
          <div class="flex-1">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Link Referensi</p>
            <a :href="news.link" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline break-all">
              {{ news.link }}
            </a>
          </div>
        </div>
      </section>

      <!-- Similar News -->
      <section v-if="similarNews && similarNews.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold mb-6">Berita Terkait</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="item in similarNews"
            :key="item.id"
            :to="`/update/${item.slug}`"
            class="group block"
          >
            <article class="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  :src="getCoverImageUrl(item)"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
              </div>
              <div class="p-4">
                <h3 class="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(item.created_at) }}
                </p>
              </div>
            </article>
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="isLightboxOpen"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          @click="closeLightbox"
        >
          <UIcon name="i-lucide-x" class="w-6 h-6" />
        </button>

        <!-- Navigation -->
        <button
          v-if="selectedImageIndex > 0"
          class="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          @click="prevImage"
        >
          <UIcon name="i-lucide-chevron-left" class="w-6 h-6" />
        </button>

        <button
          v-if="selectedImageIndex < allImages.length - 1"
          class="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          @click="nextImage"
        >
          <UIcon name="i-lucide-chevron-right" class="w-6 h-6" />
        </button>

        <!-- Image -->
        <div class="max-w-6xl max-h-[90vh] p-4">
          <img
            :src="getImageUrl(allImages[selectedImageIndex])"
            :alt="`Image ${selectedImageIndex + 1}`"
            class="max-w-full max-h-full object-contain"
          >
        </div>

        <!-- Counter -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          {{ selectedImageIndex + 1 }} / {{ allImages.length }}
        </div>
      </div>
    </Teleport>
  </main>
</template>
