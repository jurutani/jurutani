<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { toastStore } from '~/composables/useJuruTaniToast';
import { formatDate } from '~/utils/dateFormatter';

const { supabase } = useSupabase();

const currentUserId = ref(null);
const historyItems = ref([]);
const loading = ref(true);
const error = ref(null);

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// Filter
const activeFilter = ref('all');
const filters = ['all', 'news', 'markets', 'updates'];
const filterLabels = {
  all: 'Semua',
  news: 'Berita',
  markets: 'Pasar',
  updates: 'Update'
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

// Fetch history data
const fetchHistoryData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Get current user ID if not already fetched
    if (!currentUserId.value) {
      currentUserId.value = await fetchCurrentUser();
      if (!currentUserId.value) {
        loading.value = false;
        return;
      }
    }
    
    // Calculate pagination offsets
    const from = (currentPage.value - 1) * pageSize.value;
    const to = from + pageSize.value - 1;
    
    let allData = [];
    
    // Fetch news data
    if (activeFilter.value === 'all' || activeFilter.value === 'news') {
      const { data: newsData, error: newsError, count: newsCount } = await supabase
        .from('news')
        .select('id, title, created_at, image', { count: 'exact' })
        .eq('user_id', currentUserId.value)
        .order('created_at', { ascending: false });
      
      if (newsError) {
        console.error('Error fetching news:', newsError);
      } else if (newsData) {
        const formattedNews = newsData.map(item => ({
          ...item,
          type: 'news',
          typeLabel: 'Berita',
          route: `/news/${item.id}`
        }));
        allData = [...allData, ...formattedNews];
        if (activeFilter.value === 'news') {
          totalItems.value = newsCount || 0;
        }
      }
    }
    
    // Fetch markets data
    if (activeFilter.value === 'all' || activeFilter.value === 'markets') {
      const { data: marketsData, error: marketsError, count: marketsCount } = await supabase
        .from('markets')
        .select('id, title, created_at, image', { count: 'exact' })
        .eq('user_id', currentUserId.value)
        .order('created_at', { ascending: false });
      
      if (marketsError) {
        console.error('Error fetching markets:', marketsError);
      } else if (marketsData) {
        const formattedMarkets = marketsData.map(item => ({
          ...item,
          type: 'markets',
          typeLabel: 'Pasar',
          route: `/markets/${item.id}`
        }));
        allData = [...allData, ...formattedMarkets];
        if (activeFilter.value === 'markets') {
          totalItems.value = marketsCount || 0;
        }
      }
    }
    
    // Fetch updates data
    if (activeFilter.value === 'all' || activeFilter.value === 'updates') {
      const { data: updatesData, error: updatesError, count: updatesCount } = await supabase
        .from('updates')
        .select('id, title, created_at, image', { count: 'exact' })
        .eq('user_id', currentUserId.value)
        .order('created_at', { ascending: false });
      
      if (updatesError) {
        console.error('Error fetching updates:', updatesError);
      } else if (updatesData) {
        const formattedUpdates = updatesData.map(item => ({
          ...item,
          type: 'updates',
          typeLabel: 'Update',
          route: `/updates/${item.id}`
        }));
        allData = [...allData, ...formattedUpdates];
        if (activeFilter.value === 'updates') {
          totalItems.value = updatesCount || 0;
        }
      }
    }
    
    // Sort by date and apply pagination
    if (activeFilter.value === 'all') {
      allData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      totalItems.value = allData.length;
      historyItems.value = allData.slice(from, to + 1);
    } else {
      historyItems.value = allData.slice(from, Math.min(to + 1, allData.length));
    }
    
  } catch (err) {
    console.error('Exception fetching history data:', err);
    error.value = err;
    toastStore.error('Terjadi kesalahan saat memuat riwayat aktivitas.');
  } finally {
    loading.value = false;
  }
};

// Change filter
const changeFilter = (filter) => {
  activeFilter.value = filter;
  currentPage.value = 1;
  fetchHistoryData();
};

// Change page
const changePage = (page) => {
  currentPage.value = page;
  fetchHistoryData();
};

onMounted(() => {
  fetchHistoryData();
});
</script>

<template>
  <div class="history-page container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-center mb-8">Riwayat Aktivitas</h1>
    
    <!-- Filter Tabs -->
    <div class="flex overflow-x-auto mb-6 pb-2">
      <button 
        v-for="filter in filters" 
        :key="filter"
        :class="[
          'px-4 py-2 mx-1 rounded-full whitespace-nowrap',
          activeFilter === filter 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
        @click="changeFilter(filter)"
      >
        {{ filterLabels[filter] }}
      </button>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Memuat riwayat aktivitas Anda...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Terjadi kesalahan saat memuat riwayat aktivitas.</p>
      <button class="mt-2 text-blue-600 hover:underline" @click="fetchHistoryData">
        Coba lagi
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="historyItems.length === 0" class="text-center py-10">
      <p class="text-gray-500">Belum ada aktivitas untuk ditampilkan.</p>
      <p v-if="activeFilter !== 'all'" class="text-gray-500 mt-2">
        Coba pilih kategori lain atau lihat semua aktivitas.
      </p>
    </div>
    
    <!-- History Items -->
    <div v-else class="space-y-4">
      <nuxt-link 
        v-for="item in historyItems" 
        :key="item.type + '-' + item.id"
        :to="item.route"
        class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center p-4">
          <!-- Image -->
          <div class="w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden flex-shrink-0 mr-4">
            <img 
              :src="item.image || '/img/default-placeholder.png'" 
              :alt="item.title"
              class="w-full h-full object-cover"
            >
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center mb-1">
              <span 
                :class="[
                  'text-xs px-2 py-1 rounded-full mr-2',
                  item.type === 'news' ? 'bg-blue-100 text-blue-800' :
                  item.type === 'markets' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                ]"
              >
                {{ item.typeLabel }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatDate(item.created_at) }}
              </span>
            </div>
            <h3 class="font-medium text-gray-900 truncate">{{ item.title }}</h3>
            <div class="flex items-center text-sm text-blue-600 mt-1">
              <span>Lihat detail</span>
              <span class="ml-1">→</span>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
    
    <!-- Pagination -->
    <div 
      v-if="!loading && historyItems.length > 0" 
      class="flex justify-center mt-8"
    >
      <nav class="inline-flex">
        <button
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-1 rounded-l border',
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
          @click="changePage(currentPage - 1)"
        >
          Sebelumnya
        </button>
        
        <div class="flex">
          <template v-for="page in totalPages" :key="page">
            <button
              v-if="
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              "
              :class="[
                'px-3 py-1 border-t border-b',
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            
            <span
              v-else-if="page === currentPage - 2 || page === currentPage + 2"
              class="px-3 py-1 border-t border-b bg-white text-gray-700"
            >
              ...
            </span>
          </template>
        </div>
        
        <button
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-1 rounded-r border',
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
          @click="changePage(currentPage + 1)"
        >
          Selanjutnya
        </button>
      </nav>
    </div>
  </div>
</template>