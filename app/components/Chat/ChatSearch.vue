<!-- components/chat/ChatSearch.vue -->
<template>
  <div class="p-4 border-b border-green-100 bg-green-25">
    <UInput
      :model-value="searchQuery"
      @update:model-value="$emit('update:searchQuery', $event)"
      placeholder="Cari conversation dengan petani atau ahli..."
      icon="i-heroicons-magnifying-glass"
      size="lg"
      color="green"
      variant="outline"
      class="w-full"
      :ui="{
        icon: { trailing: { pointer: '' } },
        base: 'border-green-200 focus:border-green-400 focus:ring-green-400'
      }"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string
}

defineProps<Props>()
defineEmits(['update:searchQuery'])
</script>