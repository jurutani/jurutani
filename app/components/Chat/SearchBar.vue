<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  resultCount?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Cari conversation dengan petani atau ahli...',
  resultCount: 0,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClear = () => {
  searchValue.value = ''
  emit('clear')
}
</script>

<template>
  <div class="p-4 border-b border-green-100 dark:border-gray-700 bg-green-25 dark:bg-gray-800">
    <UInput
      v-model="searchValue"
      :placeholder="placeholder"
      icon="i-heroicons-magnifying-glass"
      size="lg"
      color="success"
      variant="outline"
      class="w-full [&_svg]:text-green-500 dark:[&_svg]:text-green-400"
      :loading="loading"
    />
    
    <div v-if="searchValue.trim()" class="mt-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>{{ resultCount }} conversation ditemukan</span>
      <UButton
        variant="ghost"
        size="xs"
        color="neutral"
        @click="handleClear"
      >
        Bersihkan
      </UButton>
    </div>
  </div>
</template>
