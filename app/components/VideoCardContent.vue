<script setup lang="ts">
import { computed, ref } from 'vue';

interface VideoData {
  id: number;
  title: string;
  description: string;
  link_yt: string;
  category: string;
  created_at?: string;
}

const props = defineProps<{
  video: VideoData;
}>();

// State for loading and error handling
const isLoading = ref(true);
const hasError = ref(false);

// Extract YouTube video ID and create embed URL
const embedUrl = computed(() => {
  const ytLink = props.video.link_yt;
  
  // Multiple patterns for YouTube URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = ytLink.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
  }
  
  return '';
});

// Check if embed URL is valid
const isValidVideo = computed(() => embedUrl.value !== '');

// Format date
const formattedDate = computed(() => {
  if (!props.video.created_at) return '';
  
  try {
    const date = new Date(props.video.created_at);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
});

// Truncate text
const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Handle iframe load
const handleIframeLoad = () => {
  isLoading.value = false;
  hasError.value = false;
};

// Handle iframe error
const handleIframeError = () => {
  isLoading.value = false;
  hasError.value = true;
};

// Category color mapping
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Pertanian': 'bg-green-100 text-green-800',
    'Peternakan': 'bg-blue-100 text-blue-800',
    'Teknologi': 'bg-purple-100 text-purple-800',
    'Lainya': 'bg-gray-100 text-gray-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};
</script>

<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
    <!-- Video Embed Section -->
    <div class="relative bg-gray-100 aspect-video">
      <!-- Loading State -->
      <div v-if="isLoading && isValidVideo" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/>
      </div>
      
      <!-- Video Embed -->
      <iframe
        v-if="isValidVideo && !hasError"
        :src="embedUrl"
        class="w-full h-full"
        frameborder="0"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
        title="YouTube video player"
        @load="handleIframeLoad"
        @error="handleIframeError"
      />
      
      <!-- Error State or Invalid URL -->
      <div 
        v-else 
        class="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-50"
      >
        <svg class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p class="text-sm">Video tidak dapat dimuat</p>
      </div>

      <!-- Play Button Overlay (shown on hover) -->
      <div 
        v-if="isValidVideo && !isLoading && !hasError"
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30"
      >
        <div class="bg-white bg-opacity-90 rounded-full p-3">
          <svg class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-4">
      <!-- Category Badge -->
      <div class="mb-2">
        <span 
          :class="getCategoryColor(props.video.category)"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        >
          {{ props.video.category }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {{ props.video.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-3 line-clamp-3">
        {{ truncateText(props.video.description, 120) }}
      </p>
      <p class="text-gray-600 text-sm mb-3 line-clamp-3">
        link video : 
        <a 
          :href="props.video.link_yt" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="text-blue-600 hover:underline"
        >
          {{ props.video.link_yt }}
        </a>
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span v-if="formattedDate">{{ formattedDate }}</span>
        <div class="flex items-center space-x-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Video</span>
        </div>
      </div>
    </div>
  </div>
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