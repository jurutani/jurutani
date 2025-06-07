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

// Get images array from attachments with proper Supabase bucket access
const images = computed(() => {
  if (!product.value?.attachments || product.value.attachments.trim() === '') {
    return ['/product.png'];
  }

  try {
    const attachmentsData = JSON.parse(product.value.attachments);
    const imageUrls = [];

    // Handle single image
    if (attachmentsData.url_image) {
      const imageUrl = attachmentsData.url_image.trim();
      if (imageUrl.startsWith('http')) {
        imageUrls.push(imageUrl);
      } else {
        const { data } = supabase.storage
          .from('markets-attachments')
          .getPublicUrl(imageUrl);
        imageUrls.push(data?.publicUrl || '/product.png');
      }
    }

    // Handle multiple images array
    if (attachmentsData.images && Array.isArray(attachmentsData.images)) {
      attachmentsData.images.forEach(img => {
        if (typeof img === 'string') {
          if (img.startsWith('http')) {
            imageUrls.push(img);
          } else {
            const { data } = supabase.storage
              .from('markets-attachments')
              .getPublicUrl(img);
            imageUrls.push(data?.publicUrl || '/product.png');
          }
        }
      });
    }

    return imageUrls.length > 0 ? imageUrls : ['/product.png'];
  } catch (error) {
    console.error('Error parsing attachments JSON:', error);
    return ['/product.png'];
  }
});

// Category badge class with improved styling
const categoryClass = computed(() => {
  if (!product.value?.category) return '';
  
  const baseClass = 'text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border';
  
  switch (product.value.category) {
    case 'Hasil Pertanian':
      return `${baseClass} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800`;
    case 'Alat Pertanian':
      return `${baseClass} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800`;
    case 'Pupuk':
      return `${baseClass} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800`;
    default:
      return `${baseClass} bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700`;
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
    // Pesan yang mau dikirim
  const message = 'Saya ingin menanyakan produk anda';
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
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
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-6 max-w-7xl">
      <!-- Back Button -->
       <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
              <button 
                class="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                @click="goBack"
              >
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
                <span class="font-medium">Kembali ke Market</span>
              </button>
              
              <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
                <UIcon name="i-heroicons-newspaper" class="w-5 h-5" />
                <span class="font-semibold">JuruTani Marketplace</span>
              </div>
            </div>
          </div>
        </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-96">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800"/>
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"/>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="max-w-md mx-auto">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl shadow-sm">
          <div class="flex items-center mb-3">
            <svg class="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="font-medium">{{ error.message || 'Terjadi kesalahan saat memuat produk.' }}</p>
          </div>
          <button 
            class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium" 
            @click="fetchProduct"
          >
            Coba Lagi
          </button>
        </div>
      </div>
      
      <!-- Product Details -->
      <div v-else-if="product" class="bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <!-- Left Column - Images -->
          <div class="relative bg-gray-50 dark:bg-gray-700 p-6">
            <!-- Main Image with Navigation -->
            <div class="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm h-96 lg:h-[500px]">
              <img 
                :src="images[currentImageIndex]" 
                :alt="product.name" 
                class="w-full h-full object-contain"
                @error="$event.target.src = '/product.png'"
              >
              
              <!-- Image Navigation Buttons -->
              <div v-if="images.length > 1" class="absolute inset-0 flex justify-between items-center pointer-events-none">
                <button 
                  class="pointer-events-auto bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full p-3 m-4 transition-all focus:outline-none shadow-lg backdrop-blur-sm" 
                  @click="prevImage"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  class="pointer-events-auto bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full p-3 m-4 transition-all focus:outline-none shadow-lg backdrop-blur-sm" 
                  @click="nextImage"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              
              <!-- Image counter -->
              <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div class="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {{ currentImageIndex + 1 }} / {{ images.length }}
                </div>
              </div>
            </div>
            
            <!-- Thumbnail Images -->
            <div v-if="images.length > 1" class="mt-4 flex space-x-3 overflow-x-auto pb-2">
              <button 
                v-for="(img, index) in images" 
                :key="index" 
                :class="[
                  'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                  currentImageIndex === index 
                    ? 'border-blue-500 dark:border-blue-400 shadow-md ring-2 ring-blue-200 dark:ring-blue-800' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                ]" 
                @click="currentImageIndex = index"
              >
                <img :src="img" :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover" @error="$event.target.src = '/product.png'">
              </button>
            </div>
          </div>
          
          <!-- Right Column - Product Info -->
          <div class="p-6 lg:p-8">
            <div class="h-full flex flex-col">
              <!-- Product Title & Price -->
              <div class="mb-6">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">{{ product.name }}</h1>
                
                <div class="flex items-baseline mb-4">
                  <span class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ formattedPrice }}</span>
                  <span v-if="product.price_range" class="text-sm text-gray-500 dark:text-gray-400 ml-3">{{ product.price_range }}</span>
                </div>
              </div>
              
              <!-- Description -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Deskripsi Produk
                </h2>
                <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p v-if="product.description" class="whitespace-pre-line">{{ product.description }}</p>
                  <p v-else class="text-gray-500 dark:text-gray-400 italic">Tidak ada deskripsi untuk produk ini.</p>
                </div>
              </div>
              
              <!-- Product Details -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Detail Produk
                </h2>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                  <div v-if="product.weight" class="flex items-center text-sm">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <span class="text-gray-700 dark:text-gray-300"><span class="font-medium">Berat:</span> {{ product.weight }}</span>
                  </div>
                  
                  <div v-if="product.size" class="flex items-center text-sm">
                    <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                    </div>
                    <span class="text-gray-700 dark:text-gray-300"><span class="font-medium">Ukuran:</span> {{ product.size }}</span>
                  </div>
                  
                  <div v-if="product.stock" class="flex items-center text-sm">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <span class="text-gray-700 dark:text-gray-300"><span class="font-medium">Stok:</span> {{ product.stock }}</span>
                  </div>
                  
                  <div v-if="product.created_at" class="flex items-center text-sm">
                    <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span class="text-gray-700 dark:text-gray-300"><span class="font-medium">Dipublikasikan:</span> {{ formatDate(product.created_at) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Seller Info -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informasi Penjual
                </h2>
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="w-14 h-14 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 mr-4 ring-2 ring-gray-200 dark:ring-gray-600">
                    <img 
                      :src="product.profiles?.avatar_url || '/profile.png'" 
                      :alt="product.profiles?.name || product.seller || 'Penjual'" 
                      class="w-full h-full object-cover"
                      @error="$event.target.src = '/profile.png'"
                    >
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100">
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
              <div v-if="hasShopeeLink || hasTokopediaLink || hasTiktokLink" class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <svg class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Tersedia di Marketplace
                </h2>
                <div class="flex flex-wrap gap-3">
                  <a 
                    v-if="hasShopeeLink" 
                    :href="product.links.shopee_link" 
                    target="_blank" 
                    class="inline-flex items-center px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 transition-all transform hover:scale-105 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Shopee
                  </a>
                  
                  <a 
                    v-if="hasTokopediaLink" 
                    :href="product.links.tokopedia_link" 
                    target="_blank" 
                    class="inline-flex items-center px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 transition-all transform hover:scale-105 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Tokopedia
                  </a>
                  
                  <a 
                    v-if="hasTiktokLink" 
                    :href="product.links.tiktok_link" 
                    target="_blank" 
                    class="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all transform hover:scale-105 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.15-1.75V11.5a6.13 6.13 0 004.4 1.37V9.41a4.83 4.83 0 01-1.73.33 4.66 4.66 0 01-3.27-1.39v.08a4.83 4.83 0 104.83 4.83V8.05a8.74 8.74 0 004.52 1.29V6.69z" />
                    </svg>
                    TikTok Shop
                  </a>
                </div>
              </div>
              
              <!-- Contact Button -->
              <div class="mt-auto pt-6">
                <a 
                  :href="whatsappLink" 
                  target="_blank" 
                  class="inline-flex items-center justify-center w-full px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 transition-all transform hover:scale-105 text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.72.043.433-.101.706z"/>
                  </svg>
                  Hubungi Penjual via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for thumbnail images */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-700 rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Image fade in effect */
img {
  @apply transition-opacity duration-300;
}

img[src="/product.png"], img[src="/profile.png"] {
  @apply opacity-75;
}

/* Hover effects */
.group:hover .group-hover\:-translate-x-1 {
  transform: translateX(-0.25rem);
}

/* Focus styles */
button:focus-visible,
a:focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Card hover effect */
.bg-white.dark\:bg-gray-800 {
  @apply transition-shadow duration-300;
}

@media (min-width: 1024px) {
  .bg-white.dark\:bg-gray-800:hover {
    @apply shadow-xl;
  }
}

/* Responsive image container */
@media (max-width: 1023px) {
  .h-96.lg\:h-\[500px\] {
    height: 300px;
  }
}

/* Button press animation */
button:active,
a:active {
  transform: scale(0.98);
}

/* Smooth color transitions for category badges */
.bg-emerald-50,
.bg-blue-50,
.bg-amber-50,
.bg-gray-50 {
  @apply transition-colors duration-200;
}
</style>