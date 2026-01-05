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

// Pagination states
const currentPage = ref<number>(1);
const pageSize = 10;

// Fetch categories from Supabase
const fetchCategories = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('category_expert')
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

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(filteredExperts.value.length / pageSize);
});

const paginatedExperts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredExperts.value.slice(startIndex, endIndex);
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
      experts.value = (data || []) as unknown as Expert[];
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
  currentPage.value = 1; // Reset pagination ketika category berubah
};

// Watcher untuk reset page ketika kategori berubah
watch(selectedCategory, () => {
  currentPage.value = 1;
});

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
  <div class="min-h-screen  py-8 md:py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div class="flex items-center gap-4">
          <UButton
            to="/discussions"
            color="success"
            variant="ghost"
            icon="i-lucide-arrow-left"
            size="lg"
            aria-label="Kembali ke Diskusi"
            class="rounded-full"
          />
          <div>
            <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Diskusi Pakar
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Konsultasi dengan pakar pertanian berpengalaman
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
              name="i-lucide-lightbulb" 
              class="w-6 h-6 text-green-600 dark:text-green-400"
            />
            <p class="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium">
              Diskusikan permasalahan pertanian Anda dengan pakar berpengalaman dan dapatkan saran profesional untuk meningkatkan hasil panen Anda.
            </p>
          </div>
        </template>

        <!-- Loading state -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <UIcon 
            name="i-lucide-loader" 
            class="w-12 h-12 text-green-600 dark:text-green-400 animate-spin mb-4"
          />
          <p class="text-gray-600 dark:text-gray-400">Memuat data pakar...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
          <UAlert
            title="Terjadi Kesalahan"
            description="Gagal memuat data pakar. Silakan coba lagi."
            color="error"
            icon="i-lucide-alert-circle"
            class="mb-4 max-w-md"
          />
          <UButton
            color="success"
            @click="fetchExperts"
            icon="i-lucide-refresh-cw"
          >
            Coba Lagi
          </UButton>
        </div>

        <!-- Content -->
        <div v-else class="space-y-8">
          <!-- Category selection -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon 
                name="i-lucide-tag" 
                class="w-5 h-5 text-green-600 dark:text-green-400"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Pilih Kategori</h2>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <UButton
                v-for="category in categories"
                :key="category"
                :color="selectedCategory === category ? 'success' : 'neutral'"
                :variant="selectedCategory === category ? 'solid' : 'outline'"
                class="text-center"
                @click="selectCategory(category)"
              >
                {{ category }}
              </UButton>
            </div>
          </div>

          <!-- Experts based on selected category -->
          <div>
            <div class="flex items-center gap-2 mb-6">
              <UIcon 
                name="i-lucide-users" 
                class="w-5 h-5 text-green-600 dark:text-green-400"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Pakar {{ selectedCategory }}
                <UBadge color="success" variant="soft" class="ml-2">
                  {{ filteredExperts.length }}
                </UBadge>
              </h2>
            </div>

            <div v-if="filteredExperts.length > 0">
              <!-- Experts grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <UCard
                  v-for="expert in paginatedExperts"
                  :key="expert.id"
                  class="hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  :ui="{ 
                    body: { padding: 'p-4 sm:p-6' }
                  }"
                >
                  <div class="flex flex-col items-center text-center space-y-4">
                    <!-- Avatar -->
                    <div class="relative">
                      <img
                        :src="expert.profiles?.avatar_url || '/profile.png'"
                        :alt="expert.profiles?.full_name || 'Pakar'"
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
                        {{ expert.profiles?.full_name || 'Nama tidak tersedia' }}
                      </h3>
                      <UBadge color="success" variant="subtle">
                        {{ expert.category }}
                      </UBadge>
                      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {{ expert.note || `Ahli dalam bidang ${expert.category.toLowerCase()} yang telah berpengalaman membantu petani.` }}
                      </p>
                    </div>

                    <!-- Button -->
                    <UButton
                      :to="`/discussions/expert/${expert.id}`"
                      color="success"
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
                :total-items="filteredExperts.length"
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
                Tidak ada pakar tersedia untuk kategori
                <span class="font-semibold">{{ selectedCategory }}</span>
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