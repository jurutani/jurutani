<script setup lang="ts">
import { getFoodPriceBySlug, getSimilarProducts, formatCurrency, foodPriceCategories } from '~/data/food-prices'

const route = useRoute()
const slug = route.params.slug as string

// Get product data
const product = getFoodPriceBySlug(slug)

// If product not found, show 404
if (!product) {
  throw createError({
    statusCode: 404,
    message: 'Produk tidak ditemukan'
  })
}

// Get similar products
const similarProducts = getSimilarProducts(product, 4)

// WhatsApp handler
const openWhatsApp = () => {
  const message = encodeURIComponent(`Halo ${product.contactPerson}, saya tertarik dengan produk ${product.name}. Apakah masih tersedia?`)
  const whatsappUrl = `https://wa.me/${product.phone.replace(/^0/, '62').replace(/\D/g, '')}?text=${message}`
  window.open(whatsappUrl, '_blank')
}

// Get category icon
const getCategoryIcon = () => {
  const cat = foodPriceCategories.find(c => c.value === product.category)
  return cat?.icon || 'i-lucide-package'
}

// Get stock badge
const stockBadge = computed(() => {
  if (!product.stock) return { color: 'neutral' as const, label: 'N/A' }
  
  const stockLower = product.stock.toLowerCase()
  if (stockLower.includes('tersedia')) {
    return { color: 'success' as const, label: product.stock }
  } else if (stockLower.includes('terbatas')) {
    return { color: 'warning' as const, label: product.stock }
  } else {
    return { color: 'error' as const, label: product.stock }
  }
})

// SEO
useSeoOptimized('food-prices')

useHead({
  title: `${product.name} - ${product.producer}`,
  meta: [
    { name: 'description', content: product.fullDescription || product.description || `Beli ${product.name} dari ${product.producer} di DIY` }
  ]
})
</script>

<template>
  <div class="food-price-detail-page container mx-auto px-4 py-12">
    <!-- Breadcrumb -->
    <nav class="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
        Beranda
      </NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
      <NuxtLink to="/food-prices" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
        Harga Pangan
      </NuxtLink>
      <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
      <span class="text-gray-900 dark:text-white font-medium">{{ product.name }}</span>
    </nav>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <!-- Left: Product Image & Actions -->
      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <!-- Product Image -->
          <div class="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square mb-6">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-4 right-4">
              <UBadge 
                :color="stockBadge.color" 
                variant="solid" 
                size="lg"
                class="shadow-lg"
              >
                {{ stockBadge.label }}
              </UBadge>
            </div>
          </div>

          <!-- Price Card -->
          <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 mb-4 border border-emerald-200 dark:border-emerald-800">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Harga</div>
            <div class="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              {{ formatCurrency(product.price) }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-500">per {{ product.unit }}</div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <UButton 
              color="success"
              size="xl"
              block
              icon="i-lucide-message-circle"
              @click="openWhatsApp"
            >
              Hubungi via WhatsApp
            </UButton>
            
            <UButton 
              color="primary"
              variant="outline"
              size="lg"
              block
              icon="i-lucide-phone"
            >
              {{ product.phone }}
            </UButton>
          </div>

          <!-- Info Notice -->
          <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div class="flex gap-3">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div class="text-sm text-amber-800 dark:text-amber-300">
                <strong>Catatan:</strong> Harga di atas adalah harga perkiraan. Untuk kepastian harga dan jumlah stok silahkan hubungi produsen.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Product Details -->
      <div class="lg:col-span-2">
        <!-- Product Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
              <UIcon :name="getCategoryIcon()" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <UBadge color="primary" variant="subtle" size="lg">
              {{ product.category }}
            </UBadge>
          </div>

          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {{ product.name }}
          </h1>

          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ product.fullDescription || product.description }}
          </p>
        </div>

        <!-- Product Information Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Informasi Produk
            </h2>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Kategori Komoditas
              </div>
              <div class="col-span-2 text-sm text-gray-900 dark:text-white font-medium">
                {{ product.category }}
              </div>
            </div>

            <div class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Harga
              </div>
              <div class="col-span-2 text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                {{ formatCurrency(product.price) }}
              </div>
            </div>

            <div class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Satuan
              </div>
              <div class="col-span-2 text-sm text-gray-900 dark:text-white">
                {{ product.unit }}
              </div>
            </div>

            <div class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Stok
              </div>
              <div class="col-span-2">
                <UBadge :color="stockBadge.color" variant="subtle">
                  {{ stockBadge.label }}
                </UBadge>
              </div>
            </div>

            <div v-if="product.specifications" class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Spesifikasi
              </div>
              <div class="col-span-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ product.specifications }}
              </div>
            </div>
          </div>
        </div>

        <!-- Producer Information -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-lucide-users" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Informasi Produsen
            </h2>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Produsen
              </div>
              <div class="col-span-2 text-sm text-gray-900 dark:text-white font-medium">
                {{ product.producer }}
              </div>
            </div>

            <div class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Alamat
              </div>
              <div class="col-span-2 text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>{{ product.address }}</span>
              </div>
            </div>

            <div class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Telepon
              </div>
              <div class="col-span-2 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <UIcon name="i-lucide-phone" class="w-4 h-4 text-gray-400" />
                <a :href="`tel:${product.phone}`" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {{ product.phone }}
                </a>
              </div>
            </div>

            <div class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Contact Person
              </div>
              <div class="col-span-2 text-sm text-gray-900 dark:text-white">
                {{ product.contactPerson }}
              </div>
            </div>

            <div v-if="product.website" class="px-6 py-4 grid grid-cols-3 gap-4">
              <div class="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Website
              </div>
              <div class="col-span-2 text-sm">
                <a 
                  :href="`https://${product.website}`" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {{ product.website }}
                  <UIcon name="i-lucide-external-link" class="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Similar Products -->
    <div v-if="similarProducts.length > 0" class="mt-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Produk Serupa
        </h2>
        <NuxtLink 
          :to="`/food-prices?category=${product.category}`"
          class="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium flex items-center gap-1"
        >
          Lihat Semua
          <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FoodpriceCard
          v-for="item in similarProducts"
          :key="item.id"
          :product="item"
          compact
        />
      </div>
    </div>
  </div>
</template>