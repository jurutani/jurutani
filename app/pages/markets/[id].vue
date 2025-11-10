<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'default',
})

// Types
interface Market {
  id: string | number
  name: string
  description?: string
  price: number
  price_range?: string
  category: string
  location?: string
  weight?: string
  size?: string
  stock?: string | number
  status: string
  created_at: string
  attachments?: string
  seller?: string
  contact_seller?: string
  links?: {
    shopee_link?: string
    tokopedia_link?: string
    tiktok_link?: string
  }
  profiles?: {
    full_name?: string
    name?: string
    avatar_url?: string
  }
  deleted_at?: string
  archived_at?: string
}

// Composables
const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()

// State
const marketId = route.params.id as string
const product = ref<Market | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const currentImageIndex = ref(0)
const similarMarkets = ref<Market[]>([])
const loadingSimilar = ref(false)

// Format price as Indonesian currency
const formattedPrice = computed(() => {
  if (!product.value?.price) return 'Harga tidak tersedia'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(product.value.price)
})

// Get images array from attachments with proper Supabase bucket access
const images = computed(() => {
  if (!product.value?.attachments || product.value.attachments.trim() === '') {
    return ['/product.png']
  }

  try {
    const attachmentsData = JSON.parse(product.value.attachments)
    const imageUrls: string[] = []

    // Handle single image
    if (attachmentsData.url_image) {
      const imageUrl = attachmentsData.url_image.trim()
      if (imageUrl.startsWith('http')) {
        imageUrls.push(imageUrl)
      } else {
        const { data } = supabase.storage
          .from('markets-attachments')
          .getPublicUrl(imageUrl)
        imageUrls.push(data?.publicUrl || '/product.png')
      }
    }

    // Handle multiple images array
    if (attachmentsData.images && Array.isArray(attachmentsData.images)) {
      attachmentsData.images.forEach((img: string) => {
        if (typeof img === 'string') {
          if (img.startsWith('http')) {
            imageUrls.push(img)
          } else {
            const { data } = supabase.storage
              .from('markets-attachments')
              .getPublicUrl(img)
            imageUrls.push(data?.publicUrl || '/product.png')
          }
        }
      })
    }

    return imageUrls.length > 0 ? imageUrls : ['/product.png']
  } catch (error) {
    console.error('Error parsing attachments JSON:', error)
    return ['/product.png']
  }
})

// Category badge class with improved styling
const categoryClass = computed(() => {
  if (!product.value?.category) return ''
  
  const baseClass = 'text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border'
  
  switch (product.value.category) {
    case 'Hasil Pertanian':
      return `${baseClass} bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800`
    case 'Alat Pertanian':
      return `${baseClass} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800`
    case 'Pupuk':
      return `${baseClass} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800`
    default:
      return `${baseClass} bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700`
  }
})

// Check if e-commerce links exist
const hasShopeeLink = computed(() => product.value?.links?.shopee_link)
const hasTokopediaLink = computed(() => product.value?.links?.tokopedia_link)
const hasTiktokLink = computed(() => product.value?.links?.tiktok_link)

// Format WhatsApp link
const whatsappLink = computed(() => {
  if (!product.value?.contact_seller) return '#'
  const phone = product.value.contact_seller.replace(/\D/g, '')
  const message = 'Saya ingin menanyakan produk anda'
  const encodedMessage = encodeURIComponent(message)
  return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`
})

// Format date
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Format category
const formatCategory = (category?: string): string => {
  if (!category) return 'Lainnya'
  return category.charAt(0).toUpperCase() + category.slice(1)
}

// Fetch product by ID
const fetchProduct = async (): Promise<void> => {
  loading.value = true
  error.value = null
  
  try {
    const { data, error: fetchError } = await supabase
      .from('markets')
      .select(`
        *,
        profiles (
          *
        )
      `)
      .eq('id', marketId)
      .is('deleted_at', null)
      .is('archived_at', null)
      .eq('status', 'Approved')
      .single()
    
    if (fetchError) {
      console.error('[Supabase Fetch Error]', fetchError)
      error.value = fetchError.message || 'Gagal memuat produk'
      return
    }
    
    if (!data) {
      error.value = 'Produk tidak ditemukan'
      return
    }
    
    product.value = data
    
    // Fetch similar markets after main product is loaded
    await fetchSimilarMarkets(data.category)
  } catch (err) {
    console.error('[FetchProduct Error]', err)
    error.value = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak terduga'
  } finally {
    loading.value = false
  }
}

// Fetch similar markets by category
const fetchSimilarMarkets = async (category?: string): Promise<void> => {
  if (!category) return
  
  loadingSimilar.value = true
  
  try {
    const { data, error: fetchError } = await supabase
      .from('markets')
      .select('*')
      .eq('category', category)
      .eq('status', 'Approved')
      .is('deleted_at', null)
      .is('archived_at', null)
      .neq('id', marketId)
      .order('created_at', { ascending: false })
      .limit(4)

    if (fetchError) {
      console.error('Error fetching similar markets:', fetchError)
      return
    }

    similarMarkets.value = data || []
  } catch (err) {
    console.error('Unexpected error fetching similar markets:', err)
  } finally {
    loadingSimilar.value = false
  }
}

// Navigate through images
const nextImage = (): void => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}

const prevImage = (): void => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = images.value.length - 1
  }
}

// Go back to markets page
const goBack = (): void => {
  router.push('/markets')
}

// Open WhatsApp
const openWhatsApp = (): void => {
  if (whatsappLink.value !== '#') {
    window.open(whatsappLink.value, '_blank', 'noopener,noreferrer')
  }
}

const seoTitle = computed(() => product.value ? `${product.value.name}` : 'Memuat Produk...')
const seoDescription = computed(() => product.value ? (product.value.description || `${product.value.name} - Harga Rp${product.value.price?.toLocaleString('id-ID') || 'Nego'}`) : 'Produk pertanian dari Juru Tani.')
const seoImage = computed(() => images.value[0] || '/product.png')
const seoKeywords = computed(() => product.value ? [
  'marketplace pertanian',
  product.value.category?.toLowerCase() || 'produk',
  'jual beli pertanian',
  'supplier pertanian'
] : [])

// Initial fetch
onMounted(() => {
  fetchProduct()
})

// Update SEO after product is loaded
watch(() => product.value, (newVal) => {
  if (newVal) {
    useSeoDetail({
      title: seoTitle.value,
      description: seoDescription.value,
      keywords: seoKeywords.value,
      image: seoImage.value,
      url: `https://jurutani.com/markets/${marketId}`,
      type: 'website'
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="shadow-sm ">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <button 
              class="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              @click="goBack"
            >
              <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
              <span class="font-medium">Kembali ke Pasar Tani</span>
            </button>
            
            <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
              <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5" />
              <span class="font-semibold">Pasar Tani</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Loading State -->
      <LoadingData v-if="loading" />
      
      <!-- Error State -->
      <ErrorData v-else-if="error" :error="error" />
      
      <!-- Product Details -->
      <article v-else-if="product" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div class="relative bg-gray-50 dark:bg-gray-700 p-6">
            <div class="relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm h-96 lg:h-[500px]">
              <img 
                :src="images[currentImageIndex]" 
                :alt="product.name" 
                class="w-full h-full object-contain"
                @error="(e: any) => e.target.src = '/product.png'"
              >
              
              <!-- Image Navigation Buttons -->
              <div v-if="images.length > 1" class="absolute inset-0 flex justify-between items-center pointer-events-none">
                <button 
                  class="pointer-events-auto bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full p-3 m-4 transition-all focus:outline-none shadow-lg backdrop-blur-sm" 
                  @click="prevImage"
                >
                  <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
                </button>
                
                <button 
                  class="pointer-events-auto bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full p-3 m-4 transition-all focus:outline-none shadow-lg backdrop-blur-sm" 
                  @click="nextImage"
                >
                  <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
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
                    ? 'border-emerald-500 dark:border-emerald-400 shadow-md ring-2 ring-emerald-200 dark:ring-emerald-800' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                ]" 
                @click="currentImageIndex = index"
              >
                <img :src="img" :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover" @error="(e: any) => e.target.src = '/product.png'">
              </button>
            </div>
          </div>
          
          <!-- Right Column - Product Info -->
          <div class="p-6 lg:p-8">
            <div class="h-full flex flex-col">
              <!-- Product Title & Price -->
              <div class="mb-6">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {{ product.name }}
                </h1>
                
                <div class="flex items-baseline mb-4">
                  <span class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ formattedPrice }}</span>
                  <span v-if="product.price_range" class="text-sm text-gray-500 dark:text-gray-400 ml-3">{{ product.price_range }}</span>
                </div>
              </div>
              
              <!-- Description -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <UIcon name="i-lucide-file-text" class="w-5 h-5 mr-2 text-gray-500" />
                  Deskripsi Produk
                </h2>
                <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p v-if="product.description" class="whitespace-pre-line">{{ product.description }}</p>
                  <p v-else class="text-gray-500 dark:text-gray-400 italic">Tidak ada deskripsi untuk produk ini.</p>
                </div>
              </div>
              
              <!-- Product Details -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <UIcon name="i-lucide-box" class="w-5 h-5 mr-2 text-gray-500" />
                  Detail Produk
                </h2>
                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                  <div v-if="product.weight" class="flex items-center text-sm">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <UIcon name="i-lucide-scale" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span class="text-gray-700 dark:text-gray-300"><span class="font-medium">Berat:</span> {{ product.weight }}</span>
                  </div>
                  
                  <div v-if="product.size" class="flex items-center text-sm">
                    <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                      <UIcon name="i-lucide-ruler" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span class="text-gray-700 dark:text-gray-300"><span class="font-medium">Ukuran:</span> {{ product.size }}</span>
                  </div>
                  
                  <div v-if="product.stock" class="flex items-center text-sm">
                    <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                      <UIcon name="i-lucide-package" class="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span class="text-gray-700 dark:text-gray-300"><span class="font-medium">Stok:</span> {{ product.stock }}</span>
                  </div>
                  
                  <div v-if="product.created_at" class="flex items-center text-sm">
                    <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                      <UIcon name="i-lucide-calendar" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span class="text-gray-700 dark:text-gray-300"><span class="font-medium">Dipublikasikan:</span> {{ formatDate(product.created_at) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Seller Info -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <UIcon name="i-lucide-user-circle" class="w-5 h-5 mr-2 text-gray-500" />
                  Informasi Penjual
                </h2>
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="w-14 h-14 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 mr-4 ring-2 ring-gray-200 dark:ring-gray-600">
                    <img 
                      :src="product.profiles?.avatar_url || '/profile.png'" 
                      :alt="product.profiles?.name || product.seller || 'Penjual'" 
                      class="w-full h-full object-cover"
                      @error="(e: any) => e.target.src = '/profile.png'"
                    >
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 dark:text-white">
                      {{ product.profiles?.full_name || product.seller || 'Penjual' }}
                    </h3>
                    <p v-if="product.location" class="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <UIcon name="i-lucide-map-pin" class="w-4 h-4 mr-1" />
                      {{ product.location }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- E-commerce Links -->
              <div v-if="hasShopeeLink || hasTokopediaLink || hasTiktokLink" class="mb-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <UIcon name="i-lucide-shopping-bag" class="w-5 h-5 mr-2 text-gray-500" />
                  Tersedia di Marketplace
                </h2>
                <div class="flex flex-wrap gap-3">
                  <NuxtLink
                    v-if="hasShopeeLink"
                    :to="product.links?.shopee_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 transition-all transform hover:scale-105 shadow-sm font-medium"
                  >
                    <UIcon name="i-lucide-shopping-bag" class="w-4 h-4 mr-2" />
                    Shopee
                  </NuxtLink>

                  <NuxtLink
                    v-if="hasTokopediaLink"
                    :to="product.links?.tokopedia_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all transform hover:scale-105 shadow-sm font-medium"
                  >
                    <UIcon name="i-lucide-store" class="w-4 h-4 mr-2" />
                    Tokopedia
                  </NuxtLink>

                  <NuxtLink
                    v-if="hasTiktokLink"
                    :to="product.links?.tiktok_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all transform hover:scale-105 shadow-sm font-medium"
                  >
                    <UIcon name="i-lucide-music" class="w-4 h-4 mr-2" />
                    TikTok Shop
                  </NuxtLink>
                </div>
              </div>
              
              <!-- Contact Button -->
              <div class="mt-auto pt-6">
                <button 
                  @click="openWhatsApp"
                  class="inline-flex items-center justify-center w-full px-6 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all transform hover:scale-105 text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  <UIcon name="i-mdi-whatsapp" class="text-2x mx-4" />
                  Hubungi Penjual
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Similar Products Section -->
      <section v-if="product" class="mt-12">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-package-2" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Produk Serupa
              </h2>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Kategori: <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ formatCategory(product.category) }}</span>
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Berikut adalah produk serupa dari kategori yang sama. Kami menampilkan pilihan terbaik untuk membantu Anda menemukan produk yang sesuai dengan kebutuhan.
          </p>
        </div>

        <!-- Loading State -->
        <LoadingData v-if="loadingSimilar" />

        <!-- Similar Products Grid -->
        <div v-else-if="similarMarkets.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MarketsCardContent 
              v-for="item in similarMarkets"
              :key="item.id"
              :product="(item as any)"
            />
          </div>

          <!-- Button placed outside the grid -->
          <div class="flex justify-center">
            <NuxtLink
              to="/markets"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg font-semibold"
            >
              <span>Lihat Semua Produk</span>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

        <!-- No Similar Products -->
        <NotFoundData v-else />
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for thumbnail images */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background-color: rgb(243, 244, 246);
  border-radius: 10px;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background-color: rgb(55, 65, 81);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgb(209, 213, 219);
  border-radius: 10px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgb(75, 85, 99);
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156, 163, 175);
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107, 114, 128);
}

/* Image fade in effect */
img {
  transition: opacity 0.3s duration;
}

/* Button press animation */
button:active,
a:active {
  transform: scale(0.98);
}
</style>