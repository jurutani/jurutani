<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  showActionButton?: boolean
  actionButtonLabel?: string
  actionButtonIcon?: string
  actionButtonColor?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  actionButtonLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  backTo: '/discussions',
  backLabel: 'Kembali ke Diskusi',
  showActionButton: true,
  actionButtonLabel: 'Chat Baru',
  actionButtonIcon: 'i-heroicons-plus',
  actionButtonColor: 'success',
  actionButtonLoading: false
})

const emit = defineEmits<{
  action: []
}>()

const handleAction = () => {
  emit('action')
}
</script>

<template>
  <div class="flex items-center justify-between p-4 border-b border-green-200 dark:border-green-800 bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 sticky top-0 z-10">
    <div class="flex items-center gap-3">
      <NuxtLink 
        :to="backTo" 
        class="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
        :aria-label="backLabel"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-6 h-6 text-green-600 dark:text-green-400" />
      </NuxtLink>
      
      <div>
        <h1 class="text-2xl font-bold text-green-800 dark:text-green-300">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-green-600 dark:text-green-400">{{ subtitle }}</p>
      </div>
    </div>
    
    <UButton
      v-if="showActionButton"
      :icon="actionButtonIcon"
      :color="actionButtonColor"
      :loading="actionButtonLoading"
      @click="handleAction"
    >
      {{ actionButtonLabel }}
    </UButton>
  </div>
</template>
