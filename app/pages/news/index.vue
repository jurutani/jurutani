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
  <div class="news-page container mx-auto px-4">
    <h1 class="text-2xl font-bold text-center my-8">Berita Terkini</h1>
    
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