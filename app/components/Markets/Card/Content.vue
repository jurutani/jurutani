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
        <UIcon name="i-lucide-image" class="w-12 h-12 mb-2" />
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
          <UIcon name="i-lucide-user" class="w-4 h-4 text-green-500" />
          <span class="font-medium">{{ product.seller || product.profiles?.name || 'Penjual' }}</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <NuxtLink
          v-if="hasShopeeLink"
          :to="product.links!.shopee_link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200 rounded-full text-xs font-medium transition-colors hover:bg-orange-200 dark:hover:bg-orange-800"
        >
          Shopee
        </NuxtLink>

        <NuxtLink
          v-if="hasTokopediaLink"
          :to="product.links!.tokopedia_link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium transition-colors hover:bg-green-200 dark:hover:bg-green-800"
        >
          Tokopedia
        </NuxtLink>

        <NuxtLink
          v-if="hasTiktokLink"
          :to="product.links!.tiktok_link"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white dark:bg-gray-700 dark:text-gray-100 rounded-full text-xs font-medium transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
        >
          TikTok
        </NuxtLink>
      </div>

      <div class="flex justify-between items-center gap-3 mt-auto">
        <NuxtLink
          :to="`/markets/${product.id}`"
          class="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
        >
          <span>Detail</span>
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
        </NuxtLink>

        <NuxtLink
          :to="whatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
        >
          <UIcon name="i-lucide-send" class="h-4 w-4" />
          <span>Hubungi</span>
        </NuxtLink>
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