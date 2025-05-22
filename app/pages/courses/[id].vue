<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupabase } from '~/composables/useSupabase';

const route = useRoute();
const router = useRouter();
const { supabase } = useSupabase();

// Data
const newsId = route.params.id;
const news = ref(null);
const loading = ref(true);
const error = ref(null);
const relatedNews = ref([]);

// Fetch single news
const fetchNewsDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data, fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', newsId)
      .eq('status_news', 'approved')
      .single();

    if (fetchError) {
      console.error('Error fetching news detail:', fetchError);
      error.value = fetchError;
      return;
    }

    if (!data) {
      error.value = { message: 'Berita tidak ditemukan' };
      return;
    }

    news.value = data;
    
    // Fetch related news in the same category
    fetchRelatedNews(data.category);
  } catch (err) {
    console.error('Unexpected error:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Fetch related news with the same category
const fetchRelatedNews = async (category) => {
  try {
    const { data, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      .eq('status_news', 'approved')
      .neq('id', newsId) // Exclude current news
      .order('created_at', { ascending: false })
      .limit(3);

    if (fetchError) {
      console.error('Error fetching related news:', fetchError);
      return;
    }

    relatedNews.value = data || [];
  } catch (err) {
    console.error('Error fetching related news:', err);
  }
};

// Format date to Indonesian style
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Go back to news list
const goBack = () => {
  router.push('/news');
};

// Format category for display
const formatCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Load data on mount
onMounted(() => {
  fetchNewsDetail();
});
</script>

<template>
    <div class="news-detail container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100">
      <!-- Header dengan tema juru tani -->
      <div class="bg-green-700 text-white px-6 py-3 rounded-t-lg shadow-md mb-4 dark:bg-green-800">
        <h2 class="text-xl font-bold">Portal Berita JuruTani</h2>
      </div>
  
      <!-- Tombol Kembali -->
      <button 
        class="mb-6 flex items-center text-green-700 hover:text-green-900 font-medium dark:text-green-300 dark:hover:text-green-100" 
        @click="goBack"
      >
        <span class="mr-1">&larr;</span> Kembali ke Daftar Berita
      </button>
  
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-700 border-t-transparent dark:border-green-400 dark:border-t-transparent"/>
        <p class="text-green-800 mt-4 dark:text-green-300">Memuat berita...</p>
      </div>
  
      <!-- Error -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:text-red-200 dark:border-red-500">
        <p>{{ error.message || 'Terjadi kesalahan saat memuat berita.' }}</p>
        <button 
          class="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500" 
          @click="goBack"
        >
          Kembali
        </button>
      </div>
  
      <!-- Konten Berita -->
      <div v-else-if="news" class="bg-white rounded-lg shadow-lg overflow-hidden border border-green-200 dark:bg-gray-800 dark:border-green-800">
        <!-- Gambar utama -->
        <div class="relative h-64 md:h-96 bg-green-50 dark:bg-green-900">
          <img
            v-if="news.image_url"
            :src="news.image_url"
            :alt="news.title"
            class="w-full h-full object-cover"
          >
          <div v-else class="flex items-center justify-center h-full bg-green-50 text-green-500 dark:bg-green-900 dark:text-green-300">
            <span>Tidak ada gambar</span>
          </div>
  
          <!-- Kategori -->
          <div class="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full dark:bg-green-600">
            {{ formatCategory(news.category || 'Lainnya') }}
          </div>
        </div>
  
        <!-- Isi konten -->
        <div class="p-6">
          <h1 class="text-3xl font-bold mb-2 text-green-900 dark:text-green-300">{{ news.title }}</h1>
          <h2 v-if="news.sub_title" class="text-xl text-green-700 mb-4 dark:text-green-400">{{ news.sub_title }}</h2>
  
          <!-- Meta -->
          <div class="flex flex-wrap gap-4 text-sm text-green-600 mb-6 bg-green-50 p-4 rounded-lg dark:bg-green-950 dark:text-green-300">
            <p><span class="font-bold">Penulis:</span> {{ news.author || 'Tim JuruTani' }}</p>
            <p><span class="font-bold">Tanggal:</span> {{ formatDate(news.created_at) }}</p>
            <p v-if="news.updated_at"><span class="font-bold">Diperbarui:</span> {{ formatDate(news.updated_at) }}</p>
          </div>
  
          <!-- Konten HTML -->
          <div class="prose max-w-none prose-green prose-headings:text-green-800 prose-a:text-green-600 dark:prose-invert dark:prose-a:text-green-300 dark:prose-headings:text-green-200" v-html="news.content"/>
  
          <!-- Link Terkait -->
          <div v-if="news.link" class="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-600 dark:bg-green-950 dark:border-green-500">
            <h3 class="font-semibold text-green-800 mb-2 dark:text-green-300">Link Informasi Terkait:</h3>
            <a :href="news.link" class="text-green-600 hover:underline flex items-center dark:text-green-300 dark:hover:text-green-200" target="_blank">
              <!-- Icon tetap -->
              ...
              {{ news.link }}
            </a>
          </div>
  
          <!-- Lampiran -->
          <div v-if="news.attachments?.length" class="mt-8 bg-green-50 p-4 rounded-lg dark:bg-green-950">
            <h3 class="text-lg font-semibold mb-4 text-green-800 dark:text-green-300">Lampiran Penting:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="(file, index) in news.attachments" 
                :key="index" 
                class="border rounded overflow-hidden bg-white shadow-sm dark:bg-gray-700 dark:border-green-700"
              >
                ...
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Berita Terkait -->
      <div v-if="news && relatedNews.length" class="mt-12">
        <h2 class="text-2xl font-bold mb-6 text-green-800 border-b-2 border-green-500 pb-2 dark:text-green-300 dark:border-green-400">
          Informasi Pertanian Terkait
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="item in relatedNews" 
            :key="item.id" 
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 border border-green-100 dark:bg-gray-800 dark:border-green-700"
          >
            ...
          </div>
        </div>
      </div>
    </div>
  </template>
  