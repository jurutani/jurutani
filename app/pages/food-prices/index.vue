<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import SortDropdown from '~/components/App/SortDropdown.vue'
import { 
  foodPricesData, 
  foodPriceCategories, 
  filterFoodPrices, 
  sortFoodPrices,
  formatCurrency,
  type FoodPrice 
} from '~/data/food-prices'

const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const router = useRouter()

// State
const selectedCategory = ref('all')
const searchQuery = ref('')
const currentSort = ref<'name' | 'price-asc' | 'price-desc' | 'updated'>('updated')
const currentPage = ref(1)
const itemsPerPage = 15

// Computed data with filters
const filteredData = computed(() => {
  let data = filterFoodPrices(foodPricesData, selectedCategory.value, searchQuery.value)
  data = sortFoodPrices(data, currentSort.value)
  return data
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredData.value.slice(start, end)
})

// Get category icon
const getCategoryIcon = (category: string) => {
  const cat = foodPriceCategories.find(c => c.value === category)
  return cat?.icon || 'i-lucide-package'
}

// Get stock badge color
const getStockBadge = (stock?: string) => {
  if (!stock) return { color: 'neutral', label: 'N/A' }
  
  const stockLower = stock.toLowerCase()
  if (stockLower.includes('tersedia')) {
    return { color: 'success', label: stock }
  } else if (stockLower.includes('terbatas')) {
    return { color: 'warning', label: stock }
  } else {
    return { color: 'error', label: stock }
  }
}

// WhatsApp handler
const openWhatsApp = (phone: string, productName: string) => {
  const message = encodeURIComponent(`Halo, saya tertarik dengan produk ${productName}. Apakah masih tersedia?`)
  const whatsappUrl = `https://wa.me/${phone.replace(/^0/, '62').replace(/\D/g, '')}?text=${message}`
  window.open(whatsappUrl, '_blank')
}

// Table columns with cell renderers
const columns = [
  {
    accessorKey: 'name',
    header: 'Nama Produk',
    cell: ({ row }: any) => {
      return h('div', { class: 'flex items-center gap-3 min-w-[200px]' }, [
        h('div', {
          class: 'flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center'
        }, [
          h(UIcon, {
            name: getCategoryIcon(row.original.category),
            class: 'w-5 h-5 text-emerald-600 dark:text-emerald-400'
          })
        ]),
        h('div', { class: 'flex-1 min-w-0' }, [
          h('div', { class: 'font-semibold text-gray-900 dark:text-white truncate' }, row.original.name),
          row.original.description ? h('div', {
            class: 'text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs'
          }, row.original.description) : null
        ])
      ])
    }
  },
  {
    accessorKey: 'producer',
    header: 'Produsen',
    cell: ({ row }: any) => {
      return h('div', { class: 'min-w-[150px]' }, [
        h('div', { class: 'flex items-center gap-2' }, [
          h(UIcon, { name: 'i-lucide-users', class: 'w-4 h-4 text-gray-400' }),
          h('span', { class: 'text-gray-700 dark:text-gray-300' }, row.original.producer)
        ])
      ])
    }
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }: any) => {
      return h('div', { class: 'min-w-[120px]' }, [
        h(UBadge, {
          color: 'primary',
          variant: 'subtle',
          size: 'sm'
        }, () => row.original.category)
      ])
    }
  },
  {
    accessorKey: 'district',
    header: 'Wilayah',
    cell: ({ row }: any) => {
      return h('div', { class: 'min-w-[100px]' }, [
        h('div', { class: 'flex items-center gap-2' }, [
          h(UIcon, { name: 'i-lucide-map-pin', class: 'w-4 h-4 text-gray-400' }),
          h('span', { class: 'text-gray-600 dark:text-gray-400' }, row.original.district || '-')
        ])
      ])
    }
  },
  {
    accessorKey: 'price',
    header: 'Harga',
    cell: ({ row }: any) => {
      return h('div', { class: 'min-w-[120px]' }, [
        h('div', {
          class: 'font-bold text-emerald-600 dark:text-emerald-400 text-base'
        }, formatCurrency(row.original.price))
      ])
    }
  },
  {
    accessorKey: 'unit',
    header: 'Satuan',
    cell: ({ row }: any) => {
      return h('div', { class: 'min-w-[80px]' }, [
        h('span', { class: 'text-gray-600 dark:text-gray-400' }, `/ ${row.original.unit}`)
      ])
    }
  },
  {
    accessorKey: 'stock',
    header: 'Stok',
    cell: ({ row }: any) => {
      const badge = getStockBadge(row.original.stock)
      return h('div', { class: 'min-w-[100px]' }, [
        h(UBadge, {
          color: badge.color,
          variant: 'subtle',
          size: 'sm'
        }, () => badge.label)
      ])
    }
  },
  {
    accessorKey: 'actions',
    header: 'Aksi',
    cell: ({ row }: any) => {
      return h('div', { class: 'flex items-center gap-2 min-w-[180px]' }, [
        h(UButton, {
          color: 'primary',
          variant: 'soft',
          size: 'xs',
          icon: 'i-lucide-eye',
          onClick: () => router.push(`/food-prices/${row.original.slug}`)
        }, () => 'Detail'),
        h(UButton, {
          color: 'success',
          variant: 'soft',
          size: 'xs',
          icon: 'i-lucide-message-circle',
          onClick: () => openWhatsApp(row.original.phone, row.original.name)
        }, () => 'WhatsApp')
      ])
    }
  }
]

// Sort options - format untuk AppSortDropdown
const sortOptions = [
  { label: 'Terbaru', value: 'updated', column: 'updated_at', ascending: false },
  { label: 'Nama (A-Z)', value: 'name', column: 'name', ascending: true },
  { label: 'Harga Terendah', value: 'price-asc', column: 'price', ascending: true },
  { label: 'Harga Tertinggi', value: 'price-desc', column: 'price', ascending: false },
]

// Handlers
const handleCategoryChange = (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1
}

const handleSearchChange = () => {
  currentPage.value = 1
}

const handleSortChange = (sort: string) => {
  currentSort.value = sort as any
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="food-prices-page container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <header class="mx-auto mb-12 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-lucide-bar-chart-2" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Informasi Harga Terkini</span>
      </div>
      
      <h1 class="text-3xl md:text-4xl lg:text-5xl py-1 font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Daftar Harga Pangan DIY
      </h1>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
        Pantau harga komoditas pertanian terkini dari
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">produsen lokal terpercaya</span> di wilayah Daerah Istimewa Yogyakarta.
        Informasi harga transparan untuk 
        <span class="font-semibold text-teal-600 dark:text-teal-400">keputusan bisnis yang lebih baik</span>.
      </p>

      <!-- Category Filter -->
      <nav aria-label="Filter kategori pangan">
      <AppCategoryFilter 
        :categories="foodPriceCategories" 
        :current-category="selectedCategory"
        :show-all-option="false"
        @update:category="handleCategoryChange"
        />
      </nav>
    </header>
    
    <!-- Filter & Sort Bar -->
    <aside class="flex flex-col gap-4 mb-8" aria-label="Filter dan pencarian harga pangan">
      
      <!-- Search Bar - Full width on all screens -->
      <AppSearchBar 
        v-model="searchQuery"
        placeholder="Cari produk, produsen, atau komoditas..."
        @search="handleSearchChange"
      />
      
      <!-- Sort and Results Row -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <!-- Sort Dropdown -->
        <AppSortDropdown 
          :sort-options="sortOptions"
          :current-sort="currentSort"
          @update:sort="handleSortChange"
        />
        
        <!-- Results Count -->
        <div v-if="filteredData.length > 0" class="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ paginatedData.length }}</span> dari <span class="font-semibold">{{ filteredData.length }}</span> produk
        </div>
      </div>
    </aside>
    
    <!-- Info Badge -->
    <div class="flex items-center justify-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
      <UIcon name="i-lucide-clock" class="w-4 h-4" />
      Data diperbarui hari ini
    </div>

    <!-- Data Table -->
    <section aria-labelledby="price-table-heading">
      <h2 id="price-table-heading" class="sr-only">Tabel Harga Komoditas Pangan</h2>
      
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div v-if="paginatedData.length > 0" class="overflow-x-auto">
        <UTable
          :data="paginatedData"
          :columns="columns"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredData.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-search-x" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Tidak ada data ditemukan
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Coba ubah filter atau kata kunci pencarian
        </p>
        <UButton 
          color="primary" 
          variant="soft"
          @click="() => { selectedCategory = 'all'; searchQuery = '' }"
        >
          Reset Filter
        </UButton>
      </div>
    </div>
    </section>

    <!-- Pagination -->
    <nav aria-label="Navigasi halaman harga pangan" v-if="totalPages > 1" class="mt-8">
      <AppPagination 
        :current-page="currentPage" 
        :total-pages="totalPages"
        :total-items="filteredData.length"
        :page-size="itemsPerPage"
        :show-page-info="true"
        :show-first-last="true"
        @update:page="handlePageChange"
      />
    </nav>

    <!-- Info Footer -->
    <aside class="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl" aria-label="Catatan penting">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-info" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div class="text-sm text-amber-800 dark:text-amber-200">
          <p class="font-semibold mb-1">Catatan Penting:</p>
          <ul class="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
            <li>Harga yang tertera merupakan harga perkiraan dan dapat berubah sewaktu-waktu</li>
            <li>Untuk kepastian harga dan ketersediaan stok, silakan hubungi produsen terkait</li>
            <li>Data harga diperbarui secara berkala untuk memberikan informasi yang akurat</li>
          </ul>
        </div>
      </div>
    </aside>
  </main>
</template>

<style scoped>
/* Smooth transitions */
.food-prices-page {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
