<script setup lang="ts">
import type { UUID } from 'crypto';
import { ref } from 'vue'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()

interface UpdateItem {
  id?: string;
  user_id?: UUID;
  content?: string;
  attachments?: any; // JSONB type in database
}

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  updateItem: {
    type: Object as () => UpdateItem,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

interface FormState {
  content: string;
  imageFile?: File;
}

const form = ref<FormState>({
  content: props.updateItem.content || '',
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Handle image preview from existing data
const imagePreview = ref<string | null>(null)

// If there's existing attachment data, set the preview
if (props.updateItem.attachments && props.updateItem.attachments.url_image) {
  imagePreview.value = supabase.storage.from('updates_attachments')
    .getPublicUrl(props.updateItem.attachments.url_image).data.publicUrl
}

const validate = () => {
  errors.value = {}

  if (!form.value.content.trim()) {
    errors.value.content = 'Konten update wajib diisi'
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
    const id = props.updateItem.id || crypto.randomUUID()
    let attachmentsData = props.updateItem.attachments || {}

    if (form.value.imageFile) {
      const imagePath = `updates/${id}/${form.value.imageFile.name}`
      await uploadFileToBucket('updates_attachments', imagePath, form.value.imageFile)
      
      // Update attachments JSONB data
      attachmentsData = {
        ...attachmentsData,
        url_image: imagePath
      }
    }

    const payload = {
      id,
      user_id: props.updateItem?.user_id ?? null,
      content: form.value.content,
      attachments: attachmentsData
    }

    const res = await supabase.from('updates').upsert(payload, { onConflict: 'id' })

    if (res.error) throw res.error

    toastStore.success(props.isEdit ? 'Update berhasil diperbarui!' : 'Update baru berhasil ditambahkan!')
    emit('close')
  } catch (err: any) {
    toastStore.error('Gagal menyimpan update: ' + err.message)
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
            name="i-heroicons-pencil-square"
            class="text-green-600 dark:text-green-400 text-xl"
          />
          <h2 class="text-xl font-bold text-green-700 dark:text-green-400">
            {{ props.isEdit ? 'Edit Update' : 'Tambah Update Baru' }}
          </h2>
        </div>
    </template>


    <form class="space-y-4" @submit.prevent="submitForm">
      <!-- Konten -->
      <UFormGroup label="Konten Update" required>
        <UTextarea
          v-model="form.content"
          placeholder="Masukkan konten update"
          :ui="{ icon: { trailing: { pointer: false } } }"
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