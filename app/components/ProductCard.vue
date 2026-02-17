<script setup lang="ts">
  import { UIcon } from '#build/components';
import type { Product } from '~~/types/store'
  const { id, title, price, image, badge, shipping, category, description } = defineProps<Product>()

  // Format harga dengan pemisah ribuan
  const formattedPrice = computed(() => {
    return new Intl.NumberFormat('id-ID').format(Number(price))
  })
</script>

<template>
  <div class="product-card group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg dark:bg-green-800">
      <!-- Badge -->
      <div v-if="badge" class="absolute left-4 top-4 z-10">
        <UBadge :label="badge" class="badge-primary font-medium" />
      </div>
      
      <!-- Gambar Produk -->
      <div class="relative overflow-hidden">
        <NuxtImg 
          class="h-48 sm:h-56 md:h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          :src="image" 
          alt="Product Image" 
          loading="lazy"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"/>
  
        <!-- Tombol Action -->
        <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-3 p-4 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <UButton 
            icon="i-lucide-send" 
            color="success"
            variant="solid"
            class="action-btn rounded-full"
            aria-label="WhatsApp"
            @click="() => window.open(`https://wa.me/62?text=Saya%20tertarik%20dengan%20produk%20ini`)"
          />
          <NuxtLink :to="`/store/${id}`" class="action-btn bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center" aria-label="Detail Produk">
            <UIcon name="i-lucide-eye" />
          </NuxtLink>
          <UButton 
            icon="i-lucide-shopping-cart" 
            color="orange"
            variant="solid"
            class="action-btn rounded-full"
            aria-label="Keranjang"
          />
        </div>
      </div>
  
      <!-- Konten Produk -->
      <div class="flex flex-1 flex-col justify-between p-4">
        <div>
          <UBadge v-if="category" :label="category" class="bg-primary/10 text-primary text-xs font-medium dark:bg-primary/20 mb-2" />
          <h3 class="mb-2 line-clamp-2 text-lg font-bold text-gray-800 dark:text-gray-100">{{ title }}</h3>
          <p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{{ description }}</p>
        </div>
  
        <!-- Harga dan Shipping -->
        <div class="mt-4 flex items-center justify-between">
          <div class="flex flex-col">
            <span v-if="Number(price) > 100" class="text-sm text-gray-500 line-through dark:text-gray-400">Rp {{ Number(formattedPrice) * 1.15 }}</span>
            <span class="text-xl font-bold text-primary">Rp {{ formattedPrice }}</span>
          </div>
          <span v-if="shipping" class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {{ shipping }}
          </span>
        </div>
      </div>
  
      <!-- Tombol Lihat Detail -->
      <div class="border-t border-gray-100 p-4 dark:border-gray-700">
        <NuxtLink :to="`/store/${id}`" class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-center text-white transition-colors hover:bg-primary-dark">
          <span>Lihat Detail</span>
          <UIcon name="i-lucide-arrow-right" />
        </NuxtLink>
      </div>
  </div>
  </template>
  

  <style scoped>
    @reference "tailwindcss";
  .product-card {
    @apply w-full h-full flex flex-col transition-all;
  }
  
  .badge-primary {
    background-color: #2E7D32;
    color: white;
  }
  
  .bg-primary {
    background-color: #2E7D32;
  }
  
  .bg-primary-dark {
    background-color: #1B5E20;
  }
  
  .text-primary {
    color: #2E7D32;
  }
  
  .action-btn {
    @apply rounded-full p-3 text-white shadow-md transition-transform hover:scale-110 flex items-center justify-center;
    width: 40px;
    height: 40px;
  }
  
  /* Responsive: Automatic by Tailwind (via class) */
  
  /* Dark mode */
  .dark .product-card {
    background-color: #1F2937;
    color: #F9FAFB;
  }
  </style>
  