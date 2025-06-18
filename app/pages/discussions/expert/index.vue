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
const categories = ref<string[]>([]);

// Fetch categories from Supabase
const fetchCategories = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('category-experts')
      .select('name')
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Error fetching categories:', fetchError);
      categories.value = [];
    } else {
      categories.value = (data || []).map((item: { name: string }) => item.name);
    }
  } catch (err) {
    console.error('Error fetching categories:', err);
    categories.value = [];
  }
};

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

// Initial data fetch
onMounted(async () => {
  await fetchExperts();
  await fetchCategories();
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
      <div class="flex items-center mb-10 gap-4">
        <NuxtLink 
          to="/discussions" 
          class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
          aria-label="Kembali ke Diskusi"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        
        <h1 class="text-3xl font-bold text-green-700 leading-tight flex items-center my-auto">
          Diskusi Pakar
        </h1>
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
            <h2 class="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">Pilih Kategori</h2>
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
            <h2 class="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expert-discussions {
  min-height: 100vh;
}
</style>