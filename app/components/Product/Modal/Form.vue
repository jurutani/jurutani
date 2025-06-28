<script setup lang="ts">
import type { UUID } from 'crypto';
import { ref, computed, onMounted } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'
import { useProfile } from '~/composables/useProfile'

const { supabase } = useSupabase()
const { userData, fetchUserData } = useProfile()

// Types
interface Category {
  name: string;
}

interface FormState {
  name: string;
  description: string;
  price: string | number;
  price_range: string;
  shopee_link: string;
  tiktok_link: string;
  tokopedia_link: string;
  category: string;
  seller: string;
  contact_seller: string;
  imageFile?: File;
}

// Emits
const emit = defineEmits<{
  close: []
}>()

// Ambil kategori dari tabel 'category-markets'
const { data: CATEGORY } = await useAsyncData('category_markets', async () => {
  try {
    const { data, error: catError } = await supabase
      .from('category_markets')
      .select('name')
      .order('name', { ascending: true })

    if (catError) throw catError
    
    return data as Category[]
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
})

// Transform categories for USelect component
const categoryOptions = computed(() => {
  if (!CATEGORY.value) return []
  
  return CATEGORY.value.map(cat => ({
    label: cat.name,
    value: cat.name
  }))
})


const STORAGE_BUCKET = 'markets-attachments' as const

// Reactive State
const form = ref<FormState>({
  name: '',
  description: '',
  price: '',
  price_range: '',
  shopee_link: '',
  tiktok_link: '',
  tokopedia_link: '',
  category: '',
  seller: '',
  contact_seller: ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const imagePreview = ref<string | null>(null)

// Check user authentication
const checkUserAuth = (): boolean => {
  if (!userData.value) {
    toastStore.error('Login dulu')
    emit('close')
    navigateTo('/auth/login')
    return false
  }
  return true
}

// Validation
const validateForm = (): boolean => {
  errors.value = {}

  const validationRules = [
    {
      condition: !form.value.name.trim(),
      field: 'name',
      message: 'Nama produk wajib diisi'
    },
    {
      condition: !form.value.description.trim(),
      field: 'description',
      message: 'Deskripsi produk wajib diisi'
    },
    {
      condition: !form.value.category,
      field: 'category',
      message: 'Kategori wajib dipilih'
    },
    {
      condition: !form.value.seller.trim(),
      field: 'seller',
      message: 'Nama toko wajib diisi'
    },
    {
      condition: !form.value.contact_seller.trim(),
      field: 'contact_seller',
      message: 'Kontak seller wajib diisi'
    },
    {
      condition: form.value.shopee_link && !isValidUrl(form.value.shopee_link),
      field: 'shopee_link',
      message: 'Format link Shopee tidak valid'
    },
    {
      condition: form.value.tiktok_link && !isValidUrl(form.value.tiktok_link),
      field: 'tiktok_link',
      message: 'Format link TikTok tidak valid'
    },
    {
      condition: form.value.tokopedia_link && !isValidUrl(form.value.tokopedia_link),
      field: 'tokopedia_link',
      message: 'Format link Tokopedia tidak valid'
    }
  ]

  validationRules.forEach(rule => {
    if (rule.condition) {
      errors.value[rule.field] = rule.message
    }
  })

  return Object.keys(errors.value).length === 0
}

const isValidUrl = (url: string): boolean => {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// File Upload Utilities
const uploadFile = async (bucket: string, path: string, file: File): Promise<string> => {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (error) throw error
  return path
}

const generateFilePath = (id: string, fileName: string): string => {
  const timestamp = Date.now()
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `markets/${id}/${timestamp}_${cleanFileName}`
}

// File Handlers
const handleImageUpload = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toastStore.error('File harus berupa gambar')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toastStore.error('Ukuran gambar maksimal 5MB')
    return
  }

  form.value.imageFile = file

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

// Form Submission
const handleSubmit = async (): Promise<void> => {
  // Check authentication first
  if (!checkUserAuth()) return

  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const marketId = crypto.randomUUID()
    let attachmentsData = {}

    // Upload image if file selected
    if (form.value.imageFile) {
      const imagePath = generateFilePath(marketId, form.value.imageFile.name)
      const uploadedPath = await uploadFile(STORAGE_BUCKET, imagePath, form.value.imageFile)
      
      attachmentsData = {
        url_image: uploadedPath
      }
    }

    // Prepare links JSONB data
    const linksData = {
      shopee_link: form.value.shopee_link.trim() || null,
      tiktok_link: form.value.tiktok_link.trim() || null,
      tokopedia_link: form.value.tokopedia_link.trim() || null
    }

    // Prepare payload for insert
    const payload = {
      id: marketId,
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      price: form.value.price ? Number(form.value.price) : null,
      price_range: form.value.price_range.trim() || null,
      attachments: Object.keys(attachmentsData).length > 0 ? attachmentsData : null,
      links: linksData,
      category: form.value.category,
      seller: form.value.seller.trim(),
      contact_seller: form.value.contact_seller.trim(),
      user_id: userData.value.id, // Use profile ID from useProfile
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert new record
    const { error } = await supabase
      .from('markets')
      .insert(payload)

    if (error) throw error

    toastStore.success('Produk baru berhasil ditambahkan!')
    emit('close')

  } catch (error: any) {
    console.error('Error saving market item:', error)
    toastStore.error(`Gagal menyimpan produk: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = (): void => {
  emit('close')
}

// Initialize component
onMounted(async () => {
  await fetchUserData()
})
</script>

<template>
  <UCard class="bg-white dark:bg-gray-800">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-shopping-bag"
          class="text-green-600 dark:text-green-400 text-xl"
        />
        <h2 class="text-xl font-bold text-green-700 dark:text-green-400 my-auto flex items-center h-full">
          Tambah Produk Baru
        </h2>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Nama Produk -->
      <UFormGroup label="Nama Produk" required>
        <UInput
          v-model="form.name"
          placeholder="Masukkan nama produk"
          :error="!!errors.name"
          color="green"
          size="md"
        >
          <template #trailing>
            <UIcon name="i-heroicons-tag" class="text-gray-400" />
          </template>
        </UInput>
        <template #hint>
          <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
        </template>
      </UFormGroup>

      <!-- Deskripsi Produk -->
      <UFormGroup label="Deskripsi Produk" required>
        <UTextarea
          v-model="form.description"
          placeholder="Masukkan deskripsi produk"
          :error="!!errors.description"
          :rows="3"
          color="green"
          class="resize-y"
        >
          <template #trailing>
            <UIcon name="i-heroicons-document-text" class="text-gray-400" />
          </template>
        </UTextarea>
        <template #hint>
          <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
        </template>
      </UFormGroup>

      <!-- Kategori -->
       <UFormGroup label="Kategori">
        <USelect
          v-model="form.category"
          :options="categoryOptions"
          option-attribute="label"
          value-attribute="value"
          placeholder="Pilih kategori"
          color="green"
        >
          <template #leading>
            <UIcon name="i-heroicons-tag" class="text-gray-400" />
          </template>
        </USelect>
      </UFormGroup>

      <!-- Harga dan Rentang Harga -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Harga (Rp)">
          <UInput
            v-model="form.price"
            type="number"
            placeholder="Masukkan harga produk"
            color="green"
          >
            <template #leading>
              <span class="text-gray-500">Rp</span>
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup label="Rentang Harga">
          <UInput
            v-model="form.price_range"
            placeholder="Contoh: 50.000 - 75.000"
            color="green"
          />
        </UFormGroup>
      </div>

      <!-- Image Upload -->
      <UFormGroup label="Gambar Produk">
        <input
          type="file"
          accept="image/*"
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          @change="handleImageUpload"
        >

        <!-- Image Preview -->
        <div v-if="imagePreview" class="mt-3">
          <img 
            :src="imagePreview" 
            alt="Preview gambar" 
            class="h-40 w-auto object-cover rounded-md border"
          >
        </div>
        
        <template #hint>
          <p class="text-xs text-gray-500">Format: JPG, PNG, GIF. Maksimal 5MB</p>
        </template>
      </UFormGroup>

      <!-- Links -->
      <UFormGroup label="Link Marketplace">
        <div class="space-y-3">
          <!-- Shopee Link -->
          <div class="flex items-center gap-2">
            <span class="w-28 text-sm font-medium">Shopee:</span>
            <UInput
              v-model="form.shopee_link"
              placeholder="https://shopee.co.id/product..."
              :error="!!errors.shopee_link"
              color="green"
              class="flex-1"
            >
              <template #leading>
                <UIcon name="i-heroicons-link" class="text-gray-400" />
              </template>
            </UInput>
          </div>
          
          <!-- TikTok Link -->
          <div class="flex items-center gap-2">
            <span class="w-28 text-sm font-medium">TikTok Shop:</span>
            <UInput
              v-model="form.tiktok_link"
              placeholder="https://tiktok.com/shop/product..."
              :error="!!errors.tiktok_link"
              color="green"
              class="flex-1"
            >
              <template #leading>
                <UIcon name="i-heroicons-link" class="text-gray-400" />
              </template>
            </UInput>
          </div>
          
          <!-- Tokopedia Link -->
          <div class="flex items-center gap-2">
            <span class="w-28 text-sm font-medium">Tokopedia:</span>
            <UInput
              v-model="form.tokopedia_link"
              placeholder="https://tokopedia.com/product..."
              :error="!!errors.tokopedia_link"
              color="green"
              class="flex-1"
            >
              <template #leading>
                <UIcon name="i-heroicons-link" class="text-gray-400" />
              </template>
            </UInput>
          </div>
        </div>
        <template #hint>
          <div class="space-y-1">
            <p v-if="errors.shopee_link" class="text-red-500 text-sm">{{ errors.shopee_link }}</p>
            <p v-if="errors.tiktok_link" class="text-red-500 text-sm">{{ errors.tiktok_link }}</p>
            <p v-if="errors.tokopedia_link" class="text-red-500 text-sm">{{ errors.tokopedia_link }}</p>
          </div>
        </template>
      </UFormGroup>

      <!-- Seller Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Nama Toko/Seller" required>
          <UInput
            v-model="form.seller"
            placeholder="Masukkan nama toko"
            :error="!!errors.seller"
            color="green"
          >
            <template #leading>
              <UIcon name="i-heroicons-home" class="text-gray-400" />
            </template>
          </UInput>
          <template #hint>
            <p v-if="errors.seller" class="text-red-500 text-sm">{{ errors.seller }}</p>
          </template>
        </UFormGroup>

        <UFormGroup label="Kontak Seller (WhatsApp)" required>
          <UInput
            v-model="form.contact_seller"
            placeholder="Contoh: 08123456789"
            :error="!!errors.contact_seller"
            color="green"
          >
            <template #leading>
              <UIcon name="i-heroicons-phone" class="text-gray-400" />
            </template>
          </UInput>
          <template #hint>
            <p v-if="errors.contact_seller" class="text-red-500 text-sm">{{ errors.contact_seller }}</p>
          </template>
        </UFormGroup>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <UButton
          color="gray"
          variant="outline"
          :disabled="isSubmitting"
          @click="handleCancel"
        >
          Batal
        </UButton>
        <UButton
          color="green"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          Simpan Produk
        </UButton>
      </div>
    </template>
  </UCard>
</template>