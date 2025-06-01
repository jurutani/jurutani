<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { CreateButton, DiscussionsCategoryFilter, VideoCardContent, Pagination } from '#components';

const { supabase } = useSupabase();

// Data
const videoList = ref([]);
const loading = ref(true);
const error = ref(null);

// Filter and pagination
const currentCategory = ref('all');
const categories = ['all', 'Pertanian', 'Peternakan', 'Teknologi', 'Lainya'];
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalCount = ref(0);

// Fetch videos
const fetchVideos = async () => {
  loading.value = true;
  error.value = null;

  try {
    let query = supabase
      .from('videos')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Filter berdasarkan kategori
    if (currentCategory.value !== 'all') {
      query = query.eq('category', currentCategory.value);
    }

    // Get total count first for pagination
    const { count } = await query;
    totalCount.value = count || 0;
    totalPages.value = Math.ceil(totalCount.value / pageSize.value);

    // Then get paginated data
    const { data, error: fetchError } = await query
      .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1);

    if (fetchError) {
      console.error('Fetch videos error:', fetchError);
      error.value = fetchError;
      videoList.value = [];
    } else {
      videoList.value = data || [];
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    error.value = err;
    videoList.value = [];
  } finally {
    loading.value = false;
  }
};

// Handle pagination
const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const handleGotoPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Reactivity
watch(currentCategory, () => {
  currentPage.value = 1;
  fetchVideos();
});

watch(currentPage, () => {
  fetchVideos();
});

onMounted(() => {
  fetchVideos();
});

// Computed
const hasVideos = computed(() => videoList.value && videoList.value.length > 0);
const canGoPrev = computed(() => currentPage.value > 1);
const canGoNext = computed(() => currentPage.value < totalPages.value);

// Generate visible page numbers for pagination
const visiblePages = computed(() => {
  const pages = [];
  const current = currentPage.value;
  const total = totalPages.value;
  
  // Always show page 1
  if (total >= 1) pages.push(1);
  
  // Add ellipsis if there's a gap
  if (current > 4) pages.push('...');
  
  // Add pages around current page
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    if (!pages.includes(i)) pages.push(i);
  }
  
  // Add ellipsis if there's a gap
  if (current < total - 3) pages.push('...');
  
  // Always show last page (if total > 1)
  if (total > 1 && !pages.includes(total)) pages.push(total);
  
  return pages;
});
</script>

<template>
  <div class="video-page container mx-auto px-4 py-6">
  
    <!-- Filter -->
    <div class="flex justify-center items-center mb-8">
      <DiscussionsCategoryFilter 
        :categories="categories" 
        :model-value="currentCategory" 
        @update:model-value="currentCategory = $event" 
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
      <span class="ml-3 text-gray-600">Memuat video...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium">Terjadi kesalahan</h3>
          <p class="mt-1 text-sm">Tidak dapat memuat video. Silakan coba lagi nanti.</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasVideos" class="text-center py-20">
      <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Tidak ada video</h3>
      <p class="mt-2 text-gray-500">
        {{ currentCategory === 'all' ? 'Belum ada video yang tersedia.' : `Tidak ada video untuk kategori "${currentCategory}".` }}
      </p>
    </div>

    <!-- Video Grid -->
    <div v-else>
      <!-- Results Info -->

      <!-- Video Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <VideoCardContent 
          v-for="video in videoList" 
          :key="video.id" 
          :video="video" 
        />
      </div>

      <!-- Enhanced Pagination -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Previous/Next Navigation -->
        <div class="flex items-center gap-2">
          <button 
            :disabled="!canGoPrev"
            :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
              canGoPrev 
                ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900' 
                : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
            ]"
            @click="handlePrevPage"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Sebelumnya
          </button>

          <button 
            :disabled="!canGoNext"
            :class="[
              'flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors',
              canGoNext 
                ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900' 
                : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
            ]"
            @click="handleNextPage"
          >
            Selanjutnya
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Page Numbers -->
        <div class="flex items-center gap-1">
          <template v-for="(page, index) in visiblePages" :key="index">
            <button
              v-if="typeof page === 'number'"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
              @click="handleGotoPage(page)"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-gray-500">...</span>
          </template>
        </div>

        <!-- Page Info -->
        <div class="text-sm text-gray-600">
          Halaman {{ currentPage }} dari {{ totalPages }}
        </div>
      </div>
    </div>

    <!-- Floating Create Button -->
    <CreateButton />
  </div>
</template>

<style scoped>
.video-page {
  min-height: calc(100vh - 200px);
}
</style>