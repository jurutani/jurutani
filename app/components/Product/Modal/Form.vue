<script setup lang="ts">
import type { UUID } from 'crypto';
import { ref } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

interface MarketItem {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  price_range?: string;
  attachments?: any; // JSONB type in database
  links?: {
    shopee_link?: string;
    tiktok_link?: string;
    tokopedia_link?: string;
  };
  category?: string;
  seller?: string;
  contact_seller?: string;
  seller_id?: UUID;
}

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  marketItem: {
    type: Object as () => MarketItem,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

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

const form = ref<FormState>({
  name: props.marketItem.name || '',
  description: props.marketItem.description || '',
  price: props.marketItem.price || '',
  price_range: props.marketItem.price_range || '',
  shopee_link: props.marketItem.links?.shopee_link || '',
  tiktok_link: props.marketItem.links?.tiktok_link || '',
  tokopedia_link: props.marketItem.links?.tokopedia_link || '',
  category: props.marketItem.category || '',
  seller: props.marketItem.seller || '',
  contact_seller: props.marketItem.contact_seller || ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Handle image preview from existing data
const imagePreview = ref<string | null>(null)

// If there's existing attachment data, set the preview
if (props.marketItem.attachments && props.marketItem.attachments.url_image) {
  imagePreview.value = supabase.storage.from('markets-attachments')
    .getPublicUrl(props.marketItem.attachments.url_image).data.publicUrl
}

const categories = [
  { value: 'Pupuk', label: 'Pupuk' },
  { value: 'Hasil Pertanian', label: 'Hasil Pertanian' },
  { value: 'Alat Pertanian', label: 'Alat Pertanian' },
  { value: 'Lainnya', label: 'Lainnya' }
]

const validate = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Nama produk wajib diisi'
    return false
  }

  if (!form.value.description.trim()) {
    errors.value.description = 'Deskripsi produk wajib diisi'
    return false
  }

  if (!form.value.category) {
    errors.value.category = 'Kategori wajib dipilih'
    return false
  }

  if (!form.value.seller.trim()) {
    errors.value.seller = 'Nama toko wajib diisi'
    return false
  }

  if (!form.value.contact_seller.trim()) {
    errors.value.contact_seller = 'Kontak seller wajib diisi'
    return false
  }

  // Validate URLs if provided
  const validateUrl = (url: string): boolean => {
    if (!url) return true
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  if (form.value.shopee_link && !validateUrl(form.value.shopee_link)) {
    errors.value.shopee_link = 'Format link Shopee tidak valid'
    return false
  }

  if (form.value.tiktok_link && !validateUrl(form.value.tiktok_link)) {
    errors.value.tiktok_link = 'Format link TikTok tidak valid'
    return false
  }

  if (form.value.tokopedia_link && !validateUrl(form.value.tokopedia_link)) {
    errors.value.tokopedia_link = 'Format link Tokopedia tidak valid'
    return false
  }

  return true
}

const uploadFileToBucket = async (bucket: string, path: string, file: File) => {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true
  })
  if (error) throw error
  return path
}

const handleImageFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    form.value.imageFile = file

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const submitForm = async () => {
  if (!validate()) return
  isSubmitting.value = true

  try {
    const id = props.marketItem.id || crypto.randomUUID()
    let attachmentsData = props.marketItem.attachments || {}

    if (form.value.imageFile) {
      const imagePath = `markets/${id}/${form.value.imageFile.name}`
      await uploadFileToBucket('markets-attachments', imagePath, form.value.imageFile)
      
      // Update attachments JSONB data
      attachmentsData = {
        ...attachmentsData,
        url_image: imagePath
      }
    }

    // Prepare links JSONB data
    const linksData = {
      shopee_link: form.value.shopee_link,
      tiktok_link: form.value.tiktok_link,
      tokopedia_link: form.value.tokopedia_link
    }

    const payload = {
      id,
      name: form.value.name,
      description: form.value.description,
      price: form.value.price ? Number(form.value.price) : null,
      price_range: form.value.price_range,
      attachments: attachmentsData,
      links: linksData,
      category: form.value.category,
      seller: form.value.seller,
      contact_seller: form.value.contact_seller,
      seller_id: props.marketItem?.seller_id ?? null
    }

    const res = await supabase.from('markets').upsert(payload, { onConflict: 'id' })

    if (res.error) throw res.error

    toastStore.success(props.isEdit ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!')
    emit('close')
  } catch (err: any) {
    toastStore.error('Gagal menyimpan produk: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>


<template>
  <UCard class="bg-white dark:bg-gray-800">
    <template #header>
        <div class="!py-0 !my-0 flex items-center gap-2">
          <UIcon
            name="i-heroicons-shopping-bag"
            class="text-green-600 dark:text-green-400 text-xl"
          />
          <h2 class="text-xl font-bold text-green-700 dark:text-green-400">
            {{ props.isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}
          </h2>
        </div>
    </template>

    <form class="space-y-4" @submit.prevent="submitForm">
      <!-- Nama Produk -->
      <UFormGroup label="Nama Produk" required>
        <UInput
          v-model="form.name"
          placeholder="Masukkan nama produk"
          :error="!!errors.name"
          color="green"
        />
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
        />
        <template #hint>
          <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
        </template>
      </UFormGroup>

      <!-- Kategori -->
      <UFormGroup label="Kategori" required>
        <USelect
          v-model="form.category"
          :options="categories"
          placeholder="Pilih kategori"
          :error="!!errors.category"
          color="green"
        />
        <template #hint>
          <p v-if="errors.category" class="text-red-500 text-sm">{{ errors.category }}</p>
        </template>
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

      <!-- Image File -->
      <UFormGroup label="Gambar Produk">
        <input
          type="file"
          accept="image/*"
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          @change="handleImageFileChange"
        >

        <!-- Image Preview -->
        <div v-if="imagePreview" class="mt-3">
          <img :src="imagePreview" alt="Preview" class="h-40 object-cover rounded-md" >
        </div>
      </UFormGroup>

      <!-- Links -->
      <UFormGroup label="Link Marketplace">
        <div class="space-y-3">
          <!-- Shopee Link -->
          <div class="flex items-center">
            <span class="w-28 text-sm">Shopee:</span>
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
          <div class="flex items-center">
            <span class="w-28 text-sm">TikTok Shop:</span>
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
          <div class="flex items-center">
            <span class="w-28 text-sm">Tokopedia:</span>
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
          @click="emit('close')"
        >
          Batal
        </UButton>
        <UButton
          color="green"
          :loading="isSubmitting"
          @click="submitForm"
        >
          {{ props.isEdit ? 'Perbarui' : 'Simpan' }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>