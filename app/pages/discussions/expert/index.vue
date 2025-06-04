<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();

interface Expert {
  id: number;
  user_id: string;
  category: string;
  note: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

// Data
const experts = ref<Expert[]>([]);
const loading = ref(true);
const error = ref(null);

// Filter states
const selectedCategory = ref<string>('Budidaya');

// Available categories
const categories = [
  'Budidaya',
  'Pasca Panen',
  'Pemasaran',
  'Agroteknologi',
  'Peternakan'
];

// Computed properties
const filteredExperts = computed(() => {
  return experts.value.filter(expert => expert.category === selectedCategory.value);
});

// Fetch experts with profile data
const fetchExperts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: fetchError } = await supabase
      .from('experts')
      .select(`
        id,
        user_id,
        category,
        note,
        profiles!inner (
          full_name,
          avatar_url
        )
      `)
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('Error fetching experts:', fetchError);
      error.value = fetchError;
    } else {
      experts.value = data || [];
    }
  } catch (err) {
    console.error('Error fetching experts:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Select category function
const selectCategory = (category: string) => {
  selectedCategory.value = category;
};

// Popular topics by category
const getPopularTopics = (category: string) => {
  const topics = {
    'Budidaya': [
      'Teknik pengendalian hama pada tanaman padi organik',
      'Strategi irigasi hemat air untuk musim kemarau'
    ],
    'Pasca Panen': [
      'Metode penyimpanan hasil panen agar tahan lama',
      'Teknologi pengeringan gabah yang efisien'
    ],
    'Pemasaran': [
      'Strategi pemasaran digital untuk produk pertanian',
      'Cara mendapatkan sertifikasi organik untuk produk pertanian'
    ],
    'Agroteknologi': [
      'Implementasi IoT untuk monitoring tanaman',
      'Sistem hidroponik otomatis berbasis mikrokontroler'
    ],
    'Peternakan': [
      'Manajemen kesehatan ternak sapi perah',
      'Formulasi pakan ternak berkualitas dengan bahan lokal'
    ]
  };
  
  return topics[category] || [];
};

// Initial data fetch
onMounted(async () => {
  await fetchExperts();
});

// Head meta
useHead({
  title: 'Diskusi Pakar - JuruTani',
  meta: [
    { 
      name: 'description', 
      content: 'Diskusikan masalah pertanian Anda dengan Pakar berpengalaman'
    }
  ]
});
</script>

<template>
  <div class="expert-discussions">
    <div class="container mx-auto py-10 px-4">
      <div class="flex items-center mb-8">
        <NuxtLink to="/discussions" class="mr-4 text-green-600 hover:text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-green-700">Diskusi Pakar</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-lg text-gray-700 mb-6">
          Diskusikan permasalahan pertanian Anda dengan Pakar berpengalaman dan dapatkan saran profesional untuk meningkatkan hasil panen Anda.
        </p>
        
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"/>
          <p class="mt-2 text-gray-600">Memuat data pakar...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8 text-red-600">
          <p>Terjadi kesalahan saat memuat data pakar.</p>
          <button 
            class="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" 
            @click="fetchExperts"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Category selection -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Pilih Kategori</h2>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
              <button 
                v-for="category in categories" 
                :key="category"
                :class="[
                  'py-3 px-4 rounded-md transition-all text-center',
                  selectedCategory === category 
                    ? 'bg-green-600 text-white font-medium shadow-md' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                ]"
                @click="selectCategory(category)"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <!-- Experts based on selected category -->
          <div>
            <h2 class="text-xl font-semibold mb-4">
              Pakar {{ selectedCategory }}
              <span class="text-sm font-normal text-gray-500">({{ filteredExperts.length }} pakar)</span>
            </h2>
            <div v-if="filteredExperts.length > 0" class="space-y-4">
              <div 
                v-for="expert in filteredExperts" 
                :key="expert.id"
                class="flex items-start p-4 border rounded-lg hover:shadow-md transition-all"
              >
                <img 
                  :src="expert.profiles?.avatar_url || '/profile.png'" 
                  :alt="expert.profiles?.full_name || 'Pakar'"
                  class="w-16 h-16 rounded-full mr-4 object-cover"
                  @error="$event.target.src = '/profile.png'"
                >
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">
                    {{ expert.profiles?.full_name || 'Nama tidak tersedia' }}
                  </h3>
                  <p class="text-sm text-gray-600">Pakar {{ expert.category }}</p>
                  <p class="text-sm text-gray-500 mt-1 mb-3">
                    {{ expert.note || `Ahli dalam bidang ${expert.category.toLowerCase()} yang telah berpengalaman membantu petani menyelesaikan masalah pertanian.` }}
                  </p>
                    <NuxtLink
                    :to="`/discussions/expert/${expert.id}`"
                    class="text-sm py-1.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    >
                    Mulai Diskusi
                    </NuxtLink>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p>Tidak ada pakar tersedia untuk kategori {{ selectedCategory }} saat ini.</p>
            </div>
          </div>

          <!-- Popular topics -->
          <div class="mt-8 pt-6 border-t">
            <h2 class="text-xl font-semibold mb-4">Topik Diskusi Populer - {{ selectedCategory }}</h2>
            <ul class="space-y-3">
              <li 
                v-for="(topic, index) in getPopularTopics(selectedCategory)" 
                :key="index"
                class="flex items-center"
              >
                <div class="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span class="text-gray-800">{{ topic }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expert-discussions {
  min-height: 100vh;
  background-color: #f0fdf4;
}
</style>