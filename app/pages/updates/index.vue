<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();

const updates = ref([]);
const loading = ref(true);
const error = ref(null);

const currentPage = ref(1);
const pageSize = ref(9);
const totalPages = ref(1);

const fetchUpdates = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: fetchError, count } = await supabase
      .from('updates')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .range((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value - 1);

    if (fetchError) {
      error.value = fetchError.message;
    } else {
      updates.value = data || [];
      console.log('Fetched updates:', updates.value);
      totalPages.value = Math.ceil((count || 0) / pageSize.value);
    }
  } catch (err) {
    error.value = 'Gagal memuat data.';
  } finally {
    loading.value = false;
  }
};

watch(currentPage, fetchUpdates);
onMounted(fetchUpdates);
</script>

<template>
  <div class="container mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold text-center mb-6">Update Terbaru</h1>

    <div v-if="loading" class="text-center text-gray-500 py-10">Memuat data...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else-if="updates.length === 0" class="text-center text-gray-500">Belum ada update.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UpdatesCardContent v-for="item in updates" :key="item.id" :update="item" />
    </div>

    <Pagination
      v-if="!loading && updates.length > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @prev="currentPage > 1 ? currentPage-- : null"
      @next="currentPage < totalPages ? currentPage++ : null"
      @goto="(p) => (currentPage = p)"
    />
  </div>
</template>
