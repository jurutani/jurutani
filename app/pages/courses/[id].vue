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
      error.value = fetchError;
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
    error.value = err;
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
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Header -->
    <div class="mb-6">
      <button 
        class="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        @click="goBack"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        <span>Kembali ke Course</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"/>
      <p class="text-gray-500">Memuat course...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      <p class="font-medium">Terjadi kesalahan saat memuat course</p>
      <button class="mt-2 text-blue-600 hover:text-blue-800" @click="goBack">
        ← Kembali ke daftar course
      </button>
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="text-center py-16">
      <div class="text-6xl mb-4">📚</div>
      <h2 class="text-2xl font-bold text-gray-700 mb-4">Course tidak ditemukan</h2>
      <p class="text-gray-500 mb-8">Course yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
      <button 
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700" 
        @click="goBack"
      >
        Kembali ke daftar course
      </button>
    </div>

    <!-- Meeting Content -->
    <div v-else-if="meeting" class="space-y-6">
      <!-- Image or Placeholder -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border">
        <div v-if="imageUrl" class="relative h-64 md:h-80">
          <img
            :src="imageUrl"
            :alt="meeting.title"
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div class="flex items-center gap-3 mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                <span class="mr-1">{{ getCategoryIcon(meeting.category) }}</span>
                {{ meeting.category }}
              </span>
              <span class="text-sm opacity-90">{{ formatDate(meeting.created_at) }}</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold">{{ meeting.title }}</h1>
          </div>
        </div>
        <div v-else class="p-6">
          <div class="flex items-center justify-center h-40 bg-gray-100 rounded-lg mb-4">
            <div class="text-center">
              <div class="text-6xl mb-2">📚</div>
              <p class="text-gray-500 text-sm">Tidak ada gambar</p>
            </div>
          </div>
          <div class="flex items-center justify-between mb-4">
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              :class="getCategoryBadgeClass(meeting.category)"
            >
              <span class="mr-1">{{ getCategoryIcon(meeting.category) }}</span>
              {{ meeting.category }}
            </span>
            <span class="text-sm text-gray-500">{{ formatDate(meeting.created_at) }}</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">{{ meeting.title }}</h1>
        </div>
      </div>

      <!-- Author -->
      <div v-if="author" class="bg-white rounded-xl shadow-sm p-6 border">
        <h2 class="text-lg font-semibold mb-4">👨‍🏫 Instruktur</h2>
        <div class="flex items-center space-x-4">
          <img
            :src="authorAvatarUrl || '/placeholder.png'"
            :alt="author.full_name"
            class="w-12 h-12 rounded-full object-cover"
          >
          <div>
            <h3 class="font-medium">{{ author.full_name || 'Nama tidak tersedia' }}</h3>
            <p class="text-sm text-gray-500">{{ author.role || 'Role tidak tersedia' }}</p>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-xl shadow-sm p-6 border">
        <h2 class="text-lg font-semibold mb-4">📝 Deskripsi Course</h2>
        <div 
          class="prose max-w-none" 
          v-html="meeting.description || meeting.content"
        />
      </div>

      <!-- Link -->
      <div v-if="meeting.link" class="bg-white rounded-xl shadow-sm p-6 border">
        <h2 class="text-lg font-semibold mb-4">🔗 Link Course</h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <a 
            :href="meeting.link" 
            target="_blank" 
            class="text-blue-600 hover:text-blue-800 font-medium break-all"
          >
            {{ meeting.link }} ↗
          </a>
        </div>
      </div>

      <!-- Attachments -->
      <div class="bg-white rounded-xl shadow-sm p-6 border">
        <h2 class="text-lg font-semibold mb-4">📎 Lampiran</h2>
        <div v-if="attachmentUrls.length > 0" class="space-y-3">
          <div 
            v-for="attachment in attachmentUrls" 
            :key="attachment.filename"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
            @click="downloadAttachment(attachment)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="text-blue-600 text-xs font-bold">
                  {{ getFileExtension(attachment.filename) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-sm">{{ attachment.filename }}</p>
                <p class="text-xs text-gray-500">Klik untuk mengunduh</p>
              </div>
            </div>
            <span class="text-gray-400">⬇️</span>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <div class="text-4xl mb-3">📎</div>
          <p class="text-gray-500">Tidak ada lampiran</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-xl shadow-sm p-6 border">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            v-if="meeting.link"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
            @click="openCourseLink"
          >
            🚀 Akses Course
          </button>
          <button 
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
            @click="goBack"
          >
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.6;
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
</style>