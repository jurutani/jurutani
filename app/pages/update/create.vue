<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import type { NewsAttachment } from '~/types/news'
import { toastStore } from '~/composables/useJuruTaniToast';

useSeoMeta({
  title: 'Buat Berita Baru',
  description: 'Buat artikel berita baru dengan editor lengkap'
})

const { supabase } = useSupabase()
const { uploadFile } = useAppFileUpload()
const router = useRouter()

const STORAGE_BUCKETS = {
  images: 'news-images',
  attachments: 'news-attachments'
} as const

const { data: categories } = await useAsyncData('category_news', async () => {
  const { data, error } = await supabase
    .from('category_news')
    .select('name, value')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
})

const categoryItems = computed(() => {
  if (!categories.value) return []
  return categories.value.map(cat => ({
    label: cat.name,
    value: cat.value
  }))
})

// Form schema
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_GALLERY_IMAGES = 10
const MAX_ATTACHMENTS = 5

const schema = z.object({
  content: z.string().min(1, 'Konten wajib diisi'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  coverImageFile: z.instanceof(File).optional()
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, 'Ukuran gambar cover maksimal 5MB')
    .refine((file) => !file || file.type.startsWith('image/'), 'File harus berupa gambar'),
  galleryFiles: z.array(z.instanceof(File)).max(MAX_GALLERY_IMAGES, `Maksimal ${MAX_GALLERY_IMAGES} gambar galeri`),
  attachmentFiles: z.array(z.instanceof(File)).max(MAX_ATTACHMENTS, `Maksimal ${MAX_ATTACHMENTS} lampiran`)
})

type Schema = z.output<typeof schema>

// Form state
const state = reactive<Partial<Schema>>({
  content: `# Judul Berita Anda

_Sub judul atau ringkasan singkat_

---

## Isi Berita

Tulis konten berita Anda di sini dengan Markdown...

**Tips Menulis:**
- Gunakan **bold** untuk teks penting
- Gunakan *italic* untuk penekanan
- Gunakan heading (##, ###) untuk sub-bagian
- Tambahkan list dengan tanda -
- Link: [teks](url)`,
  category: '',
  coverImageFile: undefined,
  galleryFiles: [],
  attachmentFiles: []
})

const loading = ref(false)

// File upload handlers
const coverImagePreview = ref<string | null>(null)
const galleryPreviews = ref<string[]>([])

function onCoverImageChange(files: FileList | null) {
  if (!files || files.length === 0) {
    state.coverImageFile = undefined
    coverImagePreview.value = null
    return
  }

  const file = files[0]
  if (file.size > MAX_IMAGE_SIZE) {
    toastStore.error('Ukuran gambar cover maksimal 5MB')
    return
  }

  state.coverImageFile = file
  const reader = new FileReader()
  reader.onload = (e) => {
    coverImagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function onGalleryImagesChange(files: FileList | null) {
  if (!files || files.length === 0) return

  const validFiles: File[] = []
  const previews: string[] = []

  Array.from(files).forEach((file) => {
    if (file.size > MAX_IMAGE_SIZE) {
      toastStore.error(`File ${file.name} terlalu besar (maks 5MB)`)
      return
    }
    if (!file.type.startsWith('image/')) {
      toastStore.error(`File ${file.name} bukan gambar`)
      return
    }
    if (state.galleryFiles!.length + validFiles.length >= MAX_GALLERY_IMAGES) {
      toastStore.error(`Maksimal ${MAX_GALLERY_IMAGES} gambar galeri`)
      return
    }

    validFiles.push(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      previews.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })

  state.galleryFiles = [...(state.galleryFiles || []), ...validFiles]
  setTimeout(() => {
    galleryPreviews.value = [...galleryPreviews.value, ...previews]
  }, 100)
}

function removeGalleryImage(index: number) {
  state.galleryFiles = state.galleryFiles!.filter((_, i) => i !== index)
  galleryPreviews.value = galleryPreviews.value.filter((_, i) => i !== index)
}

function onAttachmentsChange(files: FileList | null) {
  if (!files || files.length === 0) return

  const validFiles: File[] = []

  Array.from(files).forEach((file) => {
    if (file.size > MAX_ATTACHMENT_SIZE) {
      toastStore.error(`File ${file.name} terlalu besar (maks 10MB)`)
      return
    }
    if (state.attachmentFiles!.length + validFiles.length >= MAX_ATTACHMENTS) {
      toastStore.error(`Maksimal ${MAX_ATTACHMENTS} lampiran`)
      return
    }

    validFiles.push(file)
  })

  state.attachmentFiles = [...(state.attachmentFiles || []), ...validFiles]
}

function removeAttachment(index: number) {
  state.attachmentFiles = state.attachmentFiles!.filter((_, i) => i !== index)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Extract title from markdown content
function extractTitle(content: string): string {
  const lines = content.split('\n')
  const titleLine = lines.find(line => line.trim().startsWith('#'))
  if (titleLine) {
    return titleLine.replace(/^#+\s*/, '').trim()
  }
  return 'untitled'
}

// Slug generation
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Form submit
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    // Extract title and generate slug
    const title = extractTitle(event.data.content)
    const slug = generateSlug(title) + '-' + Date.now()

    // Upload cover image
    let coverImagePath: string | null = null
    if (event.data.coverImageFile) {
      const result = await uploadFile(event.data.coverImageFile, {
        bucket: STORAGE_BUCKETS.images,
        folder: `covers/${slug}`,
        maxSizeMB: 5,
        allowedTypes: ['image/*']
      })
      coverImagePath = result.path
    }

    // Upload gallery images
    const imagePaths: string[] = []
    if (event.data.galleryFiles && event.data.galleryFiles.length > 0) {
      for (let i = 0; i < event.data.galleryFiles.length; i++) {
        const file = event.data.galleryFiles[i]
        const result = await uploadFile(file, {
          bucket: STORAGE_BUCKETS.images,
          folder: `gallery/${slug}`,
          maxSizeMB: 5,
          allowedTypes: ['image/*']
        })
        imagePaths.push(result.path)
      }
    }

    // Upload attachments
    const attachments: NewsAttachment[] = []
    if (event.data.attachmentFiles && event.data.attachmentFiles.length > 0) {
      for (const file of event.data.attachmentFiles) {
        const result = await uploadFile(file, {
          bucket: STORAGE_BUCKETS.attachments,
          folder: `attachments/${slug}`,
          maxSizeMB: 10,
          allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
        })
        attachments.push({
          name: file.name,
          url: result.path,
          size: file.size,
          type: file.type
        })
      }
    }

    // Insert to database
    const payload = {
      title: title,
      sub_title: null,
      content: event.data.content.trim(),
      category: event.data.category,
      link: null,
      status_news: 'pending',
      cover_image: coverImagePath,
      images: imagePaths,
      attachments: attachments,
      slug: slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('news_updated')
      .insert([payload])
      .select()
      .single()

    if (error) throw error

    toastStore.success('Berita berhasil dibuat! Menunggu persetujuan admin.')
    router.push(`/update/${data.slug}`)
  } catch (error) {
    console.error('Error creating news:', error)
    toastStore.error('Gagal membuat berita. Silakan coba lagi.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Buat Berita Baru</h1>
      <p class="text-muted">Tulis artikel berita dengan Markdown. Judul otomatis diambil dari heading pertama.</p>
    </div>

    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <UFormField label="Judul Berita" name="title" required>
        <UInput v-model="state.title" placeholder="# Judul Berita di sini..." class="w-full" size="lg"/>
      </UFormField>

      <UFormField label="Sub Judul Berita" name="sub_title" required>
        <UInput v-model="state.sub_title" placeholder="# Sub Judul Berita di sini..." class="w-full" size="lg"/>
      </UFormField>

      <UFormField label="Gambar Cover" name="coverImageFile" hint="Maksimal 5MB">
        <UFileUpload
          accept="image/*"
          :max-size="MAX_IMAGE_SIZE"
          :show-preview="true"
          :preview-url="coverImagePreview"
          @change="onCoverImageChange"
          class="w-96 min-h-48"
        />
      </UFormField>

      <UFormField label="Konten Berita" name="content" required hint="Silakan masukan konten berita ...">
        <CommonRichTextEditor 
          v-model="state.content"
          placeholder="# Judul Berita di sini..."
        />
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Kategori" name="category" required>
          <USelect :items="categoryItems" placeholder="Pilih kategori" class="w-full" />
        </UFormField>
        <UFormField label="Link Referensi" name="link">
          <UInput v-model="state.link" placeholder="https://contoh.com/berita-referensi" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Galeri Foto" name="galleryFiles" :hint="`Maksimal ${MAX_GALLERY_IMAGES} gambar, 5MB per gambar`">
        <UFileUpload
          accept="image/*"
          multiple
          :max-size="MAX_IMAGE_SIZE"
          :show-preview="true"
          :preview-urls="galleryPreviews"
          @change="onGalleryImagesChange"
          class="w-full min-h-48"
        />
        <div v-if="state.galleryFiles && state.galleryFiles.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(file, index) in state.galleryFiles" :key="index" class="relative">
            <img :src="galleryPreviews[index]" alt="Gallery Image" class="w-full h-32 object-cover rounded">
            <button
              type="button"
              class="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
              @click="removeGalleryImage(index)"
            >
              <UIcon name="i-lucide-x" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </UFormField>

      <UFormField label="Lampiran" name="attachmentFiles" :hint="`Maksimal ${MAX_ATTACHMENTS} file, 10MB per file (PDF, DOC, DOCX, XLS, XLSX)`">
        <UFileUpload
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          multiple
          :max-size="MAX_ATTACHMENT_SIZE"
          @change="onAttachmentsChange"
          class="w-full min-h-48"
        />
        <ul v-if="state.attachmentFiles && state.attachmentFiles.length > 0" class="mt-4 space-y-2">
          <li v-for="(file, index) in state.attachmentFiles" :key="index" class="flex items-center justify-between p-2 border rounded">
            <div>
              <UIcon name="i-lucide-paperclip" class="w-4 h-4 inline-block mr-2" />
              {{ file.name }} ({{ formatFileSize(file.size) }})
            </div>
            <button
              type="button"
              class="p-1 text-red-500 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
              @click="removeAttachment(index)"
            >
              <UIcon name="i-lucide-x" class="w-4 h-4" />
            </button>
          </li>
        </ul>
      </UFormField>

      <div class="flex gap-3 pt-4">
        <UButton type="submit" size="lg" :loading="loading" :disabled="loading">
          <UIcon name="i-lucide-send" class="w-4 h-4" />
          Kirim Berita
        </UButton>
        <UButton color="neutral" variant="soft" size="lg" :to="'/update'">
          <UIcon name="i-lucide-x" class="w-4 h-4" />
          Batal
        </UButton>
      </div>
    </UForm>
  </div>
</template>