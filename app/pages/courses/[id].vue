<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupabase } from '~/composables/useSupabase';

const route = useRoute();
const router = useRouter();
const { supabase } = useSupabase();

const announcement = ref(null);
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
  });
};

// Fetch pengumuman berdasarkan ID
const fetchAnnouncementById = async () => {
  loading.value = true;
  error.value = null;
  notFound.value = false;

  try {
    const announcementId = route.params.id;

    if (!announcementId) {
      router.push('/books');
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('announcement')
      .select('*')
      .eq('id', announcementId)
      .is('deleted_at', null)
      .is('archived_at', null)
      .single();

    if (fetchError) {
      console.error('Error fetching announcement:', fetchError);
      error.value = fetchError;
      if (fetchError.code === 'PGRST116') {
        notFound.value = true;
      }
    } else if (data) {
      announcement.value = data;
    } else {
      notFound.value = true;
    }
  } catch (err) {
    console.error('Exception fetching announcement:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Handle kembali ke halaman daftar pengumuman
const goBack = () => {
  router.push('/books');
};

onMounted(() => {
  fetchAnnouncementById();
});
</script>


<template>
    <div class="announcement-detail container mx-auto px-4 py-8 dark:text-gray-100">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">Memuat pengumuman...</p>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-500 dark:text-red-200">
        <p>Terjadi kesalahan saat memuat pengumuman.</p>
        <button class="mt-4 text-blue-600 hover:underline dark:text-blue-400" @click="goBack">
          Kembali ke daftar pengumuman
        </button>
      </div>
  
      <!-- Not Found State -->
      <div v-else-if="notFound" class="text-center py-12">
        <p class="text-gray-700 text-xl mb-4 dark:text-gray-200">Pengumuman tidak ditemukan</p>
        <p class="text-gray-500 mb-6 dark:text-gray-400">Pengumuman yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" @click="goBack">
          Kembali ke daftar pengumuman
        </button>
      </div>
  
      <!-- Announcement Content -->
      <div v-else-if="announcement" class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
            {{ announcement.category }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(announcement.created_at) }}
          </span>
        </div>
  
        <h1 class="text-2xl font-bold mb-4 dark:text-white">{{ announcement.title }}</h1>
        
        <div v-if="announcement.image" class="mb-6">
          <img 
            :src="announcement.image" 
            :alt="announcement.title"
            class="w-full h-auto rounded-lg object-cover max-h-96"
          >
        </div>
  
        <div class="prose max-w-none dark:prose-invert" v-html="announcement.content" />
  
        <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button class="text-blue-600 hover:underline flex items-center dark:text-blue-400" @click="goBack">
            <span class="mr-1">←</span> Kembali ke daftar pengumuman
          </button>
        </div>
      </div>
    </div>
  </template>
  