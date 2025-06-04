<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();

interface Instructor {
  id: number;
  user_id: string;
  provinces: string;
  district: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface District {
  id: number;
  name: string;
  province: string;
}

// Data
const instructors = ref<Instructor[]>([]);
const districts = ref<District[]>([]);
const loading = ref(true);
const error = ref(null);

// Filter states
const selectedDistrict = ref<string>('');
const searchQuery = ref<string>('');

// Computed properties
const availableDistricts = computed(() => {
  // Get all unique districts with their province info
  const districtOptions = districts.value.map(d => ({
    value: d.name,
    label: `${d.name}, ${d.province}`,
    province: d.province
  }));
  
  // Sort by province first, then by district name
  return districtOptions.sort((a, b) => {
    if (a.province !== b.province) {
      return a.province.localeCompare(b.province);
    }
    return a.value.localeCompare(b.value);
  });
});

const filteredInstructors = computed(() => {
  return instructors.value.filter(instructor => {
    // District filter - only filter by district
    const matchesDistrict = !selectedDistrict.value || instructor.district === selectedDistrict.value;
    
    // Search filter
    const matchesSearch = !searchQuery.value || 
      instructor.profiles?.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    return matchesDistrict && matchesSearch;
  });
});

// Fetch districts for filter options
const fetchDistricts = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('districts')
      .select('id, name, province')
      .order('province', { ascending: true })
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Error fetching districts:', fetchError);
      error.value = fetchError;
    } else {
      districts.value = data || [];
    }
  } catch (err) {
    console.error('Error fetching districts:', err);
    error.value = err;
  }
};

// Fetch instructors with profile data
const fetchInstructors = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: fetchError } = await supabase
      .from('instructors')
      .select(`
        id,
        user_id,
        provinces,
        district,
        profiles!inner (
          full_name,
          avatar_url
        )
      `)
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('Error fetching instructors:', fetchError);
      error.value = fetchError;
    } else {
      instructors.value = data || [];
    }
  } catch (err) {
    console.error('Error fetching instructors:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// No watchers needed since we only have district filter

// Clear search function
const clearSearch = () => {
  searchQuery.value = '';
};

// Initial data fetch
onMounted(async () => {
  await fetchDistricts();
  await fetchInstructors();
});

// Head meta
useHead({
  title: 'Diskusi Penyuluh - JuruTani',
  meta: [
    { 
      name: 'description', 
      content: 'Diskusikan masalah pertanian Anda dengan penyuluh berpengalaman'
    }
  ]
});
</script>

<template>
  <div class="instructor-discussions">
    <div class="container mx-auto py-10 px-4">
      <div class="flex items-center mb-8">
        <NuxtLink to="/discussions" class="mr-4 text-green-600 hover:text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-green-700">Diskusi Penyuluh</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-lg text-gray-700 mb-6">
          Diskusikan permasalahan pertanian Anda dengan penyuluh berpengalaman dan dapatkan saran profesional untuk meningkatkan hasil panen Anda.
        </p>
        
        <!-- Search input -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Cari Penyuluh</h2>
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari nama penyuluh..."
              class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
            <button 
              v-if="searchQuery" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="clearSearch"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"/>
          <p class="mt-2 text-gray-600">Memuat data penyuluh...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8 text-red-600">
          <p>Terjadi kesalahan saat memuat data penyuluh.</p>
          <button 
            class="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" 
            @click="fetchInstructors"
          >
            Coba Lagi
          </button>
        </div>

        <!-- Filters -->
        <div v-else class="mb-6">
          <div class="max-w-md">
            <h2 class="text-xl font-semibold mb-4">Pilih Kabupaten/Kota</h2>
            <select
              v-model="selectedDistrict"
              class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Semua Kabupaten/Kota</option>
              <option v-for="district in availableDistricts" :key="district.value" :value="district.value">
                {{ district.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Instructors list -->
        <div v-if="!loading && !error">
          <h2 class="text-xl font-semibold mb-4">
            Penyuluh
            <span v-if="selectedDistrict"> 
              di {{ selectedDistrict }}
            </span>
            <span v-if="searchQuery" class="text-green-600"> - "{{ searchQuery }}"</span>
            <span class="text-sm font-normal text-gray-500">({{ filteredInstructors.length }} penyuluh)</span>
          </h2>

          <div v-if="filteredInstructors.length > 0" class="space-y-4">
            <div 
              v-for="instructor in filteredInstructors" 
              :key="instructor.id"
              class="flex items-start p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <img 
                :src="instructor.profiles?.avatar_url || '/placeholder.png'" 
                :alt="instructor.profiles?.full_name || 'Penyuluh'"
                class="w-16 h-16 rounded-full mr-4 object-cover"
                @error="$event.target.src = '/placeholder.png'"
              >
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">
                  {{ instructor.profiles?.full_name || 'Nama tidak tersedia' }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ instructor.district }}, {{ instructor.provinces }}
                </p>
                <div class="mt-3">
                  <NuxtLink
                    :to="`/discussions/instructor/${instructor.id}`"
                    class="text-sm py-1.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    >
                    Mulai Diskusi
                    </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p v-if="searchQuery">
              Tidak ada penyuluh dengan nama "{{ searchQuery }}"
              <span v-if="selectedDistrict"> di {{ selectedDistrict }}</span>.
            </p>
            <p v-else>
              Tidak ada penyuluh tersedia
              <span v-if="selectedDistrict"> di {{ selectedDistrict }}</span>
              saat ini.
            </p>
          </div>
        </div>       
      </div>
    </div>
  </div>
</template>

<style scoped>
.instructor-discussions {
  min-height: 100vh;
  background-color: #f0fdf4;
}
</style>