<script setup lang="ts">
import { computed } from 'vue';

// Props
const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

// Computed properties
const hasFiles = computed(() => {
  return props.course.files && Array.isArray(props.course.files) && props.course.files.length > 0;
});

const hasLinks = computed(() => {
  return props.course.link_drive || props.course.link_youtube;
});

const truncatedDescription = computed(() => {
  if (!props.course.description) return '';
  return props.course.description.length > 150 
    ? props.course.description.substring(0, 150) + '...'
    : props.course.description;
});

// Engineering category colors
const getCategoryColor = (category) => {
  const colors = {
    'Pertanian': 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    'Peternakan': 'bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700',
    'Teknologi': 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
    'Lainya': 'bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700',
    'All': 'bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700'
  };
  return colors[category?.toLowerCase()] || colors.default;
};

// Methods
const openLink = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

const downloadFile = (file) => {
  if (file.url) {
    window.open(file.url, '_blank');
  }
};
</script>

<template>
  <div class="course-card group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700">
    <!-- Engineering Category Badge -->
    <div class="absolute top-4 right-4 z-10">
      <span :class="getCategoryColor(course.category)" class="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg">
        {{ course.category || 'Teknik Sipil' }}
      </span>
    </div>

    <!-- Decorative Engineering Pattern -->
    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 dark:from-orange-500 dark:via-red-600 dark:to-pink-600"/>
    
    <!-- Card Header -->
    <div class="p-6 pb-4">
      <!-- Engineering Icon -->
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
            {{ course.title }}
          </h3>
          
          <!-- Course Level & Duration -->
          <div class="flex items-center space-x-3 mb-3">
            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              {{ course.level || 'Menengah' }}
            </span>
            <span v-if="course.duration" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ course.duration }}
            </span>
          </div>
        </div>
      </div>
      
      <p v-if="course.description" class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {{ truncatedDescription }}
      </p>
      
      <p v-else class="text-gray-400 dark:text-gray-500 text-sm italic">
        Tidak ada deskripsi tersedia
      </p>
    </div>

    <!-- Course Resources -->
    <div class="px-6 pb-4">
      <!-- Files Section -->
      <div v-if="hasFiles" class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <div class="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center mr-2">
            <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          Materi & Dokumen Teknis
        </h4>
        <div class="space-y-2">
          <button
            v-for="(file, index) in course.files"
            :key="index"
            class="flex items-center justify-between w-full p-3 text-sm bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-green-50 hover:to-green-100 dark:hover:from-green-900/30 dark:hover:to-green-800/30 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300 rounded-lg transition-all duration-300 group/file"
            @click="downloadFile(file)"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3 group-hover/file:scale-110 transition-transform duration-300">
                <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span class="font-medium">{{ file.name || `Dokumen ${index + 1}` }}</span>
            </div>
            <svg class="w-4 h-4 opacity-0 group-hover/file:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Links Section -->
      <div v-if="hasLinks" class="space-y-3">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <div class="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center mr-2">
            <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </div>
          Sumber Pembelajaran Digital
        </h4>
        
        <!-- Google Drive Link -->
        <button
          v-if="course.link_drive"
          class="flex items-center justify-between w-full p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/40 dark:hover:to-emerald-800/40 text-green-700 dark:text-green-300 rounded-lg transition-all duration-300 group/drive"
          @click="openLink(course.link_drive)"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center mr-3 group-hover/drive:scale-110 transition-transform duration-300">
              <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 01-6.033-6.032 6.033 6.033 0 016.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748L12.545 10.239z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-sm">Google Drive</p>
              <p class="text-xs opacity-75">Akses file dan gambar teknis</p>
            </div>
          </div>
          <svg class="w-4 h-4 opacity-0 group-hover/drive:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </button>

        <!-- YouTube Link -->
        <button
          v-if="course.link_youtube"
          class="flex items-center justify-between w-full p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-800/40 dark:hover:to-pink-800/40 text-red-700 dark:text-red-300 rounded-lg transition-all duration-300 group/youtube"
          @click="openLink(course.link_youtube)"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center mr-3 group-hover/youtube:scale-110 transition-transform duration-300">
              <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-sm">YouTube</p>
              <p class="text-xs opacity-75">Video pembelajaran & tutorial</p>
            </div>
          </div>
          <svg class="w-4 h-4 opacity-0 group-hover/youtube:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </button>
      </div>

      <!-- No Resources Message -->
      <div v-if="!hasFiles && !hasLinks" class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <p class="text-gray-400 dark:text-gray-500 text-sm font-medium">Materi sedang dipersiapkan</p>
        <p class="text-gray-300 dark:text-gray-600 text-xs mt-1">Segera hadir dengan konten pembelajaran terbaik</p>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 px-6 py-4 border-t border-gray-100 dark:border-gray-600">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <span v-if="course.created_at" class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ new Date(course.created_at).toLocaleDateString('id-ID') }}
          </span>
          <span v-if="course.instructor" class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            {{ course.instructor }}
          </span>
        </div>
        
        <!-- Engineering Badge -->
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          <span class="text-xs font-semibold text-orange-600 dark:text-orange-400">JURUTANI</span>
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

.course-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.course-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.course-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 0.75rem;
}

.course-card:hover::before {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .course-card {
    transition: none;
  }
  
  .course-card:hover {
    transform: none;
  }
}</style>