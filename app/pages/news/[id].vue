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
const relatedLoading = ref(false);

// Fetch single news
const fetchNewsDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fix: Menghilangkan destructuring yang salah
    const { data, error: fetchError } = await supabase
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
    
    // Fetch related news setelah berhasil mengambil news utama
    if (data.category) {
      await fetchRelatedNews(data.category);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Fetch related news with the same category
const fetchRelatedNews = async (category) => {
  if (!category) return;
  
  relatedLoading.value = true;
  
  try {
    console.log('Fetching related news for category:', category); // Debug log
    
    const { data, error: fetchError } = await supabase
      .from('news')
      .select('id, title, sub_title, image_url, category, created_at, author')
      .eq('category', category)
      .eq('status_news', 'approved')
      .limit(3);

    if (fetchError) {
      console.error('Error fetching related news:', fetchError);
      return;
    }

    console.log('Related news data:', data); // Debug log
    relatedNews.value = data || [];
  } catch (err) {
    console.error('Error fetching related news:', err);
  } finally {
    relatedLoading.value = false;
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

// Navigate to news detail
const goToNews = (id) => {
  router.push(`/news/${id}`);
};

// Go back to news list
const goBack = () => {
  router.push('/news');
};

// Format category for display
const formatCategory = (category) => {
  if (!category) return 'Lainnya';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Truncate text for card display
const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
      class="mb-6 flex items-center text-green-700 hover:text-green-900 font-medium dark:text-green-300 dark:hover:text-green-100 transition-colors" 
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
        class="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500 transition-colors" 
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
          <div class="text-center">
            <div class="text-6xl mb-2">🌱</div>
            <span>Tidak ada gambar</span>
          </div>
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
          <p v-if="news.updated_at && news.updated_at !== news.created_at">
            <span class="font-bold">Diperbarui:</span> {{ formatDate(news.updated_at) }}
          </p>
        </div>

        <!-- Konten HTML -->
        <div class="prose max-w-none prose-green prose-headings:text-green-800 prose-a:text-green-600 dark:prose-invert dark:prose-a:text-green-300 dark:prose-headings:text-green-200" v-html="news.content"/>

        <!-- Link Terkait -->
        <div v-if="news.link" class="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-600 dark:bg-green-950 dark:border-green-500">
          <h3 class="font-semibold text-green-800 mb-2 dark:text-green-300">Link Informasi Terkait:</h3>
          <a :href="news.link" class="text-green-600 hover:underline flex items-center dark:text-green-300 dark:hover:text-green-200 break-all" target="_blank" rel="noopener noreferrer">
            <span class="mr-2">🔗</span>
            {{ news.link }}
            <span class="ml-2">↗</span>
          </a>
        </div>

        <!-- Lampiran -->
        <div v-if="news.attachments?.length" class="mt-8 bg-green-50 p-4 rounded-lg dark:bg-green-950">
          <h3 class="text-lg font-semibold mb-4 text-green-800 dark:text-green-300">Lampiran Penting:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="(file, index) in news.attachments" 
              :key="index" 
              class="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-700 dark:border-green-700"
              @click="window.open(file.url, '_blank')"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <span class="text-green-600 dark:text-green-400 text-xs font-bold">
                      {{ file.name?.split('.').pop()?.toUpperCase() || 'FILE' }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ file.name || 'Lampiran' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ file.size ? `${Math.round(file.size / 1024)} KB` : 'Klik untuk membuka' }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <span class="text-gray-400">📎</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Berita Terkait -->
    <div v-if="news" class="mt-12">
      <h2 class="text-2xl font-bold mb-6 text-green-800 border-b-2 border-green-500 pb-2 dark:text-green-300 dark:border-green-400">
        Informasi Pertanian Terkait
      </h2>
      
      <!-- Loading related news -->
      <div v-if="relatedLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-700 border-t-transparent dark:border-green-400"/>
        <p class="text-green-800 mt-2 dark:text-green-300">Memuat berita terkait...</p>
      </div>
      
      <!-- Related news content -->
      <div v-else-if="relatedNews.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="item in relatedNews" 
          :key="item.id" 
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-green-100 cursor-pointer dark:bg-gray-800 dark:border-green-700"
          @click="goToNews(item.id)"
        >
          <!-- Image -->
          <div class="h-48 bg-green-50 dark:bg-green-900 rounded-t-lg overflow-hidden">
            <img
              v-if="item.image_url"
              :src="item.image_url"
              :alt="item.title"
              class="w-full h-full object-cover"
            >
            <div v-else class="flex items-center justify-center h-full text-green-500 dark:text-green-300">
              <div class="text-center">
                <div class="text-3xl mb-1">🌱</div>
                <span class="text-sm">No Image</span>
              </div>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-4">
            <!-- Category -->
            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2 dark:bg-green-900 dark:text-green-200">
              {{ formatCategory(item.category) }}
            </span>
            
            <!-- Title -->
            <h3 class="font-semibold text-green-900 mb-2 line-clamp-2 dark:text-green-100">
              {{ item.title }}
            </h3>
            
            <!-- Subtitle -->
            <p v-if="item.sub_title" class="text-sm text-green-600 mb-2 line-clamp-2 dark:text-green-300">
              {{ truncateText(item.sub_title, 80) }}
            </p>
            
            <!-- Meta -->
            <div class="flex items-center justify-between text-xs text-green-500 dark:text-green-400">
              <span>{{ item.author || 'Tim JuruTani' }}</span>
              <span>{{ formatDate(item.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No related news -->
      <div v-else class="text-center py-12 bg-green-50 dark:bg-green-950 rounded-lg">
        <div class="text-4xl mb-4">🌾</div>
        <p class="text-green-600 dark:text-green-400">
          Belum ada berita terkait untuk kategori ini
        </p>
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