<script setup lang="ts">
defineProps<{
  isExpanded: boolean
  onToggleExpand: () => void
  onClose: () => void
}>()
</script>

<template>
  <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-green-500 text-white p-4 flex items-center justify-between z-10">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
        <NuxtImg 
          src="/jurutani.png" 
          alt="Chatbot" 
          class="w-5 h-5"
        />
      </div>
      <div>
        <h3 class="font-semibold text-sm">JuruTani </h3>
        <p class="text-xs text-green-100">Penyuluh JuruTani</p>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <UButton
        :icon="isExpanded ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
        color="neutral"
        variant="ghost"
        size="xs"
        class="hover:bg-white/20"
        @click="onToggleExpand"
      />
      <UButton
        icon="i-heroicons-x-mark"
        color="neutral"
        variant="ghost"
        size="xs"
        class="hover:bg-white/20"
        @click="onClose"
      />
    </div>
  </div>
</template>
