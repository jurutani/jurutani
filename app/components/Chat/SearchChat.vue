<!-- components/chat/ChatSearch.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Cari...',
  size: 'lg',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="p-4 border-b border-gray-200">
    <UInput
      v-model="searchValue"
      :placeholder="placeholder"
      icon="i-heroicons-magnifying-glass"
      :size="size"
      :loading="loading"
      class="w-full"
    />
  </div>
</template>