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

// State untuk expand deskripsi
const isDescriptionExpanded = ref(false);

// Composable for YouTube functionality
const useYouTube = (videoUrl: string) => {
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
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  });
  
  const thumbnailUrl = computed(() => {
    if (!videoId) return '';
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  });
  
  const isValidVideo = computed(() => !!videoId);
  
  return {
    embedUrl,
    thumbnailUrl,
    isLoading,
    isValidVideo
  };
};

// Use the YouTube composable
const { embedUrl, thumbnailUrl, isLoading, isValidVideo } = useYouTube(props.video.link_yt);

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

const truncateText = (text: string, maxLength: number = 150) => {
  return text.length <= maxLength ? text : text.substring(0, maxLength).trim() + '...';
};

// Computed untuk menentukan apakah deskripsi perlu dipotong
const shouldTruncateDescription = computed(() => {
  return props.video.description.length > 150;
});

// Computed untuk menampilkan deskripsi
const displayedDescription = computed(() => {
  if (!shouldTruncateDescription.value || isDescriptionExpanded.value) {
    return props.video.description;
  }
  return truncateText(props.video.description, 150);
});

// Toggle expand deskripsi
const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value;
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group h-full flex flex-col">
    <!-- Video Section -->
    <div class="relative aspect-video bg-gradient-to-r from-gray-100 to-gray-200">
      <!-- Video Player (always shown if valid) -->
      <iframe
        v-if="isValidVideo"
        :src="embedUrl"
        class="w-full h-full"
        frameborder="0"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube video player"
      />

      <!-- Error State -->
      <div v-if="!isValidVideo" class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div class="text-center p-6">
          <div class="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg class="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-gray-600 font-medium text-base">Video tidak tersedia</p>
          <p class="text-gray-500 text-sm mt-1">URL YouTube tidak valid</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex-1 flex flex-col">
      <!-- Category Badge -->
      <div class="mb-4">
        <UBadge color="green" variant="soft" class="font-semibold text-sm px-3 py-1">
          {{ video.category }}
        </UBadge>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200 leading-tight">
        {{ video.title }}
      </h3>

      <!-- Description dengan expand functionality -->
      <div class="mb-6 flex-1">
        <p class="text-gray-600 text-sm leading-relaxed" :class="{'line-clamp-4': !isDescriptionExpanded}">
          {{ displayedDescription }}
        </p>
        
        <!-- Tombol Expand/Collapse -->
        <button
          v-if="shouldTruncateDescription"
          @click="toggleDescription"
          class="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
        >
          <span>{{ isDescriptionExpanded ? 'Sembunyikan' : 'Selengkapnya' }}</span>
          <svg 
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isDescriptionExpanded }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <!-- Date -->
        <div class="flex items-center text-sm text-gray-500">
          <div class="bg-gray-100 rounded-full p-2 mr-3">
            <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="font-medium">{{ formatDate(video.created_at) || 'Tanpa tanggal' }}</span>
        </div>

        <!-- YouTube Link -->
        <button
          type="button"
          class="flex items-center text-sm text-white bg-red-600 hover:bg-red-700 font-semibold transition-all duration-200 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200"
          @click="window.open(video.link_yt, '_blank', 'noopener,noreferrer')"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Tonton di YouTube
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

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>