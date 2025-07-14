<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupabase } from '~/composables/useSupabase';

const route = useRoute();
const router = useRouter();
const { supabase } = useSupabase();

const meeting = ref(null);
const author = ref(null);
const loading = ref(true);
const error = ref(null);
const notFound = ref(false);

// Fungsi formatter tanggal lokal
const formatDate = (date: string | Date, locale = 'id-ID') => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  return parsedDate.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Fungsi untuk mendapatkan badge style berdasarkan kategori
const getCategoryBadgeClass = (category: string) => {
  return category === 'Online' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
};

// Fungsi untuk mendapatkan icon berdasarkan kategori
const getCategoryIcon = (category: string) => {
  return category === 'Online' ? '🌐' : '📍';
};

// Fungsi untuk generate URL image
const generateImageUrl = (id: string, imageFileName?: string) => {
  if (!imageFileName) return null;
  return supabase.storage
    .from('meetings')
    .getPublicUrl(`${id}/image/${imageFileName}`)
    .data.publicUrl;
};

// Fungsi untuk generate URL attachment
const generateAttachmentUrl = (id: string, attachmentFileName: string) => {
  return supabase.storage
    .from('meetings')
    .getPublicUrl(`${id}/attachment/${attachmentFileName}`)
    .data.publicUrl;
};

// Fungsi untuk generate URL avatar
const generateAvatarUrl = (avatarFileName?: string) => {
  if (!avatarFileName) return null;
  return supabase.storage
    .from('profiles')
    .getPublicUrl(`avatar/${avatarFileName}`)
    .data.publicUrl;
};

// Computed untuk URL gambar
const imageUrl = computed(() => {
  if (!meeting.value) return '/placeholder.png';
  
  // Cek apakah image_url ada dan tidak kosong
  if (meeting.value.image_url && meeting.value.image_url.trim() !== '') {
    return generateImageUrl(meeting.value.id, meeting.value.image_url);
  }
  
  return '/placeholder.png';
});

// Computed untuk URL avatar author
const authorAvatarUrl = computed(() => {
  if (!author.value || !author.value.avatar_url) return '/placeholder.png';
  return generateAvatarUrl(author.value.avatar_url);
});

// Computed untuk attachment URLs
const attachmentUrls = computed(() => {
  if (!meeting.value?.attachments || !Array.isArray(meeting.value.attachments)) {
    return [];
  }
  
  return meeting.value.attachments.map(filename => ({
    filename,
    url: generateAttachmentUrl(meeting.value.id, filename),
    name: filename,
    size: null // Size bisa ditambahkan jika diperlukan
  }));
});

// Computed untuk cek apakah ada gambar
const hasImage = computed(() => {
  return meeting.value?.image_url && meeting.value.image_url.trim() !== '';
});

// Fungsi untuk download attachment
const downloadAttachment = (attachment: any) => {
  if (attachment.url) {
    window.open(attachment.url, '_blank');
  }
};

// Fungsi untuk membuka link course di tab baru
const openCourseLink = () => {
  if (meeting.value?.link) {
    window.open(meeting.value.link, '_blank');
  }
};

// Fungsi untuk mendapatkan file extension dari nama file
const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
};

// Fetch author information
const fetchAuthor = async (authorId: string) => {
  try {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('full_name, role, avatar_url')
      .eq('id', authorId)
      .single();

    if (fetchError) {
      console.error('Error fetching author:', fetchError);
    } else if (data) {
      author.value = data;
    }
  } catch (err) {
    console.error('Exception fetching author:', err);
  }
};

// Fetch meeting berdasarkan ID
const fetchMeetingById = async () => {
  loading.value = true;
  error.value = null;
  notFound.value = false;

  try {
    const meetingId = route.params.id;

    if (!meetingId) {
      router.push('/courses');
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .is('deleted_at', null)
      .is('archived_at', null)
      .single();

    if (fetchError) {
      console.error('Error fetching meeting:', fetchError);
      error.value = fetchError;
      if (fetchError.code === 'PGRST116') {
        notFound.value = true;
      }
    } else if (data) {
      meeting.value = data;
      
      // Fetch author information if author_id exists
      if (data.author_id) {
        await fetchAuthor(data.author_id);
      }
    } else {
      notFound.value = true;
    }
  } catch (err) {
    console.error('Exception fetching meeting:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Handle kembali ke halaman daftar meetings
const goBack = () => {
  router.push('/courses');
};

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/placeholder.png';
};

// Handle avatar error
const handleAvatarError = (event) => {
  event.target.src = '/placeholder.png';
};

onMounted(() => {
  fetchMeetingById();
});
</script>

<template>
  <div class="meeting-detail container mx-auto px-4 py-8 max-w-5xl dark:text-gray-100">
    <!-- Navigation Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 mb-8">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button 
            class="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            @click="goBack"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            <span class="font-medium">Kembali ke Course</span>
          </button>
          
          <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UIcon name="i-heroicons-newspaper" class="w-5 h-5" />
            <span class="font-semibold">JuruTani Course</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"/>
      <p class="text-gray-500 dark:text-gray-400">Memuat course...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg dark:bg-red-900/20 dark:border-red-500 dark:text-red-200">
      <div class="flex items-center">
        <span class="text-xl mr-3">⚠️</span>
        <div>
          <p class="font-medium">Terjadi kesalahan saat memuat course</p>
          <p class="text-sm mt-1 opacity-75">Silakan coba lagi atau kembali ke daftar course</p>
        </div>
      </div>
      <button 
        class="mt-4 text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300 transition-colors" 
        @click="goBack"
      >
        ← Kembali ke daftar course
      </button>
    </div>

    <!-- Not Found State -->
    <div v-else-if="notFound" class="text-center py-16">
      <div class="text-6xl mb-4">📚</div>
      <h2 class="text-2xl font-bold text-gray-700 mb-4 dark:text-gray-200">Course tidak ditemukan</h2>
      <p class="text-gray-500 mb-8 dark:text-gray-400">Course yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
      <button 
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium dark:bg-blue-700 dark:hover:bg-blue-800" 
        @click="goBack"
      >
        Kembali ke daftar course
      </button>
    </div>

    <!-- Meeting Content -->
    <div v-else-if="meeting" class="space-y-6">
      <!-- Hero Image Section -->
      <div v-if="hasImage" class="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 border dark:border-gray-700">
        <div class="relative h-64 md:h-80 lg:h-96">
          <img
            :src="imageUrl"
            :alt="meeting.title || 'Course Image'"
            class="w-full h-full object-cover"
            @error="handleImageError"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
          
          <!-- Overlay Content -->
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div class="flex items-center gap-3 mb-4">
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm"
              >
                <span class="mr-1">{{ getCategoryIcon(meeting.category) }}</span>
                {{ meeting.category }}
              </span>
              <div class="text-sm opacity-90 flex items-center">
                <span class="mr-1">🕒</span>
                {{ formatDate(meeting.created_at) }}
              </div>
            </div>
            <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {{ meeting.title }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Header (when no image) -->
      <div v-else class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <!-- Category and Date -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              :class="getCategoryBadgeClass(meeting.category)"
            >
              <span class="mr-1">{{ getCategoryIcon(meeting.category) }}</span>
              {{ meeting.category }}
            </span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span class="mr-1">🕒</span>
            {{ formatDate(meeting.created_at) }}
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {{ meeting.title }}
        </h1>
      </div>

      <!-- Author Information -->
      <div v-if="author" class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">👨‍🏫</span>
          Instruktur
        </h2>
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <img
              :src="authorAvatarUrl"
              :alt="author.full_name || 'Author Avatar'"
              class="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              @error="handleAvatarError"
            >
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ author.full_name || 'Nama tidak tersedia' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ author.role || 'Role tidak tersedia' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">📝</span>
          Deskripsi Course
        </h2>
        <div 
          class="prose prose-gray max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300" 
          v-html="meeting.description || meeting.content"
        />
      </div>

      <!-- Link Section -->
      <div v-if="meeting.link" class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">🔗</span>
          Link Course
        </h2>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <a 
            :href="meeting.link" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium break-all transition-colors flex items-center"
          >
            <span class="mr-2">🚀</span>
            {{ meeting.link }}
            <span class="ml-2">↗</span>
          </a>
        </div>
      </div>

      <!-- Attachments Section -->
      <div v-if="attachmentUrls.length > 0" class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">📎</span>
          Lampiran ({{ attachmentUrls.length }})
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(attachment, index) in attachmentUrls" 
            :key="index"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer"
            @click="downloadAttachment(attachment)"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">
                    {{ getFileExtension(attachment.filename) }}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ attachment.filename }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Klik untuk mengunduh
                </p>
              </div>
              <div class="flex-shrink-0">
                <span class="text-gray-400 dark:text-gray-500">⬇️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Attachments Message -->
      <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div class="text-gray-400 dark:text-gray-500 text-4xl mb-3">📎</div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Tidak ada lampiran untuk course ini
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            v-if="meeting.link"
            class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            @click="openCourseLink"
          >
            <span class="mr-2">🚀</span>
            Akses Course
          </button>
          
          <button 
            class="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            @click="goBack"
          >
            <span class="mr-2">←</span>
            Kembali
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.7;
}

.prose p {
  margin-bottom: 1rem;
}

.prose h1, .prose h2, .prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose ul, .prose ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.5rem 0;
}

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