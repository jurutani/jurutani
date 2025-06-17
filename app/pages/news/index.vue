<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { CreateButton } from '#components';

const { supabase } = useSupabase();

// Data
const newsList = ref([]);
const loading = ref(true);
const error = ref(null);

// Filter and pagination
const currentCategory = ref('Semua');
const categories = ['Semua', 'Pertanian', 'Teknologi', 'Prestasi', 'Peternakan', 'Lainya'];
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);

// Fetch news with filters
const fetchNews = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    let query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .eq('status_news', 'approved')
      .order('created_at', { ascending: false })
      .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1);
    
    // Apply category filter if not 'Semua'
    if (currentCategory.value !== 'Semua') {
      query = query.eq('category', currentCategory.value);
    }
    
    const { data, error: fetchError, count } = await query;

    if (fetchError) {
      console.error(fetchError);
      error.value = fetchError;
    } else {
      newsList.value = data || [];
      totalPages.value = Math.ceil((count || 0) / pageSize.value);
    }
  } catch (err) {
    console.error(err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Reset to page 1 when category changes
watch(currentCategory, () => {
  currentPage.value = 1;
  fetchNews();
});

// Refetch when page changes
watch(currentPage, () => {
  fetchNews();
});

// Initial fetch
onMounted(() => {
  fetchNews();
});
</script>

<template>
  <div class="news-page container mx-auto px-4 py-12">
     <!-- Pasar Section Header -->
    <div class="mx-auto mb-6 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-newspaper" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Berita Terupdate Jurutani</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Berita Tani JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Dapatkan informasi terkini seputar dunia pertanian, teknologi, dan inovasi dengan
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">berita terpercaya</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">update teknologi</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">prestasi petani</span> yang menginspirasi.
      </p> 
    </div>
    
    <!-- Category Filter -->
    <NewsFilterCategory 
      :categories="categories" 
      :current-category="currentCategory" 
      @update:category="currentCategory = $event" 
    />
    
    <!-- News Content -->
    <div class="mt-8">
      <LoadingData v-if="loading"/>      
      <ErrorData v-else-if="error" />
      <NotFoundData v-else-if="newsList.length === 0" />
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NewsCardContent 
          v-for="news in newsList" 
          :key="news.id" 
          :news="news" 
        />
      </div>
    </div>
    
    <!-- Pagination -->
    <Pagination 
      v-if="!loading && newsList.length > 0" 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @prev="currentPage > 1 ? currentPage-- : null" 
      @next="currentPage < totalPages ? currentPage++ : null" 
      @goto="page => currentPage = page" 
    />
    <CreateButton />
  </div>
</template>