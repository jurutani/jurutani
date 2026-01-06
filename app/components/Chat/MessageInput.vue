<script setup lang="ts">
interface Props {
  modelValue: string
  loading?: boolean
  uploadingImage?: boolean
  disabled?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  uploadingImage: false,
  disabled: false,
  placeholder: 'Ketik pesan...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  uploadImage: []
}>()

const messageValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isValid = computed(() => {
  return messageValue.value.trim().length > 0 && messageValue.value.trim().length <= 1000
})

const handleSend = () => {
  if (isValid.value && !props.loading && !props.uploadingImage) {
    emit('send')
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <div class="flex gap-3">
      <!-- Image upload button -->
      <UButton
        icon="i-heroicons-photo"
        color="neutral"
        variant="ghost"
        size="lg"
        :disabled="uploadingImage || disabled"
        @click="$emit('uploadImage')"
      />
      
      <!-- Text input -->
      <UInput
        v-model="messageValue"
        :placeholder="placeholder"
        :disabled="loading || uploadingImage || disabled"
        class="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
        size="lg"
        @keypress="handleKeyPress"
      />
      
      <!-- Send button -->
      <UButton
        :disabled="!isValid || loading || uploadingImage || disabled"
        :loading="loading"
        icon="i-heroicons-paper-airplane"
        size="lg"
        color="success"
        @click="handleSend"
      >
        Kirim
      </UButton>
    </div>
  </div>
</template>
