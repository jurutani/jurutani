<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupabase } from '~/composables/useSupabase';

const route = useRoute();
const router = useRouter();
const { supabase } = useSupabase();

const meeting = ref(null);
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

// Fungsi untuk download attachment
const downloadAttachment = (attachment: any) => {
  if (attachment.url) {
    window.open(attachment.url, '_blank');
  }
};

// Fungsi untuk mendapatkan file extension dari nama file
const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
};

// Fetch meeting berdasarkan ID
const fetchMeetingById = async () => {
  loading.value = true;
  error.value = null;
  notFound.value = false;

  try {
    const meetingId = route.params.id;

    if (!meetingId) {
      router.push('/meetings');
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

onMounted(() => {
  fetchMeetingById();
});
</script>

<template>
  <div class="meeting-detail container mx-auto px-4 py-8 max-w-4xl dark:text-gray-100">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"/>
      <p class="text-gray-500 dark:text-gray-400">Memuat rapat...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg dark:bg-red-900/20 dark:border-red-500 dark:text-red-200">
      <div class="flex items-center">
        <span class="text-xl mr-3">⚠️</span>
        <div>
          <p class="font-medium">Terjadi kesalahan saat memuat rapat</p>
          <p class="text-sm mt-1 opacity-75">Silakan coba lagi atau kembali ke daftar rapat</p>
        </div>
      </div>
      <button 
        class="mt-4 text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300 transition-colors" 
        @click="goBack"
      >
        ← Kembali ke daftar rapat
      </button>
    </div>

    <!-- Not Found State -->
    <div v-else-if="notFound" class="text-center py-16">
      <div class="text-6xl mb-4">📅</div>
      <h2 class="text-2xl font-bold text-gray-700 mb-4 dark:text-gray-200">Rapat tidak ditemukan</h2>
      <p class="text-gray-500 mb-8 dark:text-gray-400">Rapat yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
      <button 
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium dark:bg-blue-700 dark:hover:bg-blue-800" 
        @click="goBack"
      >
        Kembali ke daftar rapat
      </button>
    </div>

    <!-- Meeting Content -->
    <div v-else-if="meeting" class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <!-- Back Button -->
        <button 
          class="mb-4 text-gray-600 hover:text-gray-800 flex items-center text-sm font-medium dark:text-gray-400 dark:hover:text-gray-200 transition-colors" 
          @click="goBack"
        >
          <span class="mr-2">←</span> Kembali ke daftar rapat
        </button>

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

      <!-- Content -->
      <div class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">📝</span>
          Deskripsi Rapat
        </h2>
        <div 
          class="prose prose-gray max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300" 
          v-html="meeting.content"
        />
      </div>

      <!-- Link Section -->
      <div v-if="meeting.link" class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">🔗</span>
          Link Rapat
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
      <div v-if="meeting.attachments && meeting.attachments.length > 0" class="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800 border dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">📎</span>
          Lampiran ({{ meeting.attachments.length }})
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(attachment, index) in meeting.attachments" 
            :key="index"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer"
            @click="downloadAttachment(attachment)"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">
                    {{ getFileExtension(attachment.name || attachment.filename || 'FILE') }}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ attachment.name || attachment.filename || 'Lampiran' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ attachment.size ? `${Math.round(attachment.size / 1024)} KB` : 'Klik untuk membuka' }}
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
        <p class="text-gray-500 dark:text-gray-400 text-sm">Tidak ada lampiran untuk rapat ini</p>
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
</style>