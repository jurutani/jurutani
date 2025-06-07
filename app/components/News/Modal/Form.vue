<script setup lang="ts">
import type { UUID } from 'crypto'
import { ref, computed } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

// Types
interface NewsItem {
  id?: string
  title?: string
  sub_title?: string
  content?: string
  category?: string
  status_news?: string
  link?: string
  published_at?: string
  image_url?: string
  attachment_url?: string
  user_id?: UUID
}

interface FormState {
  title: string
  sub_title: string
  content: string
  category: string
  status_news: string
  link: string
  publishDate: string
  imageFile?: File
  attachmentFile?: File
}

// Props & Emits
const props = defineProps<{
  isEdit?: boolean
  newsItem?: NewsItem
}>()

const emit = defineEmits<{
  close: []
}>()

// Constants
const CATEGORIES = [
  { value: 'Pertanian', label: 'Pertanian' },
  { value: 'Edukasi', label: 'Edukasi' },
  { value: 'Pupuk', label: 'Pupuk' },
  { value: 'Tokoh', label: 'Tokoh' },
  { value: 'Teknologi', label: 'Teknologi' },
  { value: 'Lainnya', label: 'Lainnya' }
] as const

const STORAGE_BUCKETS = {
  images: 'news-images',
  attachments: 'news-attachments'
} as const

// Reactive State
const form = ref<FormState>({
  title: props.newsItem?.title || '',
  sub_title: props.newsItem?.sub_title || '',
  content: props.newsItem?.content || '',
  category: props.newsItem?.category || '',
  status_news: props.newsItem?.status_news || 'pending',
  link: props.newsItem?.link || '',
  publishDate: props.newsItem?.published_at?.split('T')[0] || ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Computed
const imagePreview = ref<string | null>(
  props.newsItem?.image_url
    ? supabase.storage.from(STORAGE_BUCKETS.images).getPublicUrl(props.newsItem.image_url).data.publicUrl
    : null
)

const currentAttachmentName = computed(() => {
  if (form.value.attachmentFile) return form.value.attachmentFile.name
  if (props.newsItem?.attachment_url) {
    return props.newsItem.attachment_url.split('/').pop() || ''
  }
  return ''
})

// Validation
const validateForm = (): boolean => {
  errors.value = {}

  const validationRules = [
    {
      condition: !form.value.title.trim(),
      field: 'title',
      message: 'Judul berita wajib diisi'
    },
    {
      condition: !form.value.content.trim(),
      field: 'content',
      message: 'Konten berita wajib diisi'
    },
    {
      condition: form.value.link && !isValidUrl(form.value.link),
      field: 'link',
      message: 'Format link tidak valid'
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

const generateFilePath = (id: string, fileName: string, folder: string): string => {
  const timestamp = Date.now()
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${folder}/${id}/${timestamp}_${cleanFileName}`
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

const handleAttachmentUpload = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    toastStore.error('Ukuran file maksimal 10MB')
    return
  }

  form.value.attachmentFile = file
}

// Form Submission
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const newsId = props.newsItem?.id || crypto.randomUUID()
    let imageUrl = props.newsItem?.image_url || ''
    let attachmentUrl = props.newsItem?.attachment_url || ''

    // Upload image if new file selected
    if (form.value.imageFile) {
      const imagePath = generateFilePath(
        newsId, 
        form.value.imageFile.name, 
        'images'
      )
      imageUrl = await uploadFile(STORAGE_BUCKETS.images, imagePath, form.value.imageFile)
    }

    // Upload attachment if new file selected
    if (form.value.attachmentFile) {
      const attachmentPath = generateFilePath(
        newsId, 
        form.value.attachmentFile.name, 
        'attachments'
      )
      attachmentUrl = await uploadFile(STORAGE_BUCKETS.attachments, attachmentPath, form.value.attachmentFile)
    }

    // Prepare payload
    const payload = {
      id: newsId,
      title: form.value.title.trim(),
      sub_title: form.value.sub_title.trim() || null,
      content: form.value.content.trim(),
      category: form.value.category || null,
      status_news: form.value.status_news,
      link: form.value.link.trim() || null,
      image_url: imageUrl || null,
      attachment_url: attachmentUrl || null,
      user_id: props.newsItem?.user_id || null,
      published_at: form.value.publishDate || null
    }

    const { error } = await supabase
      .from('news')
      .upsert(payload, { onConflict: 'id' })

    if (error) throw error

    const successMessage = props.isEdit 
      ? 'Berita berhasil diperbarui!' 
      : 'Berita baru berhasil ditambahkan!'
    
    toastStore.success(successMessage)
    emit('close')

  } catch (error: any) {
    console.error('Error saving news:', error)
    toastStore.error(`Gagal menyimpan berita: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = (): void => {
  emit('close')
}
</script>

<template>
  <UCard class="bg-white dark:bg-gray-800">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-newspaper"
          class="text-green-600 dark:text-green-400 text-xl"
        />
        <h2 class="text-xl font-bold text-green-700 dark:text-green-400">
          {{ isEdit ? 'Edit Berita' : 'Tambah Berita Baru' }}
        </h2>
      </div>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Title -->
      <UFormGroup label="Judul Berita" required>
        <UInput
          v-model="form.title"
          placeholder="Masukkan judul berita"
          :error="!!errors.title"
          color="green"
          size="md"
        >
          <template #trailing>
            <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="text-gray-400" />
          </template>
        </UInput>
        <template #hint>
          <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
        </template>
      </UFormGroup>

      <!-- Subtitle -->
      <UFormGroup label="Sub Judul">
        <UInput
          v-model="form.sub_title"
          placeholder="Masukkan sub judul berita (opsional)"
          color="green"
        />
      </UFormGroup>

      <!-- Category -->
      <UFormGroup label="Kategori">
        <USelect
          v-model="form.category"
          :options="CATEGORIES"
          placeholder="Pilih kategori"
          color="green"
        />
      </UFormGroup>

      <!-- Content -->
      <UFormGroup label="Konten Berita" required>
        <UTextarea
          v-model="form.content"
          placeholder="Masukkan konten berita"
          :error="!!errors.content"
          :rows="4"
          color="green"
          class="resize-y"
        >
          <template #trailing>
            <UIcon name="i-heroicons-document-text" class="text-gray-400" />
          </template>
        </UTextarea>
        <template #hint>
          <p v-if="errors.content" class="text-red-500 text-sm">{{ errors.content }}</p>
        </template>
      </UFormGroup>

      <!-- Link -->
      <UFormGroup label="Link Referensi">
        <UInput
          v-model="form.link"
          placeholder="https://contoh.com/artikel (opsional)"
          :error="!!errors.link"
          color="green"
        >
          <template #trailing>
            <UIcon name="i-heroicons-link" class="text-gray-400" />
          </template>
        </UInput>
        <template #hint>
          <p v-if="errors.link" class="text-red-500 text-sm">{{ errors.link }}</p>
        </template>
      </UFormGroup>

      <!-- Image Upload -->
      <UFormGroup label="Gambar Berita">
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

      <!-- Attachment Upload -->
      <UFormGroup label="Lampiran">
        <input
          type="file"
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          @change="handleAttachmentUpload"
        >
        
        <template #hint>
          <div class="flex flex-col gap-1">
            <p v-if="currentAttachmentName" class="text-sm text-gray-600 dark:text-gray-400">
              File: {{ currentAttachmentName }}
            </p>
            <p class="text-xs text-gray-500">Maksimal 10MB</p>
          </div>
        </template>
      </UFormGroup>
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
          {{ isEdit ? 'Perbarui Berita' : 'Simpan Berita' }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>