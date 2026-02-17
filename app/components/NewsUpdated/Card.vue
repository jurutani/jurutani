<script setup lang="ts">
import type { NewsUpdated } from '~/types/news'

interface Props {
  news: NewsUpdated
}

const props = defineProps<Props>()

const { supabase } = useSupabase()

// Get image URL
const imageUrl = computed(() => {
  const imagePath = props.news.cover_image || (props.news.images && props.news.images.length > 0 ? props.news.images[0] : null)
  
  if (!imagePath) return '/placeholder.png'
  
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(imagePath)
  
  return data.publicUrl || '/placeholder.png'
})

// Get excerpt from TipTap JSON content
const excerpt = computed(() => {
  if (props.news.sub_title) {
    return props.news.sub_title
  }

  if (!props.news.content || !props.news.content.content) return ''
  
  let text = ''
  
  function extractText(node: any) {
    if (node.text) {
      text += node.text
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach((child: any) => extractText(child))
    }
  }
  
  extractText(props.news.content)
  
  text = text.trim()
  const maxLength = 150
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
})

// Format date
const formattedDate = computed(() => {
  const date = new Date(props.news.created_at)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
})
</script>

<template>
  <NuxtLink
    :to="`/update/${news.slug}`"
    class="group block"
  >
    <article class="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <!-- Image -->
      <div class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          :src="imageUrl"
          :alt="news.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        >
        
        <!-- Gallery badge -->
        <div
          v-if="news.images && news.images.length > 0"
          class="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center gap-1"
        >
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
          {{ formattedDate }}
        </time>

        <!-- Title -->
        <h3 class="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {{ news.title }}
        </h3>

        <!-- Excerpt -->
        <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
          {{ excerpt }}
        </p>

        <!-- Meta info -->
        <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <!-- Attachments indicator -->
          <div v-if="news.attachments && news.attachments.length > 0" class="flex items-center gap-1">
            <UIcon name="i-lucide-paperclip" class="w-3 h-3" />
            {{ news.attachments.length }}
          </div>

          <!-- Status badge (for author view) -->
          <div
            v-if="news.status_news !== 'approved'"
            class="px-2 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400': news.status_news === 'pending',
              'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400': news.status_news === 'rejected'
            }"
          >
            {{ news.status_news === 'pending' ? 'Menunggu' : 'Ditolak' }}
          </div>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>
