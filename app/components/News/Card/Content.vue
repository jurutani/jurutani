<script setup lang="ts">
import { computed } from 'vue';

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
  return stripHtml.length > 150 ? stripHtml.substring(0, 150) + '...' : stripHtml;
});
</script>

<template>
    <div class="news-card bg-green-50 dark:bg-green-900 rounded-lg shadow-sm overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1 duration-200">
      <div class="relative h-48 bg-green-100 dark:bg-green-800">
        <img
          v-if="news.image_url"
          :src="news.image_url"
          :alt="news.title"
          class="w-full h-full object-cover"
        >
        <div v-else class="flex items-center justify-center h-full text-green-400 dark:text-green-200">
          <span>Tidak ada gambar</span>
        </div>
        <div class="absolute top-2 right-2 bg-green-600 dark:bg-green-700 text-white text-xs px-2 py-1 rounded-full shadow-sm">
          {{ formattedCategory }}
        </div>
      </div>
  
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2 text-green-900 dark:text-white line-clamp-2">
          {{ news.title }}
        </h3>
        <p class="text-green-800 dark:text-green-200 text-sm mb-4 line-clamp-3">
          {{ excerpt }}
        </p>
  
        <div class="flex justify-between items-center text-xs text-green-700 dark:text-green-300 mb-2">
          <span>{{ news.author || 'Admin Juru Tani' }}</span>
          <span>{{ formattedDate }}</span>
        </div>
  
        <router-link
          :to="`/news/${news.id}`"
          class="mt-2 inline-block px-4 py-2 text-sm bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
        >
          Baca Selengkapnya
        </router-link>
      </div>
    </div>
  </template>
  