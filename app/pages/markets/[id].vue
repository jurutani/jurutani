<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { supabase } = useSupabase();

// Product data
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const images = ref([]);
const currentImageIndex = ref(0);

// Format price as Indonesian currency
const formattedPrice = computed(() => {
  if (!product.value?.price) return 'Harga tidak tersedia';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(product.value.price);
});

// Get images array from attachments
const setupImages = () => {
  if (!product.value?.attachments || !Array.isArray(product.value.attachments) || product.value.attachments.length === 0) {
    images.value = ['/product.png']; // Default placeholder
    return;
  }
  
  images.value = product.value.attachments;
};

// Category badge class
const categoryClass = computed(() => {
  if (!product.value?.category) return '';
  
  const baseClass = 'text-sm font-medium px-3 py-1.5 rounded-full';
  
  switch (product.value.category) {
    case 'Hasil Pertanian':
      return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case 'Alat Pertanian':
      return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    case 'Pupuk':
      return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200`;
  }
});

// Check if e-commerce links exist
const hasShopeeLink = computed(() => product.value?.links?.shopee_link);
const hasTokopediaLink = computed(() => product.value?.links?.tokopedia_link);
const hasTiktokLink = computed(() => product.value?.links?.tiktok_link);

// Format WhatsApp link
const whatsappLink = computed(() => {
  if (!product.value?.contact_seller) return '#';
  const phone = product.value.contact_seller.replace(/\D/g, '');
  return `https://wa.me/${phone}`;
});

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Fetch product by ID
const fetchProduct = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: fetchError } = await supabase
      .from('markets')
      .select(`
        *,
        profiles (
          *
        )
      `)
      .eq('id', route.params.id)
      .is('deleted_at', null)
      .is('archived_at', null)
      .single();
    
    if (fetchError) {
      console.error('[Supabase Fetch Error]', fetchError);
      error.value = fetchError;
      return;
    }
    
    if (!data) {
      error.value = { message: 'Produk tidak ditemukan' };
      return;
    }
    
    console.log('[Product Detail Fetched]', data);
    product.value = data;
    setupImages();
    
  } catch (err) {
    console.error('[FetchProduct Error]', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

// Navigate through images
const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = images.value.length - 1;
  }
};

// Go back to markets page
const goBack = () => {
  router.push('/markets');
};

// Initial fetch
onMounted(() => {
  fetchProduct();
});
</script>

<template>
  <div class="product-detail-page container mx-auto px-4 py-8">
    <!-- Back Button -->
    <button 
      class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors" 
      @click="goBack"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Kembali ke Pasar Tani
    </button>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"/>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded my-8">
      <p>{{ error.message || 'Terjadi kesalahan saat memuat produk.' }}</p>
      <button 
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" 
        @click="fetchProduct"
      >
        Coba Lagi
      </button>
    </div>
    
    <!-- Product Details -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <!-- Left Column - Images -->
      <div class="product-images">
        <!-- Main Image with Navigation -->
        <div class="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-md h-96">
          <img 
            :src="images[currentImageIndex]" 
            :alt="product.name" 
            class="w-full h-full object-contain"
          >
          
          <!-- Image Navigation Buttons -->
          <div v-if="images.length > 1" class="absolute inset-0 flex justify-between items-center">
            <button 
              class="bg-black bg-opacity-30 dark:bg-opacity-50 hover:bg-opacity-50 dark:hover:bg-opacity-70 text-white rounded-full p-2 m-4 transition-all focus:outline-none" 
              @click="prevImage"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              class="bg-black bg-opacity-30 dark:bg-opacity-50 hover:bg-opacity-50 dark:hover:bg-opacity-70 text-white rounded-full p-2 m-4 transition-all focus:outline-none" 
              @click="nextImage"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <!-- Category badge -->
          <div class="absolute top-4 right-4">
            <span :class="categoryClass">
              {{ product.category }}
            </span>
          </div>
        </div>
        
        <!-- Thumbnail Images -->
        <div v-if="images.length > 1" class="mt-4 flex space-x-2 overflow-x-auto pb-2">
          <button 
            v-for="(img, index) in images" 
            :key="index" 
            :class="[
              'w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
              currentImageIndex === index 
                ? 'border-blue-500 dark:border-blue-400 shadow-md' 
                : 'border-gray-200 dark:border-gray-700'
            ]" 
            @click="currentImageIndex = index"
          >
            <img :src="img" :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover">
          </button>
        </div>
      </div>
      
      <!-- Right Column - Product Info -->
      <div class="product-info">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ product.name }}</h1>
        
        <!-- Price Section -->
        <div class="flex items-baseline mb-6">
          <span class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formattedPrice }}</span>
          <span v-if="product.price_range" class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{ product.price_range }}</span>
        </div>
        
        <!-- Description -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Deskripsi Produk</h2>
          <div class="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
            <p v-if="product.description">{{ product.description }}</p>
            <p v-else class="text-gray-500 dark:text-gray-400 italic">Tidak ada deskripsi untuk produk ini.</p>
          </div>
        </div>
        
        <!-- Product Details -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Detail Produk</h2>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="product.weight" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span class="text-gray-700 dark:text-gray-300">Berat: {{ product.weight }}</span>
              </div>
              
              <div v-if="product.size" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
                <span class="text-gray-700 dark:text-gray-300">Ukuran: {{ product.size }}</span>
              </div>
              
              <div v-if="product.created_at" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-700 dark:text-gray-300">Dipublikasikan: {{ formatDate(product.created_at) }}</span>
              </div>
              
              <div v-if="product.stock" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span class="text-gray-700 dark:text-gray-300">Stok: {{ product.stock }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Seller Info -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Informasi Penjual</h2>
          <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4">
              <img 
                :src="product.profiles?.avatar_url || '/default-avatar.png'" 
                :alt="product.profiles?.name || product.seller || 'Penjual'" 
                class="w-full h-full object-cover"
              >
            </div>
            <div>
              <h3 class="text-sm text-gray-900 dark:text-gray-100">
                {{ product.profiles?.full_name || product.seller || 'Penjual' }}
              </h3>
              <p v-if="product.location" class="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ product.location }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- E-commerce Links -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Beli di Marketplace</h2>
          <div class="flex flex-wrap gap-3">
            <a 
              v-if="hasShopeeLink" 
              :href="product.links.shopee_link" 
              target="_blank" 
              class="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Beli di Shopee
            </a>
            
            <a 
              v-if="hasTokopediaLink" 
              :href="product.links.tokopedia_link" 
              target="_blank" 
              class="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Beli di Tokopedia
            </a>
            
            <a 
              v-if="hasTiktokLink" 
              :href="product.links.tiktok_link" 
              target="_blank" 
              class="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.15-1.75V11.5a6.13 6.13 0 004.4 1.37V9.41a4.83 4.83 0 01-1.73.33 4.66 4.66 0 01-3.27-1.39v.08a4.83 4.83 0 104.83 4.83V8.05a8.74 8.74 0 004.52 1.29V6.69z" />
              </svg>
              Beli di TikTok Shop
            </a>
          </div>
        </div>
        
        <!-- Contact Button -->
        <div class="mt-8">
          <a 
            :href="whatsappLink" 
            target="_blank" 
            class="inline-flex items-center justify-center w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 transition-colors text-lg font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.72.043.433-.101.706z"/>
            </svg>
            Hubungi Penjual via WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for thumbnail images */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>