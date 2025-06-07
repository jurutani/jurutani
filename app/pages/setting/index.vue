<template>
  <div class="max-w-md mx-auto mt-16 px-4">
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Ganti Email</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Email baru memerlukan konfirmasi via email.
        </p>
      </template>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <UFormGroup label="Email Baru" name="email">
            <UInput
              v-bind="componentField"
              type="email"
              placeholder="nama@email.com"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            />
            <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
          </UFormGroup>
        </FormField>

        <UButton type="submit" :loading="isSubmitting" class="w-full">
          Kirim Link Konfirmasi
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useForm, FormField, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useSupabase } from '@/composables/useSupabase'
import { toastStore } from '@/composables/useJuruTaniToast'

const { supabase } = useSupabase()

const schema = yup.object({
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
})

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit(async (values) => {
  const { error } = await supabase.auth.updateUser({ email: values.email })

  if (error) {
    toastStore.error(error.message || 'Gagal mengubah email')
  } else {
    toastStore.success('Link konfirmasi dikirim ke email baru. Silakan cek kotak masuk Anda.')
  }
})
</script>
