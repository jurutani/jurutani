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
  <div class="history-page container mx-auto px-4 py-12 max-w-4xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Riwayat Aktivitas</h1>
      <p class="text-gray-600">Kelola dan pantau status submission Anda</p>
    </div>
    
    <!-- Filter Tabs -->
    <div class="bg-white rounded-lg shadow-sm border mb-6">
      <div class="flex border-b">
        <button 
          v-for="filter in filters" 
          :key="filter"
          :class="[
            'flex-1 px-6 py-4 text-center font-medium transition-all duration-200',
            activeFilter === filter 
              ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
              : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
          ]"
          @click="changeFilter(filter)"
        >
          {{ filterLabels[filter] }}
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"/>
      <p class="text-gray-500">Memuat riwayat aktivitas Anda...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
      <div class="flex items-center">
        <span class="text-red-500 mr-2">⚠️</span>
        <p class="font-medium">Terjadi kesalahan saat memuat riwayat aktivitas.</p>
      </div>
      <button 
        class="mt-3 text-blue-600 hover:text-blue-700 font-medium underline" 
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