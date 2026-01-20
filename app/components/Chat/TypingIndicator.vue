<script setup lang="ts">
interface Props {
  partnerName?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 text-sm">
    <div class="flex items-center gap-1">
      <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0ms" />
      <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 150ms" />
      <span class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 300ms" />
    </div>
    <span class="text-xs font-medium">
      {{ partnerName || 'Partner' }} sedang mengetik...
    </span>
  </div>
</template>
