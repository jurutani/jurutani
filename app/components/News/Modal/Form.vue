<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'
import { useProfile } from '~/composables/useProfile'
// import { useFileUpload } from '~/composables/useFileUpload' // Removed, auto-imported as useAppFileUpload

const { supabase } = useSupabase()
const { userData, fetchUserData } = useProfile()
const { uploadFile } = useAppFileUpload()

// Types
interface Category {
  name: string
}

// Constants
const STORAGE_BUCKETS = {
  images: 'news-images',
  attachments: 'news-attachments'
} as const

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024 // 10MB

// Fetch categories
const { data: CATEGORY } = await useAsyncData('category_news', async () => {
  try {
    const { data, error: catError } = await supabase
      .from('category_news')
      .select('name')
      .order('name', { ascending: true })

    if (catError) throw catError
    
    return data as Category[]
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
})

// Transform categories for USelect
const categoryItems = computed(() => {
  if (!CATEGORY.value) return []
  
  return CATEGORY.value.map(cat => ({
    label: cat.name,
    value: cat.name
  }))
})

// Props
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Zod Schema
const schema = z.object({
  title: z.string().min(1, 'Judul berita wajib diisi'),
  sub_title: z.string().optional(),
  content: z.string().min(1, 'Konten berita wajib diisi'),
  category: z.string().optional(),
  link: z.string().url('Format link tidak valid').optional().or(z.literal('')),
  imageFile: z.instanceof(File).optional()
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
      message: 'Ukuran gambar maksimal 5MB'
    })
    .refine((file) => !file || file.type.startsWith('image/'), {
      message: 'File harus berupa gambar'
    }),
  attachmentFile: z.instanceof(File).optional()
    .refine((file) => !file || file.size <= MAX_ATTACHMENT_SIZE, {
      message: 'Ukuran file maksimal 10MB'
    })
})

type Schema = z.output<typeof schema>

// Form State
const state = reactive<Partial<Schema>>({
  title: '',
  sub_title: '',
  content: '',
  category: '',
  link: '',
  imageFile: undefined,
  attachmentFile: undefined
})

const isSubmitting = ref(false)

// Check user authentication
const checkUserAuth = (): boolean => {
  if (!userData.value) {
    toastStore.error('Login dulu')
    showModal.value = false
    navigateTo('/auth/login')
    return false
  }
  return true
}

// Form Submission
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Check authentication first
  if (!checkUserAuth()) return

  isSubmitting.value = true

  try {
    const newsId = crypto.randomUUID()
    let imageUrl = ''
    let attachmentUrl = ''

    // Upload image if file selected
    if (event.data.imageFile) {
      const result = await uploadFile(event.data.imageFile, {
        bucket: STORAGE_BUCKETS.images,
        folder: 'images',
        maxSizeMB: 5,
        allowedTypes: ['image/*']
      })
      imageUrl = result.path
    }

    // Upload attachment if file selected
    if (event.data.attachmentFile) {
      const result = await uploadFile(event.data.attachmentFile, {
        bucket: STORAGE_BUCKETS.attachments,
        folder: 'attachments',
        maxSizeMB: 10,
        allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      })
      attachmentUrl = result.path
    }

    // Prepare payload for insert
    const payload = {
      id: newsId,
      title: event.data.title.trim(),
      sub_title: event.data.sub_title?.trim() || null,
      content: event.data.content.trim(),
      category: event.data.category || null,
      status_news: 'pending',
      link: event.data.link?.trim() || null,
      image_url: imageUrl || null,
      attachment_url: attachmentUrl || null,
      user_id: userData.value.id,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert new record
    const { error } = await supabase
      .from('news')
      .insert(payload)

    if (error) throw error

    toastStore.success('Berita baru berhasil ditambahkan!')
    showModal.value = false

  } catch (error: any) {
    console.error('Error saving news:', error)
    toastStore.error(`Gagal menyimpan berita: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = (): void => {
  showModal.value = false
}

// Initialize component
onMounted(async () => {
  await fetchUserData()
})
</script>

<template>
  <UModal
    v-model:open="showModal"
    title="Tambah Berita Baru"
    description="Isi formulir di bawah untuk menambahkan berita baru"
  >
    <template #body>
      <UForm id="news-form" :schema="schema" :state="state" class="space-y-5" @submit="onSubmit">
        <!-- Title -->
        <UFormField label="Judul Berita" name="title" required>
          <UInput
            v-model="state.title"
            placeholder="Masukkan judul berita"
            size="lg"
            icon="i-lucide-heading-1"
            class="w-full"
          />
        </UFormField>
    
        <!-- Subtitle -->
        <UFormField label="Sub Judul" name="sub_title">
          <UInput
            v-model="state.sub_title"
            placeholder="Masukkan sub judul berita (opsional)"
            size="lg"
            icon="i-lucide-subtitles"
            class="w-full"
          />
        </UFormField>
    
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Category -->
          <UFormField label="Kategori" name="category">
            <USelect
              v-model="state.category"
              :items="categoryItems"
              placeholder="Pilih kategori"
              size="lg"
              icon="i-lucide-tag"
              class="w-full"
            />
          </UFormField>

          <!-- Link -->
          <UFormField label="Link Referensi" name="link">
            <UInput
              v-model="state.link"
              placeholder="https://contoh.com/artikel (opsional)"
              size="lg"
              icon="i-lucide-link"
              class="w-full"
            />
          </UFormField>
        </div>
    
        <!-- Content -->
        <UFormField label="Konten Berita" name="content" required>
          <UTextarea
            v-model="state.content"
            placeholder="Masukkan konten berita"
            :rows="6"
            size="lg"
            autoresize
            icon="i-lucide-file-text"
            class="w-full"
          />
        </UFormField>
    
        <!-- Image Upload -->
        <UFormField 
          label="Gambar Berita" 
          name="imageFile"
          description="Format: JPG, PNG, GIF. Maksimal 5MB"
        >
          <UFileUpload
            v-model="state.imageFile"
            accept="image/*"
            class="min-h-48 w-full"
          />
        </UFormField>
    
        <!-- Attachment Upload -->
        <UFormField 
          label="Lampiran" 
          name="attachmentFile"
          description="Format: PDF, DOC, DOCX. Maksimal 10MB"
        >
          <UFileUpload
            v-model="state.attachmentFile"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            class="min-h-32 w-full"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          :disabled="isSubmitting"
          @click="handleCancel"
        >
          <UIcon name="i-heroicons-x-mark" class="mr-1" />
          Batal
        </UButton>
        <UButton
          type="submit"
          color="success"
          size="lg"
          :loading="isSubmitting"
          form="news-form"
        >
          <UIcon name="i-heroicons-check" class="mr-1" />
          Simpan Berita
        </UButton>
      </div>
    </template>
  </UModal>
</template>