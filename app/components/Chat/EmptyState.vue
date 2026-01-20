<script setup lang="ts">
interface Props {
  searchQuery?: string
  showFeatures?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  showFeatures: true
})

const emit = defineEmits<{
  startNewChat: []
  clearSearch: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-gray-500 dark:text-gray-400">
    <div class="text-center max-w-md">
      <!-- Agricultural themed icon -->
      <div class="relative mb-6">
        <UIcon 
          name="i-heroicons-chat-bubble-left-right" 
          class="w-20 h-20 text-green-200 dark:text-green-800 mx-auto"
        />
        <UIcon 
          name="i-heroicons-sparkles" 
          class="w-8 h-8 text-green-400 dark:text-green-500 absolute -top-2 -right-2 animate-pulse"
        />
      </div>
      
      <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">
        {{ searchQuery ? 'Conversation tidak ditemukan' : 'Selamat datang di JuruTani Chat!' }}
      </h3>
      
      <p class="text-green-600 dark:text-green-400 mb-6 leading-relaxed">
        {{ searchQuery 
          ? `Tidak ada conversation dengan "${searchQuery}". Coba kata kunci lain atau mulai chat baru.`
          : 'Mulai konsultasi dengan ahli pertanian, penyuluh, atau sesama petani. Dapatkan solusi terbaik untuk pertanian Anda!' 
        }}
      </p>
      
      <!-- Features highlight -->
      <div v-if="!searchQuery && showFeatures" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
        <div class="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <UIcon name="i-heroicons-academic-cap" class="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
          <span class="text-green-700 dark:text-green-300 font-medium">Konsultasi Ahli</span>
        </div>
        <div class="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <UIcon name="i-heroicons-megaphone" class="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
          <span class="text-blue-700 dark:text-blue-300 font-medium">Tips Penyuluh</span>
        </div>
        <div class="flex flex-col items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
          <UIcon name="i-heroicons-users" class="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
          <span class="text-amber-700 dark:text-amber-300 font-medium">Komunitas Petani</span>
        </div>
      </div>
      
      <UButton
        v-if="!searchQuery"
        icon="i-heroicons-plus-circle"
        color="success"
        variant="solid"
        size="lg"
        class="shadow-lg hover:shadow-xl transition-all duration-200"
        @click="$emit('startNewChat')"
      >
        Mulai Konsultasi Sekarang
      </UButton>
      
      <UButton
        v-else
        icon="i-heroicons-arrow-path"
        color="success"
        variant="outline"
        @click="$emit('clearSearch')"
      >
        Hapus Pencarian
      </UButton>
    </div>
  </div>
</template>
