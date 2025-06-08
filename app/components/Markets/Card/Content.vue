<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSupabase } from '~/composables/useSupabase'
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// Image states
const imageError = ref(false);
const imageLoading = ref(true);

// Supabase client import (pastikan ini tersedia di komponen)
const supabase = useSupabase();

// Format price as Indonesian currency
const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(props.product.price || 0);
});

// Get price range display
const priceRange = computed(() => {
  if (!props.product.price_range) return '';
  return props.product.price_range;
});

// Get the first image from attachments JSON field with Supabase support
const mainImage = computed(() => {
  if (!props.product.attachments || props.product.attachments.trim() === '') {
    return '/product.png';
  }

  let imageUrl = '';

  try {
    const attachmentsData = JSON.parse(props.product.attachments);

    if (attachmentsData && attachmentsData.url_image) {
      imageUrl = attachmentsData.url_image.trim();
    } else {
      return '/product.png';
    }
  } catch (error) {
    console.error('Error parsing attachments JSON:', error);
    return '/product.png';
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Ini bukan async, jadi langsung ambil .data.publicUrl
  const { data } = supabase.storage
    .from('markets-attachments')
    .getPublicUrl(imageUrl);

  return data?.publicUrl || '/product.png';
});


// Get all images from attachments JSON (if you need multiple images later)
const allImages = computed(() => {
  if (!props.product.attachments || props.product.attachments.trim() === '') {
    return [];
  }
  
  try {
    // Parse JSON string
    const attachmentsData = JSON.parse(props.product.attachments);
    
    // Handle different JSON structures
    let imageUrls = [];
    
    if (attachmentsData.url_image) {
      // Single image format: {"url_image": "path/to/image.png"}
      imageUrls = [attachmentsData.url_image];
    } else if (Array.isArray(attachmentsData)) {
      // Array format: [{"url_image": "path1"}, {"url_image": "path2"}]
      imageUrls = attachmentsData
        .filter(item => item.url_image)
        .map(item => item.url_image);
    } else if (attachmentsData.images && Array.isArray(attachmentsData.images)) {
      // Nested array format: {"images": [{"url_image": "path1"}]}
      imageUrls = attachmentsData.images
        .filter(item => item.url_image)
        .map(item => item.url_image);
    }
    
    return imageUrls.map(imageUrl => {
      // Check if it's already a full URL
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      
      // Get public URL from Supabase storage
      try {
        const { data } = supabase.storage
          .from('markets-attachments')
          .getPublicUrl(imageUrl);
        
        return data.publicUrl;
      } catch (error) {
        console.error('Error getting image URL:', error);
        return '/product.png';
      }
    });
    
  } catch (error) {
    console.error('Error parsing attachments JSON:', error);
    return [];
  }
});

// Get formatted category badge class
const categoryClass = computed(() => {
  const baseClass = 'text-xs font-medium px-3 py-1 rounded-full';
  
  switch (props.product.category) {
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

// Format description with character limit
const shortDescription = computed(() => {
  if (!props.product.description) return '';
  return props.product.description.length > 100 
    ? `${props.product.description.substring(0, 100)}...` 
    : props.product.description;
});

// Check if e-commerce links exist
const hasShopeeLink = computed(() => props.product.links?.shopee_link);
const hasTokopediaLink = computed(() => props.product.links?.tokopedia_link);
const hasTiktokLink = computed(() => props.product.links?.tiktok_link);

// Format WhatsApp link
const whatsappLink = computed(() => {
  if (!props.product.contact_seller) return '#';
  const phone = props.product.contact_seller.replace(/\D/g, '');
      // Pesan yang mau dikirim
  const message = 'Saya ingin menanyakan produk anda';
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
});

// Handle image load events
const handleImageLoad = () => {
  imageLoading.value = false;
  imageError.value = false;
};

const handleImageError = () => {
  imageLoading.value = false;
  imageError.value = true;
};
</script>

<template>
  <div class="market-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
    <!-- Product Image -->
    <div class="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
      <!-- Loading Spinner -->
      <div 
        v-if="imageLoading" 
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"/>
      </div>
      
      <!-- Error Placeholder -->
      <div 
        v-if="imageError" 
        class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
      >
        <div class="text-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm">Gambar tidak dapat dimuat</p>
        </div>
      </div>
      
      <!-- Main Image -->
      <img 
        v-show="!imageLoading && !imageError"
        :src="mainImage" 
        :alt="product.name" 
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        @load="handleImageLoad"
        @error="handleImageError"
      >
      
      <!-- Category Badge -->
      <span 
        :class="categoryClass"
        class="absolute top-3 right-3"
      >
        {{ product.category }}
      </span>
    </div>
    
    <!-- Product Details -->
    <div class="p-5">
      <h3 class="text-lg font-semibold mb-2 line-clamp-1 text-gray-800 dark:text-gray-100">{{ product.name }}</h3>
      
      <div class="flex items-baseline mb-3">
        <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ formattedPrice }}</span>
        <span v-if="priceRange" class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{ priceRange }}</span>
      </div>
      
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{{ shortDescription }}</p>
      
      <!-- Seller Information -->
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="font-medium">{{ product.seller || product.profiles?.name || 'Penjual' }}</span>
      </div>
      
      <!-- E-commerce Links -->
      <div class="flex flex-wrap gap-2 mb-4">
        <a 
          v-if="hasShopeeLink" 
          :href="product.links.shopee_link" 
          target="_blank" 
          class="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200 rounded-full text-xs transition-colors hover:bg-orange-200 dark:hover:bg-orange-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Shopee
        </a>
        
        <a 
          v-if="hasTokopediaLink" 
          :href="product.links.tokopedia_link" 
          target="_blank" 
          class="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 rounded-full text-xs transition-colors hover:bg-green-200 dark:hover:bg-green-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Tokopedia
        </a>
        
        <a 
          v-if="hasTiktokLink" 
          :href="product.links.tiktok_link" 
          target="_blank" 
          class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white dark:bg-gray-700 dark:text-gray-100 rounded-full text-xs transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.15-1.75V11.5a6.13 6.13 0 014.4 1.37V9.41a4.83 4.83 0 01-1.73.33 4.66 4.66 0 01-3.27-1.39v.08a4.83 4.83 0 104.83 4.83V8.05a8.74 8.74 0 004.52 1.29V6.69z" />
          </svg>
          TikTok
        </a>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-between items-center mt-4">
        <NuxtLink 
          :to="`/markets/${product.id}`" 
          class="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          Detail Produk
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
        
        <a 
          :href="whatsappLink" 
          target="_blank" 
          class="inline-flex items-center text-sm bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-full transition-colors hover:bg-green-600 dark:hover:bg-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.72.043.433-.101.706z"/>
          </svg>
          Hubungi
        </a>
      </div>
    </div>
  </div>
</template>