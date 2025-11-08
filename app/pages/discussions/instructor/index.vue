<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useSupabase } from '~/composables/useSupabase';

const { supabase } = useSupabase();
const colorMode = useColorMode();

interface Instructor {
  id: number;
  user_id: string;
  provinces: string;
  district: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
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

// Pagination states
const currentPage = ref<number>(1);
const pageSize = 10;

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

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(filteredInstructors.value.length / pageSize);
});

const paginatedInstructors = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredInstructors.value.slice(startIndex, endIndex);
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
      instructors.value = (data || []) as unknown as Instructor[];
    }
  } catch (err) {
    console.error('Error fetching instructors:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Watchers untuk reset page ketika filter berubah
watch([selectedDistrict, searchQuery], () => {
  currentPage.value = 1;
});

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
  <div class="min-h-screen py-8 md:py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div class="flex items-center gap-4">
          <UButton
            to="/discussions"
            color="green"
            variant="ghost"
            icon="i-lucide-arrow-left"
            size="lg"
            aria-label="Kembali ke Diskusi"
            class="rounded-full"
          />
          <div>
            <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Diskusi Penyuluh
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Konsultasi dengan penyuluh pertanian berpengalaman
            </p>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <UCard 
        class="mb-8 shadow-xl"
        :ui="{ 
          body: { padding: 'p-6 sm:p-8' },
          header: { padding: 'px-6 sm:px-8 py-4 sm:py-6' }
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon 
              name="i-lucide-users" 
              class="w-6 h-6 text-green-600 dark:text-green-400"
            />
            <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium">
              Diskusikan permasalahan pertanian Anda dengan penyuluh berpengalaman dan dapatkan saran profesional untuk meningkatkan hasil panen Anda.
            </p>
          </div>
        </template>

        <!-- Loading state -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <UIcon 
            name="i-lucide-loader" 
            class="w-12 h-12 text-green-600 dark:text-green-400 animate-spin mb-4"
          />
          <p class="text-gray-600 dark:text-gray-400">Memuat data penyuluh...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
          <UAlert
            title="Terjadi Kesalahan"
            description="Gagal memuat data penyuluh. Silakan coba lagi."
            color="red"
            icon="i-lucide-alert-circle"
            class="mb-4 max-w-md"
          />
          <UButton
            color="green"
            @click="fetchInstructors"
            icon="i-lucide-refresh-cw"
          >
            Coba Lagi
          </UButton>
        </div>

        <!-- Content -->
        <div v-else class="space-y-8">
          <!-- Search input -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <!-- Left: Search -->
            <div>
              <div class="flex items-center gap-2 mb-4">
                <UIcon 
                  name="i-lucide-search" 
                  class="w-5 h-5 text-green-600 dark:text-green-400"
                />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Cari Penyuluh</h2>
              </div>
              <div class="relative">
                <UInput
                  v-model="searchQuery"
                  type="text"
                  placeholder="Cari nama penyuluh..."
                  icon="i-lucide-search"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Right: District select -->
            <div>
              <div class="flex items-center gap-2 mb-4">
                <UIcon 
                  name="i-lucide-map-pin" 
                  class="w-5 h-5 text-green-600 dark:text-green-400"
                />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Pilih Kabupaten/Kota</h2>
              </div>
              <div>
                <USelect
                  v-model="selectedDistrict"
                  :options="availableDistricts"
                  option-attribute="label"
                  value-attribute="value"
                  placeholder="Semua Kabupaten/Kota"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Instructors list -->
          <div>
            <div class="flex items-center gap-2 mb-6">
              <UIcon 
                name="i-lucide-briefcase" 
                class="w-5 h-5 text-green-600 dark:text-green-400"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Penyuluh
                <span v-if="selectedDistrict" class="text-green-600"> di {{ selectedDistrict }}</span>
                <UBadge color="green" variant="soft" class="ml-2">
                  {{ filteredInstructors.length }}
                </UBadge>
              </h2>
            </div>

            <div v-if="filteredInstructors.length > 0">
              <!-- Instructors grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <UCard
                  v-for="instructor in paginatedInstructors"
                  :key="instructor.id"
                  class="hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  :ui="{ 
                    body: { padding: 'p-4 sm:p-6' }
                  }"
                >
                  <div class="flex flex-col items-center text-center space-y-4">
                    <!-- Avatar -->
                    <div class="relative">
                      <img
                        :src="instructor.profiles?.avatar_url || '/profile.png'"
                        :alt="instructor.profiles?.full_name || 'Penyuluh'"
                        class="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-green-100 dark:border-green-900"
                      />
                      <div class="absolute -bottom-2 -right-2 bg-green-500 dark:bg-green-600 w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                        <UIcon 
                          name="i-lucide-check" 
                          class="w-3 h-3 text-white"
                        />
                      </div>
                    </div>

                    <!-- Info -->
                    <div class="space-y-2 flex-1">
                      <h3 class="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
                        {{ instructor.profiles?.full_name || 'Nama tidak tersedia' }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ instructor.district }}, {{ instructor.provinces }}
                      </p>
                    </div>

                    <!-- Button -->
                    <UButton
                      :to="`/discussions/instructor/${instructor.id}`"
                      color="green"
                      size="md"
                      class="w-full"
                      icon="i-lucide-message-circle"
                    >
                      Mulai Diskusi
                    </UButton>
                  </div>
                </UCard>
              </div>

              <!-- Pagination -->
              <AppPagination
                :current-page="currentPage"
                :total-pages="totalPages"
                :total-items="filteredInstructors.length"
                :page-size="pageSize"
                :show-page-info="true"
                :show-first-last="true"
                @update:page="currentPage = $event"
              />
            </div>

            <!-- Empty state -->
            <div v-else class="flex flex-col items-center justify-center py-16">
              <UIcon 
                name="i-lucide-inbox" 
                class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
              />
              <p class="text-gray-600 dark:text-gray-400 text-center max-w-sm">
                Tidak ada penyuluh tersedia
                <span v-if="selectedDistrict"> di {{ selectedDistrict }}</span>
                <span v-if="searchQuery"> dengan nama "{{ searchQuery }}"</span>
                saat ini.
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
/* Smooth animations */
:deep(.u-card) {
  transition: all 0.3s ease;
}
</style>