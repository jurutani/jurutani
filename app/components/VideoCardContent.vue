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
const isPlaying = ref(false);

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
      // Add autoplay and other parameters for better embedding
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&showinfo=0&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1&origin=${window.location.origin}`;
    }
  }
  
  return '';
});

// Get video thumbnail
const thumbnailUrl = computed(() => {
  const ytLink = props.video.link_yt;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = ytLink.match(pattern);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
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

// Handle play button click
const handlePlayClick = () => {
  isPlaying.value = true;
};

// Category color mapping with agricultural theme
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Pertanian': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
    'Peternakan': 'bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border-blue-200',
    'Teknologi': 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200',
    'Lainya': 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200'
  };
  return colors[category] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
};

// Get category icon
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'Pertanian': '🌱',
    'Peternakan': '🐄',
    'Teknologi': '⚡',
    'Lainya': '📚'
  };
  return icons[category] || '📹';
};
</script>

<template>
  <div class="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100 hover:border-green-200">
    <!-- Video Embed Section -->
    <div class="relative bg-gradient-to-br from-green-50 to-emerald-50 aspect-video overflow-hidden">
      <!-- Thumbnail Preview (when not playing) -->
      <div 
        v-if="!isPlaying && thumbnailUrl" 
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${thumbnailUrl})` }"
      >
        <div class="absolute inset-0 bg-black bg-opacity-20"/>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading && isValidVideo && isPlaying" class="absolute inset-0 flex items-center justify-center bg-green-50">
        <div class="flex flex-col items-center space-y-3">
          <div class="animate-spin rounded-full h-10 w-10 border-3 border-green-600 border-t-transparent"/>
          <p class="text-green-700 text-sm font-medium">Memuat video...</p>
        </div>
      </div>
      
      <!-- Video Embed (only when playing) -->
      <iframe
        v-if="isValidVideo && !hasError && isPlaying"
        :src="embedUrl"
        class="w-full h-full"
        frameborder="0"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        loading="lazy"
        title="YouTube video player"
        @load="handleIframeLoad"
        @error="handleIframeError"
      />
      
      <!-- Error State or Invalid URL -->
      <div 
        v-else-if="hasError || !isValidVideo" 
        class="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-red-50 to-orange-50"
      >
        <div class="bg-white rounded-full p-4 shadow-lg mb-4">
          <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-700">Video tidak dapat dimuat</p>
        <p class="text-xs text-gray-500 mt-1">Periksa koneksi internet Anda</p>
      </div>

      <!-- Play Button Overlay -->
      <div 
        v-if="isValidVideo && !isLoading && !hasError && !isPlaying"
        class="absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-300"
        @click="handlePlayClick"
      >
        <div class="group-hover:scale-110 transition-transform duration-300">
          <div class="bg-white bg-opacity-95 hover:bg-opacity-100 rounded-full p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <svg class="h-8 w-8 text-red-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Duration Badge (optional) -->
      <div class="absolute top-3 right-3">
        <span class="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full font-medium">
          Video
        </span>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-6">
      <!-- Category Badge -->
      <div class="mb-4">
        <span 
          :class="getCategoryColor(props.video.category)"
          class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm"
        >
          <span class="mr-1.5">{{ getCategoryIcon(props.video.category) }}</span>
          {{ props.video.category }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors duration-300 leading-tight">
        {{ props.video.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {{ truncateText(props.video.description, 150) }}
      </p>

      <!-- YouTube Link -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Sumber Video</p>
        <a 
          :href="props.video.link_yt" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="text-red-600 hover:text-red-700 text-sm font-medium hover:underline transition-colors flex items-center"
        >
          <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Tonton di YouTube
        </a>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center space-x-2 text-xs text-gray-500">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span v-if="formattedDate" class="font-medium">{{ formattedDate }}</span>
          <span v-else class="italic">Tanggal tidak tersedia</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <div class="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span class="font-medium">Jurutani</span>
          </div>
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

/* Custom shadow for enhanced elevation */
.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth border transition */
.border-3 {
  border-width: 3px;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Agricultural theme colors */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
</style>