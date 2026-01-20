<script setup lang="ts">
interface Props {
  loading?: boolean
  uploadingImage?: boolean
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'send': []
  'uploadImage': []
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const isFocused = ref(false)

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const canSend = computed(() => {
  return localValue.value.trim().length > 0 && !props.loading
})

const characterCount = computed(() => localValue.value.length)
const maxCharacters = 1000

const handleSend = () => {
  if (canSend.value) {
    emit('send')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  // Send on Enter, new line on Shift+Enter
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// Auto-resize textarea
watch(localValue, () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
    }
  })
})
</script>

<template>
  <div class="p-4 bg-white dark:bg-gray-900">
    <div 
      :class="[
        'flex items-end gap-2 p-3 rounded-2xl border-2 transition-all duration-200',
        isFocused 
          ? 'border-green-500 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10' 
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
      ]"
    >
      <!-- Image Upload Button -->
      <UButton
        icon="i-heroicons-photo"
        color="neutral"
        variant="ghost"
        size="sm"
        :loading="uploadingImage"
        :disabled="loading"
        class="shrink-0"
        @click="emit('uploadImage')"
      />

      <!-- Textarea Input -->
      <div class="flex-1 min-w-0">
        <textarea
          ref="textareaRef"
          v-model="localValue"
          placeholder="Ketik pesan..."
          rows="1"
          :maxlength="maxCharacters"
          :disabled="loading"
          class="w-full resize-none bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-[15px] leading-relaxed max-h-32 overflow-y-auto"
          @keydown="handleKeydown"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        
        <!-- Character Counter -->
        <div 
          v-if="characterCount > maxCharacters * 0.8" 
          class="text-[11px] text-gray-500 dark:text-gray-400 mt-1"
        >
          {{ characterCount }}/{{ maxCharacters }}
        </div>
      </div>

      <!-- Send Button -->
      <UButton
        icon="i-heroicons-paper-airplane"
        :color="canSend ? 'success' : 'neutral'"
        :variant="canSend ? 'solid' : 'ghost'"
        size="sm"
        :loading="loading"
        :disabled="!canSend"
        class="shrink-0 transition-all duration-200"
        :class="canSend ? 'scale-110' : 'scale-100'"
        @click="handleSend"
      />
    </div>
    
    <!-- Helper Text -->
    <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-2 px-1">
      Tekan <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">Enter</kbd> untuk kirim, 
      <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">Shift+Enter</kbd> untuk baris baru
    </p>
  </div>
</template>
