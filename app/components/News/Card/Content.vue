<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

interface News {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  category: string;
  created_at: string;
  author?: string;
}

const props = defineProps<{
  news: News;
}>();

const imageError = ref(false);
const imageLoading = ref(true);

// Computed for Supabase image URL
const imageUrl = computed(() => {
  if (!props.news?.image_url) return null
  
  // Check if it's already a full URL
  if (props.news.image_url.startsWith('http')) {
    return props.news.image_url
  }
  
  // Get public URL from Supabase storage
  const { data } = supabase.storage
    .from('news-images')
    .getPublicUrl(props.news.image_url)
  
  return data.publicUrl
});

const formattedDate = computed(() => {
  const date = new Date(props.news.created_at);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
});

const formattedCategory = computed(() => {
  return props.news.category.charAt(0).toUpperCase() + props.news.category.slice(1);
});

const excerpt = computed(() => {
  const stripHtml = props.news.content.replace(/<[^>]*>?/gm, '');
  return stripHtml.length > 120 ? stripHtml.substring(0, 120) + '...' : stripHtml;
});

const handleImageError = () => {
  imageError.value = true;
  imageLoading.value = false;
};

const handleImageLoad = () => {
  imageLoading.value = false;
  imageError.value = false;
};

const getCategoryColor = (category: string) => {
  const colors = {
    teknologi: 'bg-emerald-600',
    pertanian: 'bg-green-600', 
    bisnis: 'bg-lime-600',
    pendidikan: 'bg-teal-600',
    kesehatan: 'bg-green-700',
    tips: 'bg-emerald-500',
    panduan: 'bg-lime-500',
    default: 'bg-green-500'
  };
  return colors[category.toLowerCase()] || colors.default;
};
</script>

<template>
  <article class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-gray-600">
    <!-- Image Container -->
    <div class="relative h-52 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
      <!-- Loading State -->
      <div v-if="imageLoading && imageUrl && !imageError" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600"/>
      </div>
      
      <!-- Image -->
      <img
        v-if="imageUrl && !imageError"
        :src="imageUrl"
        :alt="news.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        @error="handleImageError"
        @load="handleImageLoad"
      >
      
      <!-- Fallback when no image or error -->
      <div v-else class="flex flex-col items-center justify-center h-full text-green-400 dark:text-gray-500">
        <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4" />
        </svg>
        <span class="text-sm font-medium">🌱 Juru Tani</span>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute top-3 left-3">
        <span :class="`${getCategoryColor(news.category)} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`">
          {{ formattedCategory }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title -->
      <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
        {{ news.title }}
      </h3>
      
      <!-- Excerpt -->
      <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
        {{ excerpt }}
      </p>

      <!-- Meta Info -->
      <div class="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="font-medium">{{ news.author || 'Admin Juru Tani' }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Read More Button -->
      <router-link
        :to="`/news/${news.id}`"
        class="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
      >
        <span>Baca Selengkapnya</span>
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </router-link>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>