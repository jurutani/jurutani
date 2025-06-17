<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();

const announcements = ref([]);
const loading = ref(true);
const error = ref(null);

// Filter dan pagination
const currentCategory = ref('all');
const categories = ['all', 'Online', 'Offline', 'Lainya'];
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);

// Fetch pengumuman
const fetchAnnouncements = async () => {
  loading.value = true;
  error.value = null;

  try {
    let query = supabase
      .from('meetings')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1);

    if (currentCategory.value !== 'all') {
      query = query.eq('category', currentCategory.value);
    }

    const { data, error: fetchError, count } = await query;

    if (fetchError) {
      console.error(fetchError);
      error.value = fetchError;
    } else {
      announcements.value = data || [];
      // console.log('Fetched announcements:', announcements.value);
      totalPages.value = Math.ceil((count || 0) / pageSize.value);
    }
  } catch (err) {
    console.error(err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

watch(currentCategory, () => {
  currentPage.value = 1;
  fetchAnnouncements();
});

watch(currentPage, () => {
  fetchAnnouncements();
});

onMounted(() => {
  fetchAnnouncements();
});
</script>
<template>
  <div class="announcement-page container mx-auto px-4 py-12">
      
      <!-- Header Section -->
      <!-- <div class="mx-auto mb-6 max-w-4xl text-center">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
          </svg>
          <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Pengembangan Kemampuan Pertanian</span>
        </div>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Pengumuman Course & Pelatihan
        </h1>
        
        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Temukan berbagai kesempatan untuk mengembangkan kemampuan pertanian melalui 
          <span class="font-semibold text-blue-600 dark:text-blue-400">kursus bersertifikat</span>, 
          <span class="font-semibold text-indigo-600 dark:text-indigo-400">pelatihan praktis</span>, dan 
          <span class="font-semibold text-purple-600 dark:text-purple-400">workshop inovatif</span> yang diselenggarakan oleh JuruTani.
        </p>
      </div> -->
      <div class="mx-auto mb-6 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-users" class="w-5 h-5 text-green-600 dark:text-green-400" />
    <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Pengembangan Kemampuan Pertanian</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Pengumuman Course & Pelatihan
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Temukan berbagai kesempatan untuk mengembangkan kemampuan pertanian melalui
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">kursus bersertifikat</span>,
        <span class="font-semibold text-teal-600 dark:text-teal-400">pelatihan praktis</span>, dan
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">workshop inovatif</span> yang diselenggarakan oleh JuruTani.
      </p> 
    </div>
    <!-- Filter Kategori -->
    <NewsFilterCategory
      :categories="categories"
      :current-category="currentCategory"
      @update:category="currentCategory = $event"
    />

    <!-- Konten -->
    <div class="mt-8">
      <LoadingData v-if="loading"/>      
      <ErrorData v-else-if="error" />
      <NotFoundData v-else-if="announcements.length === 0" />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnnouncementCardContent 
          v-for="item in announcements" 
          :key="item.id" 
          :announcement="item" 
        />
      </div>
    </div>

    <!-- Pagination -->
    <Pagination 
      v-if="!loading && announcements.length > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @prev="currentPage > 1 ? currentPage-- : null"
      @next="currentPage < totalPages ? currentPage++ : null"
      @goto="page => currentPage = page"
    />
  </div>
</template>
