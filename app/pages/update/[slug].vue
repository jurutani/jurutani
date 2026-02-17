<script setup lang="ts">
import type { NewsUpdated } from '~/types/news'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { supabase } = useSupabase()
const { 
  getImagePathUrl, 
  getAttachmentUrl, 
  getExcerpt, 
  formatDate,
  formatFileSize,
  getFileIcon,
  downloadAttachment,
  getStatusBadge
} = useNewsUpdatedUtils()

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

// Get cover image URL for SEO
const coverImageUrl = computed(() => {
  const imagePath = news.value.cover_image || (news.value.images && news.value.images.length > 0 ? news.value.images[0] : null)
  return imagePath ? getImagePathUrl(imagePath) : '/placeholder.png'
})

// SEO
useSeoMeta({
  title: news.value.title,
  description: news.value.sub_title || getExcerpt(news.value.content, 160),
  ogTitle: news.value.title,
  ogDescription: news.value.sub_title || getExcerpt(news.value.content, 160),
  ogImage: coverImageUrl.value,
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

// Get status badge
const statusBadge = computed(() => getStatusBadge(news.value.status_news))

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
        <li><NuxtLink to="/" class="hover:text-primary transition-colors">Home</NuxtLink></li>
        <li><UIcon name="i-lucide-chevron-right" class="w-4 h-4" /></li>
        <li><NuxtLink to="/update" class="hover:text-primary transition-colors">Berita</NuxtLink></li>
        <li><UIcon name="i-lucide-chevron-right" class="w-4 h-4" /></li>
        <li class="text-gray-900 dark:text-white truncate">{{ news.title }}</li>
      </ul>
    </nav>

    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <!-- Category & Status badges -->
        <div class="mb-4 flex items-center gap-2 flex-wrap">
          <UBadge color="primary" variant="soft">
            <UIcon name="i-lucide-folder" class="w-3 h-3" />
            {{ news.category }}
          </UBadge>
          
          <UBadge 
            :color="statusBadge.color as any"
            variant="soft"
          >
            <UIcon :name="statusBadge.icon" class="w-3 h-3" />
            {{ statusBadge.label }}
          </UBadge>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {{ news.title }}
        </h1>

        <!-- Sub title -->
        <p v-if="news.sub_title" class="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {{ news.sub_title }}
        </p>

        <!-- Meta info -->
        <div class="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
          <!-- Author -->
          <div v-if="news.profiles" class="flex items-center gap-2">
            <div v-if="news.profiles.avatar_url" class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <img :src="news.profiles.avatar_url" :alt="news.profiles.full_name" class="w-full h-full object-cover">
            </div>
            <div v-else class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UIcon name="i-lucide-user" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <p class="font-medium text-sm">{{ news.profiles.full_name || 'Pengguna' }}</p>
              <p class="text-xs text-gray-500">Penulis</p>
            </div>
          </div>

          <!-- Date -->
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-calendar" class="w-4 h-4" />
            <time class="text-sm">{{ formatDate(news.created_at) }}</time>
          </div>
        </div>
      </header>

      <!-- Cover Image -->
      <div v-if="news.cover_image" class="mb-8 rounded-xl overflow-hidden shadow-lg">
        <img
          :src="getImagePathUrl(news.cover_image)"
          :alt="news.title"
          class="w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
          @click="openLightbox(0)"
        >
      </div>

      <!-- Content with UEditor (read-only) -->
      <article class="mb-12">
        <UEditor
          :model-value="news.content"
          :editable="false"
          content-type="json"
          class="prose prose-lg dark:prose-invert max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-0 [&_.ProseMirror]:p-0"
        />
      </article>

      <!-- Gallery -->
      <section v-if="news.images && news.images.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <UIcon name="i-lucide-images" class="w-6 h-6" />
          Galeri Foto
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(image, index) in news.images"
            :key="index"
            class="aspect-square rounded-lg overflow-hidden cursor-pointer group relative shadow-md hover:shadow-xl transition-shadow"
            @click="openLightbox(news.cover_image ? index + 1 : index)"
          >
            <img
              :src="getImagePathUrl(image)"
              :alt="`Gallery ${index + 1}`"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <UIcon name="i-lucide-expand" class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      <!-- Attachments -->
      <section v-if="news.attachments && news.attachments.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <UIcon name="i-lucide-paperclip" class="w-6 h-6" />
          Lampiran
        </h2>
        <div class="space-y-3">
          <div
            v-for="(attachment, index) in news.attachments"
            :key="index"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary/50 transition-all cursor-pointer group"
            @click="downloadAttachment(attachment)"
          >
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <UIcon :name="getFileIcon(attachment.type || '')" class="w-6 h-6 text-primary" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium truncate group-hover:text-primary transition-colors">{{ attachment.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(attachment.size || 0) }}</p>
              </div>
            </div>
            <UButton color="primary" variant="ghost" icon="i-lucide-download" />
          </div>
        </div>
      </section>

      <!-- External Link -->
      <section v-if="news.link" class="mb-12">
        <UCard>
          <div class="flex items-start gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <UIcon name="i-lucide-external-link" class="w-5 h-5 text-primary" />
            </div>
            <div class="flex-1">
              <p class="font-medium mb-1">Link Referensi</p>
              <a 
                :href="news.link" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-primary hover:underline break-all text-sm"
              >
                {{ news.link }}
              </a>
            </div>
          </div>
        </UCard>
      </section>

      <!-- Similar News -->
      <section v-if="similarNews && similarNews.length > 0" class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          <UIcon name="i-lucide-newspaper" class="w-6 h-6" />
          Berita Terkait
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="item in similarNews"
            :key="item.id"
            :to="`/update/${item.slug}`"
            class="group block"
          >
            <article class="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all bg-white dark:bg-gray-800">
              <div class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  :src="getImagePathUrl(item.cover_image || (item.images && item.images.length > 0 ? item.images[0] : ''))"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                >
              </div>
              <div class="p-4">
                <h3 class="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-3 h-3" />
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
          class="absolute top-4 right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          @click="closeLightbox"
        >
          <UIcon name="i-lucide-x" class="w-6 h-6" />
        </button>

        <!-- Navigation -->
        <button
          v-if="selectedImageIndex > 0"
          class="absolute left-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          @click="prevImage"
        >
          <UIcon name="i-lucide-chevron-left" class="w-8 h-8" />
        </button>

        <button
          v-if="selectedImageIndex < allImages.length - 1"
          class="absolute right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          @click="nextImage"
        >
          <UIcon name="i-lucide-chevron-right" class="w-8 h-8" />
        </button>

        <!-- Image -->
        <div class="max-w-6xl max-h-[90vh] p-4">
          <img
            :src="getImagePathUrl(allImages[selectedImageIndex])"
            :alt="`Image ${selectedImageIndex + 1}`"
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          >
        </div>

        <!-- Counter -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full">
          {{ selectedImageIndex + 1 }} / {{ allImages.length }}
        </div>
      </div>
    </Teleport>
  </main>
</template>
