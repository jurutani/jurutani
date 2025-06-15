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

// Composable for YouTube functionality
const useYouTube = (videoUrl: string) => {
  const isPlaying = ref(false);
  const isLoading = ref(false);
  
  // Extract YouTube video ID
  const getVideoId = () => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const videoId = getVideoId();
  
  const embedUrl = computed(() => {
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  });
  
  const thumbnailUrl = computed(() => {
    if (!videoId) return '';
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  });
  
  const playVideo = () => {
    isLoading.value = true;
    isPlaying.value = true;
    // Remove loading after a short delay to show iframe
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  };
  
  const isValidVideo = computed(() => !!videoId);
  
  return {
    embedUrl,
    thumbnailUrl,
    isPlaying,
    isLoading,
    isValidVideo,
    playVideo
  };
};

// Use the YouTube composable
const { embedUrl, thumbnailUrl, isPlaying, isLoading, isValidVideo, playVideo } = useYouTube(props.video.link_yt);

// Utility functions
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
};

const truncateText = (text: string, maxLength: number = 120) => {
  return text.length <= maxLength ? text : text.substring(0, maxLength).trim() + '...';
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Pertanian': 'bg-green-50 text-green-700 border-green-200',
    'Peternakan': 'bg-blue-50 text-blue-700 border-blue-200',
    'Teknologi': 'bg-purple-50 text-purple-700 border-purple-200',
    'Lainya': 'bg-orange-50 text-orange-700 border-orange-200'
  };
  return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <!-- Video Section -->
    <div class="relative aspect-video bg-gray-100">
      <!-- Thumbnail -->
      <div 
        v-if="!isPlaying && isValidVideo && thumbnailUrl"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${thumbnailUrl})` }"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300" />
        
        <!-- Play Button -->
        <div 
          class="absolute inset-0 flex items-center justify-center cursor-pointer group"
          @click="playVideo"
        >
          <div class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 shadow-lg group-hover:scale-110 transition-all duration-300">
            <svg class="w-8 h-8 text-red-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingData v-if="isLoading && !isPlaying" :message="'Memuat video...'" " />

      <!-- Video Player -->
      <iframe
        v-if="isPlaying && !isLoading && isValidVideo"
        :src="embedUrl"
        class="w-full h-full"
        frameborder="0"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube video player"
      />

      <!-- Error State -->
      <div v-if="!isValidVideo" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
        <div class="text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-gray-500">Video tidak tersedia</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Category Badge -->
      <div class="mb-3">
        <span 
          :class="getCategoryColor(video.category)"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
        >
          {{ video.category }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ video.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ truncateText(video.description) }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <!-- Date -->
        <div class="flex items-center text-xs text-gray-500">
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ formatDate(video.created_at) || 'No date' }}</span>
        </div>

        <!-- YouTube Link -->
        <button
          type="button"
          class="flex items-center text-xs text-red-600 hover:text-red-700 font-medium transition-colors px-3 py-1 rounded border border-red-200 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          @click="window.open(video.link_yt, '_blank', 'noopener,noreferrer')"
        >
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Kunjungi YouTube
        </button>
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