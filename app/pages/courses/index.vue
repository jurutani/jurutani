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
  <div class="announcement-page container mx-auto px-4">
    <div class="mx-auto mb-12 max-w-2xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-green-800 dark:text-green-300">
          Pengumuman Course / Pelatihan JuruTani
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Temukan berbagai pengumuman terkait kursus, pelatihan, dan kegiatan yang diselenggarakan oleh JuruTani.
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
