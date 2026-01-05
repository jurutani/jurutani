<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: 'danger' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Konfirmasi',
  message: 'Apakah Anda yakin?',
  confirmText: 'Hapus',
  cancelText: 'Batal',
  loading: false,
  variant: 'danger'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  showModal.value = false
}

const iconName = computed(() => {
  return props.variant === 'danger' ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-exclamation-circle'
})

const iconColor = computed(() => {
  return props.variant === 'danger' ? 'text-red-500' : 'text-yellow-500'
})

const bgColor = computed(() => {
  return props.variant === 'danger' 
    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
})

const textColor = computed(() => {
  return props.variant === 'danger'
    ? 'text-red-700 dark:text-red-300'
    : 'text-yellow-700 dark:text-yellow-300'
})
</script>

<template>
  <UModal v-model:open="showModal">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon 
          :name="iconName"
          :class="['w-6 h-6', iconColor]"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-300">
          {{ message }}
        </p>
        
        <div :class="['border rounded-lg p-3', bgColor]">
          <div class="flex items-start gap-2">
            <UIcon 
              :name="iconName"
              :class="['w-5 h-5 mt-0.5 flex-shrink-0', iconColor]"
            />
            <div :class="['text-sm', textColor]">
              <p class="font-medium mb-1">Tindakan ini tidak dapat dibatalkan!</p>
              <p>Pastikan Anda yakin sebelum melanjutkan.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </UButton>
        <UButton
          color="error"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
