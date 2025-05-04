<script setup lang="ts">
import type { UUID } from 'crypto';
import { ref } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

interface NewsItem {
  id?: string;
  title?: string;
  sub_title?: string;
  content?: string;
  category?: string;
  status_news?: string;
  link?: string;
  published_at?: string;
  imageUrl?: string;
  attachments?: string;
  author_id?: UUID;
}

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  newsItem: {
    type: Object as () => NewsItem,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

interface FormState {
  title: string;
  sub_title: string;
  content: string;
  category: string;
  status_news: string;
  link: string;
  publishDate: string;
  imageFile?: File;
  attachmentFile?: File;
}

const form = ref<FormState>({
  title: props.newsItem.title || '',
  sub_title: props.newsItem.sub_title || '',
  content: props.newsItem.content || '',
  category: props.newsItem.category || '',
  status_news: props.newsItem.status_news || 'pending',
  link: props.newsItem.link || '',
  publishDate: props.newsItem.published_at?.split('T')[0] || '',
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const imagePreview = ref<string | null>(
  props.newsItem.imageUrl
    ? supabase.storage.from('news-images').getPublicUrl(props.newsItem.imageUrl).data.publicUrl
    : null
)

const categories = [
  { value: 'Pertanian', label: 'Pertanian' },
  { value: 'Edukasi', label: 'Edukasi' },
  { value: 'Pupuk', label: 'Pupuk' },
  { value: 'Tokoh', label: 'Tokoh' },
  { value: 'Teknologi', label: 'Teknologi' },
  { value: 'Lainnya', label: 'Lainnya' }
]

const validate = () => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Judul berita wajib diisi'
    return false
  }

  if (!form.value.content.trim()) {
    errors.value.content = 'Konten berita wajib diisi'
    return false
  }

  if (form.value.link && !isValidUrl(form.value.link)) {
    errors.value.link = 'Format link tidak valid'
    return false
  }

  return true
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

const handleAttachmentFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    form.value.attachmentFile = file
  }
}

const submitForm = async () => {
  if (!validate()) return
  isSubmitting.value = true

  try {
    const id = props.newsItem.id || crypto.randomUUID()
    let imageUrl = props.newsItem.imageUrl || ''
    let attachmentUrl = props.newsItem.attachments || ''

    if (form.value.imageFile) {
      const imagePath = `news-images/${id}/${form.value.imageFile.name}`
      await uploadFileToBucket('news-images', imagePath, form.value.imageFile)
      imageUrl = imagePath
    }

    if (form.value.attachmentFile) {
      const attachmentPath = `news-attachments/${id}/${form.value.attachmentFile.name}`
      await uploadFileToBucket('news-attachments', attachmentPath, form.value.attachmentFile)
      attachmentUrl = attachmentPath
    }

    const payload = {
      id,
      title: form.value.title,
      sub_title: form.value.sub_title,
      content: form.value.content,
      category: form.value.category,
      status_news: form.value.status_news,
      link: form.value.link,
      image_url: imageUrl,
      attachments: attachmentUrl,
      author_id: props.newsItem?.author_id ?? null
    }

    const res = await supabase.from('news').upsert(payload, { onConflict: 'id' })

    if (res.error) throw res.error

    toastStore.success(props.isEdit ? 'Berita berhasil diperbarui!' : 'Berita baru berhasil ditambahkan!')
    emit('close')
  } catch (err: any) {
    toastStore.error('Gagal menyimpan berita: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>


<template>
  <UCard class=" bg-white dark:bg-gray-800">
    <template #header>
        <div class="!py-0 !my-0 flex items-center gap-2">
          <UIcon
            name="i-heroicons-newspaper"
            class="text-green-600 dark:text-green-400 text-xl"
          />
          <h2 class="text-xl font-bold text-green-700 dark:text-green-400">
            {{ props.isEdit ? 'Edit Berita' : 'Tambah Berita Baru' }}
          </h2>
        </div>
    </template>


    <form class="space-y-4" @submit.prevent="submitForm">
      <!-- Judul -->
      <UFormGroup label="Judul Berita" required>
        <UInput
          v-model="form.title"
          placeholder="Masukkan judul berita"
          :ui="{ icon: { trailing: { pointer: false } } }"
          :error="!!errors.title"
          color="green"
          size="md"
        >
          <template #trailing>
            <UIcon name="i-heroicons-chat-bubble-bottom" class="text-gray-400" />
          </template>
        </UInput>
        <template #hint>
          <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
        </template>
      </UFormGroup>

      <!-- Sub Judul -->
      <UFormGroup label="Sub Judul">
        <UInput
          v-model="form.sub_title"
          placeholder="Masukkan sub judul berita (opsional)"
          color="green"
        />
      </UFormGroup>

      <!-- Kategori -->
      <UFormGroup label="Kategori">
        <USelect
          v-model="form.category"
          :options="categories"
          placeholder="Pilih kategori"
          color="green"
        />
      </UFormGroup>

      <!-- Konten -->
      <UFormGroup label="Konten Berita" required>
        <UTextarea
          v-model="form.content"
          placeholder="Masukkan konten berita"
          :ui="{ icon: { trailing: { pointer: false } } }"
          :error="!!errors.content"
          :rows="3"
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
      <UFormGroup label="Link">
        <UInput
          v-model="form.link"
          placeholder="https://contoh.com/artikel (opsional)"
          :ui="{ icon: { trailing: { pointer: false } } }"
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

      <!-- Image File -->
      <UFormGroup label="Gambar">
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

      <!-- Attachment File -->
      <UFormGroup label="Lampiran">
        <input
          type="file"
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          @change="handleAttachmentFileChange"
        >

        <template #hint>
          <p v-if="form.attachmentFile" class="text-sm text-gray-600 dark:text-gray-400">
            {{ form.attachmentFile.name }}
          </p>
        </template>
      </UFormGroup>

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