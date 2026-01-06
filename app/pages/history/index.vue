<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { toastStore } from '~/composables/useJuruTaniToast';
import AllTab from '~/components/History/AllTab.vue';
import NewTab from '~/components/History/NewTab.vue';
import MarketTab from '~/components/History/MarketTab.vue';

const { supabase } = useSupabase();

const currentUserId = ref(null);
const loading = ref(true);
const error = ref(null);

// Filter - hanya news dan markets
const activeFilter = ref('all');
const filters = ['all', 'news', 'markets'];
const filterLabels = {
  all: 'Semua',
  news: 'Berita',
  markets: 'Pasar'
};

// Fetch user data
const fetchCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toastStore.error('Tidak dapat memuat data pengguna. Silakan login kembali.');
      return null;
    }
    
    return user.id;
  } catch (err) {
    console.error('Error fetching current user:', err);
    toastStore.error('Gagal memuat data pengguna.');
    return null;
  }
};

// Change filter
const changeFilter = (filter) => {
  activeFilter.value = filter;
};

// Initialize user data
const initializeUserData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    currentUserId.value = await fetchCurrentUser();
    if (!currentUserId.value) {
      error.value = 'User tidak ditemukan';
    }
  } catch (err) {
    console.error('Exception initializing user data:', err);
    error.value = err;
    toastStore.error('Terjadi kesalahan saat memuat data pengguna.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initializeUserData();
});
</script>

<template>
  <div class="min-h-screen py-12 px-4 transition-colors duration-200">
    <div class="container mx-auto max-w-4xl">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 dark:bg-green-700 rounded-full mb-4 shadow-lg dark:shadow-green-900/50">
          <UIcon name="i-lucide-clock" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Riwayat Aktivitas</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Pantau dan kelola aktivitas Anda dengan mudah
        </p>
      </div>
      
      <!-- Filter Tabs -->
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-md border border-gray-100 dark:border-gray-800 mb-6 overflow-hidden transition-all duration-200">
        <div class="flex border-b border-gray-100 dark:border-gray-800">
          <button 
            v-for="filter in filters" 
            :key="filter"
            :class="[
              'flex-1 px-6 py-4 text-center font-medium transition-all duration-200',
              activeFilter === filter 
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-950/30' 
                : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            ]"
            @click="changeFilter(filter)"
          >
            {{ filterLabels[filter] }}
          </button>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-green-500 mb-4"/>
        <p class="text-gray-500 dark:text-gray-400">Memuat riwayat aktivitas Anda...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg transition-colors duration-200">
        <div class="flex items-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
          <p class="font-medium">Terjadi kesalahan saat memuat riwayat aktivitas.</p>
        </div>
        <button 
          class="mt-3 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm transition-colors duration-200 font-medium" 
          @click="initializeUserData"
        >
          Coba lagi
        </button>
      </div>
      
      <!-- Tab Content -->
      <div v-else>
        <!-- All Tab -->
        <AllTab 
          v-if="activeFilter === 'all'"
          :user-id="currentUserId"
        />
        
        <!-- News Tab -->
        <NewTab 
          v-else-if="activeFilter === 'news'"
          :user-id="currentUserId"
        />
        
        <!-- Markets Tab -->
        <MarketTab 
          v-else-if="activeFilter === 'markets'"
          :user-id="currentUserId"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>