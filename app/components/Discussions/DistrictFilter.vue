<script setup lang="ts">
import { computed } from 'vue'

interface DistrictItem {
  value: string
  label: string
  province: string
}

interface Props {
  districts: DistrictItem[]
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pilih Kabupaten/Kota',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Writable computed for two-way binding
const selectedDistrict = computed({
  get() {
    if (!props.modelValue) return null
    return props.districts.find(d => d.value === props.modelValue) || null
  },
  set(newValue: DistrictItem | null) {
    emit('update:modelValue', newValue?.value || '')
  }
})
</script>

<template>
  <div class="w-full">
    <USelectMenu
      v-model="selectedDistrict"
      :options="districts"
      option-attribute="label"
      value-attribute="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :ui-menu="{ 
        width: 'w-full',
        height: 'max-h-60'
      }"
      :ui="{ 
        base: 'w-full',
        width: 'w-full',
        height: 'h-auto',
        padding: 'py-3.5 px-4',
        rounded: 'rounded-xl',
        ring: 'focus:ring-4 focus:ring-green-500/10',
        default: {
          size: 'md'
        }
      }"
      class="w-full"
    >
      <template #label>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-gray-400" />
          <span class="truncate">{{ selectedDistrict?.label || placeholder }}</span>
        </div>
      </template>
    </USelectMenu>
  </div>
</template>

<style scoped>
/* Match AppSearchBar styling */
:deep(.ui-select-menu-button) {
  min-height: 50px;
  border-width: 2px;
  border-color: rgb(229 231 235);
  transition: all 0.2s;
}

:deep(.dark .ui-select-menu-button) {
  border-color: rgb(55 65 81);
}

:deep(.ui-select-menu-button:hover) {
  border-color: rgb(34 197 94);
}

:deep(.dark .ui-select-menu-button:hover) {
  border-color: rgb(74 222 128);
}

:deep(.ui-select-menu-button:focus) {
  border-color: rgb(34 197 94);
  ring: 4px;
  ring-color: rgba(34, 197, 94, 0.1);
}

:deep(.dark .ui-select-menu-button:focus) {
  border-color: rgb(74 222 128);
}
</style>
  