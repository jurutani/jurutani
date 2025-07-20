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

const formatDate = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCategoryBadgeClass = (category: string) => {
  return category === 'Online' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
};

const getCategoryIcon = (category: string) => {
  return category === 'Online' ? '🌐' : '📍';
};

const generateImageUrl = (id: string, imageFileName?: string) => {
  if (!imageFileName) return null;
  return supabase.storage
    .from('meetings')
    .getPublicUrl(`${id}/image/${imageFileName}`)
    .data.publicUrl;
};

const generateAttachmentUrl = (id: string, attachmentFileName: string) => {
  return supabase.storage
    .from('meetings')
    .getPublicUrl(`${id}/attachment/${attachmentFileName}`)
    .data.publicUrl;
};

const generateAvatarUrl = (avatarFileName?: string) => {
  if (!avatarFileName) return null;
  return supabase.storage
    .from('profiles')
    .getPublicUrl(`avatar/${avatarFileName}`)
    .data.publicUrl;
};

const imageUrl = computed(() => {
  if (!meeting.value || !meeting.value.image_url || meeting.value.image_url.trim() === '') {
    return null;
  }
  return generateImageUrl(meeting.value.id, meeting.value.image_url);
});

const authorAvatarUrl = computed(() => {
  if (!author.value || !author.value.avatar_url) return null;
  return generateAvatarUrl(author.value.avatar_url);
});

const attachmentUrls = computed(() => {
  if (!meeting.value?.attachments || !Array.isArray(meeting.value.attachments)) {
    return [];
  }
  
  return meeting.value.attachments.map(filename => ({
    filename,
    url: generateAttachmentUrl(meeting.value.id, filename),
    name: filename
  }));
});

const downloadAttachment = (attachment: any) => {
  if (attachment.url) {
    window.open(attachment.url, '_blank');
  }
};

const openCourseLink = () => {
  if (meeting.value?.link) {
    window.open(meeting.value.link, '_blank');
  }
};

const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
};

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
      error.value = 'Gagal memuat course';
      if (fetchError.code === 'PGRST116') {
        notFound.value = true;
      }
    } else if (data) {
      meeting.value = data;
      
      if (data.author_id) {
        await fetchAuthor(data.author_id);
      }
    } else {
      notFound.value = true;
    }
  } catch (err) {
    console.error('Exception fetching meeting:', err);
    error.value = 'Terjadi kesalahan yang tidak terduga';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/courses');
};

onMounted(() => {
  fetchMeetingById();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-14">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
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
            <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
            <span class="font-semibold">JuruTani Courses</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
        <p class="text-gray-600 dark:text-gray-400 mt-4">Memuat course...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Oops! Terjadi Kesalahan</h3>
          <p class="text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
          <UButton color="red" variant="outline" @click="goBack">
            Kembali ke Daftar Course
          </UButton>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else-if="notFound" class="text-center py-20">
        <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-md mx-auto">
          <div class="text-6xl mb-4">📚</div>
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Course Tidak Ditemukan</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Course yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <UButton color="gray" variant="outline" @click="goBack">
            Kembali ke Daftar Course
          </UButton>
        </div>
      </div>

      <!-- Course Content -->
      <article v-else-if="meeting" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Hero Image -->
        <div class="relative h-64 md:h-80 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="meeting.title"
            class="w-full h-full object-cover"
          >
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center text-green-600 dark:text-green-400">
              <UIcon name="i-heroicons-academic-cap" class="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p class="text-sm opacity-75">Tidak ada gambar</p>
            </div>
          </div>

          <!-- Category Badge -->
          <div class="absolute top-4 right-4">
            <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full shadow-sm">
              <span>{{ getCategoryIcon(meeting.category) }}</span>
              {{ meeting.category }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8">
          <!-- Title -->
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {{ meeting.title }}
          </h1>

          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              <span>{{ formatDate(meeting.created_at) }}</span>
            </div>
            
            <div v-if="author" class="flex items-center gap-1">
              <UIcon name="i-heroicons-user" class="w-4 h-4" />
              <span>{{ author.full_name || 'Instruktur' }}</span>
            </div>
          </div>

          <!-- Instructor -->
          <div v-if="author" class="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-green-600" />
              Instruktur
            </h2>
            <div class="flex items-center space-x-4">
              <img
                :src="authorAvatarUrl || '/placeholder.png'"
                :alt="author.full_name"
                class="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              >
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ author.full_name || 'Nama tidak tersedia' }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ author.role || 'Role tidak tersedia' }}</p>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-green-600" />
              Deskripsi Course
            </h2>
            <div 
              class="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 hover:prose-a:text-green-700 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-a:text-green-400"
              v-html="meeting.description || meeting.content"
            />
          </div>

          <!-- Course Link -->
          <div v-if="meeting.link" class="mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <UIcon name="i-heroicons-link" class="w-5 h-5 text-green-600" />
              Link Course
            </h2>
            <div class="flex items-center justify-between">
              <a 
                :href="meeting.link" 
                target="_blank" 
                class="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium break-all flex-1 mr-4"
              >
                {{ meeting.link }}
              </a>
              <UButton
                color="green"
                variant="solid"
                icon="i-heroicons-arrow-top-right-on-square"
                @click="openCourseLink"
              >
                Akses Course
              </UButton>
            </div>
          </div>

          <!-- Attachments -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-paper-clip" class="w-5 h-5 text-green-600" />
              Lampiran
            </h2>
            
            <div v-if="attachmentUrls.length > 0" class="space-y-3">
              <div 
                v-for="attachment in attachmentUrls" 
                :key="attachment.filename"
                class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
                @click="downloadAttachment(attachment)"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                    <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">
                      {{ getFileExtension(attachment.filename) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-sm text-blue-900 dark:text-blue-200">{{ attachment.filename }}</p>
                    <p class="text-xs text-blue-600 dark:text-blue-400">Klik untuk mengunduh</p>
                  </div>
                </div>
                <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div v-else class="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <UIcon name="i-heroicons-paper-clip" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p class="text-gray-500 dark:text-gray-400">Tidak ada lampiran</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose h1, .prose h2, .prose h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.prose h1 {
  font-size: 1.875rem;
}

.prose h2 {
  font-size: 1.5rem;
}

.prose h3 {
  font-size: 1.25rem;
}

.prose ul, .prose ol {
  margin: 1.25rem 0;
  padding-left: 1.75rem;
}

.prose li {
  margin: 0.75rem 0;
}

.prose blockquote {
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 4px solid #10b981;
  font-style: italic;
  color: #6b7280;
}

.dark .prose blockquote {
  color: #9ca3af;
  border-left-color: #34d399;
}
</style>