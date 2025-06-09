<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { CreateButton } from '#components';

const { supabase } = useSupabase();

// Data
const marketsList = ref([]);
const loading = ref(true);
const error = ref(null);

// Filter and pagination
const currentCategory = ref('Semua');
const categories = ['Semua', 'Hasil Pertanian', 'Hasil Peternakan', 'Produk Olahan', 'Penunjang Pertanian', 'Lainya'];
const currentPage = ref(1);
const pageSize = ref(12);
const totalPages = ref(1);

// Fetch markets with filters
const fetchMarkets = async () => {
  loading.value = true;
  error.value = null;

  try {
    let query = supabase
      .from('markets')
      .select(`
        *
      `, { count: 'exact' }) // hanya ambil kolom yang dibutuhkan
      .is('deleted_at', null)
      .is('archived_at', null)
      .eq('status', 'Approved')
      .order('created_at', { ascending: false })
      .range(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value - 1
      );

    if (currentCategory.value !== 'Semua') {
      query = query.eq('category', currentCategory.value);
    }

    const { data, error: fetchError, count } = await query;

    if (fetchError) {
      console.error('[Supabase Fetch Error]', fetchError);
      error.value = fetchError;
    } else {
      // console.log('[Markets Fetched Data]', data); // ✅ Debug log
      marketsList.value = data || [];
      totalPages.value = Math.ceil((count || 0) / pageSize.value);
    }
  } catch (err) {
    console.error('[FetchMarkets Error]', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};


// Reset to page 1 when category changes
watch(currentCategory, () => {
  currentPage.value = 1;
  fetchMarkets();
});

// Refetch when page changes
watch(currentPage, () => {
  fetchMarkets();
});

// Initial fetch
onMounted(() => {
  fetchMarkets();
});
</script>

<template>
  <div class="markets-page container mx-auto px-4">
    <div class="mx-auto mb-12 max-w-2xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-green-800 dark:text-green-300">
          Produk Pasar Jurutani
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Temukan berbagai produk pertanian dan peternakan dari petani lokal. 
          Dukung ekonomi petani dengan membeli hasil pertanian langsung dari sumbernya.
        </p>
      </div>
    
    <!-- Category Filter -->
    <MarketsFilterCategory 
      :categories="categories" 
      :current-category="currentCategory" 
      @update:category="currentCategory = $event" 
    />
    
    <!-- Markets Content -->
    <div class="mt-8">
        <LoadingData v-if="loading"/>      
        <ErrorData v-else-if="error" />
        <NotFoundData v-else-if="marketsList.length === 0" />
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MarketsCardContent 
          v-for="product in marketsList" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
    
    <!-- Pagination -->
    <Pagination 
      v-if="!loading && marketsList.length > 0" 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @prev="currentPage > 1 ? currentPage-- : null" 
      @next="currentPage < totalPages ? currentPage++ : null" 
      @goto="page => currentPage = page" 
    />
    <CreateButton />
  </div>
</template>
