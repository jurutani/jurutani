<script setup lang="ts">
import { ref, computed } from 'vue';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  price_range?: string;
  category: string;
  attachments?: string;
  seller?: string;
  contact_seller?: string;
  links?: {
    shopee_link?: string;
    tokopedia_link?: string;
    tiktok_link?: string;
  };
  profiles?: {
    name: string;
  };
}

const props = defineProps<{
  product: Product;
}>();

const imageError = ref(false);
const imageLoading = ref(true);

const { $supabase } = useNuxtApp();

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(props.product.price || 0);
});

const priceRange = computed(() => {
  return props.product.price_range || '';
});

const mainImage = computed(() => {
  if (!props.product.attachments?.trim()) {
    return '/product.png';
  }

  let imageUrl = '';

  try {
    const attachmentsData = JSON.parse(props.product.attachments);
    imageUrl = attachmentsData?.url_image?.trim();

    if (!imageUrl) {
      return '/product.png';
    }
  } catch {
    return '/product.png';
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  const { data } = ($supabase as any).storage
    .from('markets-attachments')
    .getPublicUrl(imageUrl);

  return data?.publicUrl || '/product.png';
});

const shortDescription = computed(() => {
  if (!props.product.description) return '';
  const maxLength = 100;
  return props.product.description.length > maxLength
    ? `${props.product.description.substring(0, maxLength)}...`
    : props.product.description;
});

const hasShopeeLink = computed(() => !!props.product.links?.shopee_link);
const hasTokopediaLink = computed(() => !!props.product.links?.tokopedia_link);
const hasTiktokLink = computed(() => !!props.product.links?.tiktok_link);

const whatsappLink = computed(() => {
  if (!props.product.contact_seller) return '#';
  const phone = props.product.contact_seller.replace(/\D/g, '');
  const message = encodeURIComponent('Saya ingin menanyakan produk anda');
  return `https://api.whatsapp.com/send/?phone=${phone}&text=${message}&type=phone_number&app_absent=0`;
});

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'hasil pertanian': 'bg-green-600',
    'alat pertanian': 'bg-blue-600',
    pupuk: 'bg-yellow-600',
    bibit: 'bg-emerald-600',
    default: 'bg-lime-600'
  };
  return colors[category.toLowerCase()] || colors.default;
};

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
  <article class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-gray-600 flex flex-col h-full">
    <div class="relative h-52 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
      <div v-if="imageLoading && mainImage && !imageError" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-600"/>
      </div>

      <img
        v-if="mainImage && !imageError"
        :src="mainImage"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        @error="handleImageError"
        @load="handleImageLoad"
      >

      <div v-else class="flex flex-col items-center justify-center h-full text-green-400 dark:text-gray-500">
        <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-sm font-medium">🌱 Produk</span>
      </div>

      <div class="absolute top-3 left-3">
        <span :class="`${getCategoryColor(product.category)} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`">
          {{ product.category }}
        </span>
      </div>
    </div>

    <div class="p-6 flex flex-col flex-grow">
      <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
        {{ product.name }}
      </h3>

      <div class="flex items-baseline mb-3">
        <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ formattedPrice }}</span>
        <span v-if="priceRange" class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{ priceRange }}</span>
      </div>

      <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
        {{ shortDescription }}
      </p>

      <div class="flex items-center justify-between mb-4 text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="font-medium">{{ product.seller || product.profiles?.name || 'Penjual' }}</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <a
          v-if="hasShopeeLink"
          :href="product.links!.shopee_link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200 rounded-full text-xs font-medium transition-colors hover:bg-orange-200 dark:hover:bg-orange-800"
        >
          Shopee
        </a>

        <a
          v-if="hasTokopediaLink"
          :href="product.links!.tokopedia_link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium transition-colors hover:bg-green-200 dark:hover:bg-green-800"
        >
          Tokopedia
        </a>

        <a
          v-if="hasTiktokLink"
          :href="product.links!.tiktok_link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white dark:bg-gray-700 dark:text-gray-100 rounded-full text-xs font-medium transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          TikTok
        </a>
      </div>

      <div class="flex justify-between items-center gap-3 mt-auto">
        <NuxtLink
          :to="`/markets/${product.id}`"
          class="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
        >
          <span>Detail</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>

        <a
          :href="whatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.72.043.433-.101.706z"/>
          </svg>
          <span>Hubungi</span>
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}
</style>