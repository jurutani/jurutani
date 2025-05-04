<script setup lang="ts">
import { computed } from 'vue';

interface Announcement {
  id: number;
  title: string;
  content: string;
  attachments?: { url: string }[];
  category: string;
  created_at: string;
  organization?: string;
  link?: string;
}

const props = defineProps<{
  announcement: Announcement;
}>();

const formattedDate = computed(() => {
  const date = new Date(props.announcement.created_at);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
});

const formattedCategory = computed(() => {
  return props.announcement.category.charAt(0).toUpperCase() + props.announcement.category.slice(1);
});

const excerpt = computed(() => {
  const stripHtml = props.announcement.content.replace(/<[^>]*>?/gm, '');
  return stripHtml.length > 150 ? stripHtml.substring(0, 150) + '...' : stripHtml;
});

const imageUrl = computed(() => {
  return props.announcement.attachments?.[0]?.url || '/placeholder.png';
});
</script>

<template>
  <div class="announcement-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-green-900 overflow-hidden transition-all hover:shadow-md duration-200 flex flex-col">
    <div class="relative h-40 bg-green-50 dark:bg-green-900 overflow-hidden">
      <img
        :src="imageUrl"
        :alt="announcement.title || 'Gambar Pengumuman'"
        class="w-full h-full object-cover"
      >
      <div class="absolute top-3 left-3 bg-green-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
        {{ formattedCategory }}
      </div>
    </div>

    <div class="p-5 flex-grow flex flex-col">
      <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-2">
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formattedDate }}
        </span>
        <span v-if="announcement.organization" class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {{ announcement.organization }}
        </span>
      </div>

      <h3 class="text-lg font-medium mb-2 text-gray-800 dark:text-white line-clamp-2">
        {{ announcement.title }}
      </h3>
      
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
        {{ excerpt }}
      </p>

      <router-link
        :to="`/announcements/${announcement.id}`"
        class="mt-auto inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white text-sm rounded-md transition-colors duration-200 w-full sm:w-auto"
      >
        <span>Baca Selengkapnya</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </router-link>
    </div>
  </div>
</template>