<script setup lang="ts">
import { computed } from 'vue';

interface AttachmentFile {
  name: string;  // Changed from 'filename' to 'name'
  url: string;
  size?: number;
  type?: string;
}

interface Announcement {
  id: string;
  title?: string;
  content?: string;
  category: string;
  created_at: string;
  organization?: string;
  link?: string;
  image_url?: string;
  fullImageUrl?: string;
  attachments?: string;
  fullAttachmentUrls?: AttachmentFile[];
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
  const categoryMap: { [key: string]: string } = {
    'online': 'Online',
    'offline': 'Offline',
    'hybrid': 'Hybrid'
  };
  return categoryMap[props.announcement.category] || props.announcement.category.charAt(0).toUpperCase() + props.announcement.category.slice(1);
});

const categoryColor = computed(() => {
  const colorMap: { [key: string]: string } = {
    'online': 'bg-blue-500/90',
    'offline': 'bg-emerald-500/90',
    'hybrid': 'bg-purple-500/90'
  };
  return colorMap[props.announcement.category] || 'bg-gray-500/90';
});

const excerpt = computed(() => {
  const content = props.announcement.content || '';
  const stripHtml = content.replace(/<[^>]*>?/gm, '');
  return stripHtml.length > 120 ? stripHtml.substring(0, 120) + '...' : stripHtml;
});

const imageUrl = computed(() => {
  // Prioritas: fullImageUrl > image_url > placeholder
  return props.announcement.fullImageUrl || 
         props.announcement.image_url || 
         '/placeholder.png';
});

const hasAttachments = computed(() => {
  return props.announcement.fullAttachmentUrls && props.announcement.fullAttachmentUrls.length > 0;
});

const attachmentCount = computed(() => {
  return props.announcement.fullAttachmentUrls?.length || 0;
});

// Updated getFileIcon function to work with filename or type
const getFileIcon = (attachment: AttachmentFile) => {
  // Try to get extension from filename first
  const ext = attachment.name?.split('.').pop()?.toLowerCase();
  
  // If we have MIME type, use it as fallback
  const mimeType = attachment.type?.toLowerCase();
  
  // Check extension first
  if (ext) {
    switch (ext) {
      case 'pdf':
        return 'i-heroicons-document-text';
      case 'doc':
      case 'docx':
        return 'i-heroicons-document';
      case 'xls':
      case 'xlsx':
        return 'i-heroicons-table-cells';
      case 'ppt':
      case 'pptx':
        return 'i-heroicons-presentation-chart-bar';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'i-heroicons-photo';
      case 'zip':
      case 'rar':
        return 'i-heroicons-archive-box';
    }
  }
  
  // Check MIME type as fallback
  if (mimeType) {
    if (mimeType.includes('pdf')) return 'i-heroicons-document-text';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'i-heroicons-document';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'i-heroicons-table-cells';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'i-heroicons-presentation-chart-bar';
    if (mimeType.includes('image')) return 'i-heroicons-photo';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'i-heroicons-archive-box';
  }
  
  return 'i-heroicons-document';
};

// Format file size
const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

// Handle image load error
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder.png';
};

// Format organization name if exists
const organizationDisplay = computed(() => {
  return props.announcement.organization || 'JuruTani';
});
</script>

<template>
  <div class="group announcement-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 flex flex-col">
    <!-- Image Section with Overlay -->
    <div class="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 overflow-hidden">
      <img
        :src="imageUrl"
        :alt="announcement.title || 'Gambar Meeting'"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      >
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"/>
      
      <!-- Category Badge -->
      <div class="absolute top-3 left-3">
        <div :class="['backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg', categoryColor]">
          <div class="flex items-center space-x-1">
            <UIcon :name="announcement.category === 'online' ? 'i-heroicons-computer-desktop' : announcement.category === 'offline' ? 'i-heroicons-map-pin' : 'i-heroicons-globe-alt'" class="w-3 h-3" />
            <span>{{ formattedCategory }}</span>
          </div>
        </div>
      </div>
      
      <!-- Attachment Indicator -->
      <div v-if="hasAttachments" class="absolute top-3 right-3">
        <div class="bg-indigo-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center font-medium shadow-lg">
          <UIcon name="i-heroicons-paper-clip" class="w-3 h-3 mr-1" />
          {{ attachmentCount }}
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-6 flex-grow flex flex-col">
      <!-- Date and Organization -->
      <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-3">
        <span class="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
          <UIcon name="i-heroicons-calendar-days" class="w-3.5 h-3.5 mr-1.5" />
          {{ formattedDate }}
        </span>
        <span class="flex items-center bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md text-emerald-700 dark:text-emerald-400">
          <UIcon name="i-heroicons-building-office" class="w-3.5 h-3.5 mr-1.5" />
          {{ organizationDisplay }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
        {{ announcement.title || 'Meeting Tanpa Judul' }}
      </h3>
      
      <!-- Excerpt -->
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
        {{ excerpt || 'Tidak ada deskripsi tersedia.' }}
      </p>

      <!-- Attachments Preview -->
      <div v-if="hasAttachments" class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div class="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
          <UIcon name="i-heroicons-paper-clip" class="w-4 h-4 mr-1.5" />
          {{ attachmentCount }} file lampiran
        </div>
        <div class="grid grid-cols-1 gap-1">
          <a 
            v-for="attachment in announcement.fullAttachmentUrls?.slice(0, 2)" 
            :key="attachment.name"
            :href="attachment.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center text-xs bg-white dark:bg-gray-800 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <UIcon :name="getFileIcon(attachment)" class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span class="truncate flex-1" :title="attachment.name">
              {{ attachment.name }}
            </span>
            <span v-if="attachment.size" class="ml-2 text-gray-400 text-[10px]">
              {{ formatFileSize(attachment.size) }}
            </span>
          </a>
          <div 
            v-if="attachmentCount > 2"
            class="text-xs text-gray-500 dark:text-gray-400 italic px-2 py-1"
          >
            +{{ attachmentCount - 2 }} file lainnya
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-auto flex gap-2">
        <!-- Detail Button -->
        <NuxtLink
          :to="`/courses/${announcement.id}`"
          class="flex-1 group/button relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"/>
          <div class="relative flex items-center justify-center px-4 py-3">
            <span class="mr-2">Lihat Detail</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </div>
        </NuxtLink>

        <!-- External Link Button (if link exists) -->
        <a 
          v-if="announcement.link"
          :href="announcement.link"
          target="_blank"
          rel="noopener noreferrer"
          class="group/link bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
          title="Buka link eksternal"
        >
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 transition-transform duration-300 group-hover/link:scale-110" />
        </a>
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