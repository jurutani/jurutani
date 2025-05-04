<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();

const announcements = ref([]);
const loading = ref(true);
const error = ref(null);

// Filter dan pagination
const currentCategory = ref('all');
const categories = ['all', 'Kampus', 'Pertemuan', 'Kegiatan', 'Webinar', 'Lomba'];
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);

// Fetch pengumuman
const fetchAnnouncements = async () => {
  loading.value = true;
  error.value = null;

  try {
    let query = supabase
      .from('announcement')
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
      console.log('Fetched announcements:', announcements.value);
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
    <h1 class="text-2xl font-bold text-center my-8">Pengumuman Terkini</h1>

    <!-- Filter Kategori -->
    <NewsFilterCategory
      :categories="categories"
      :current-category="currentCategory"
      @update:category="currentCategory = $event"
    />

    <!-- Konten -->
    <div class="mt-8">
      <div v-if="loading" class="text-center py-10">
        <p class="text-gray-500">Memuat pengumuman...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Terjadi kesalahan saat memuat pengumuman.</p>
      </div>

      <div v-else-if="announcements.length === 0" class="text-center py-10">
        <p class="text-gray-500">Tidak ada pengumuman tersedia untuk kategori ini.</p>
      </div>

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
