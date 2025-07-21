<!-- components/chat/EmptyState.vue -->
<template>
  <div class="flex flex-col items-center justify-center h-64 px-4">
    <div class="text-center max-w-md">
      <!-- JuruTani themed icon -->
      <div class="relative mb-6">
        <UIcon 
          name="i-heroicons-chat-bubble-left-right" 
          class="w-20 h-20 text-green-200 mx-auto"
        />
        <UIcon 
          name="i-heroicons-leaf" 
          class="w-8 h-8 text-green-400 absolute -top-2 -right-2"
        />
      </div>
      
      <h3 class="text-xl font-bold text-green-800 mb-3">
        {{ searchQuery ? 'Conversation tidak ditemukan' : 'Selamat datang di Juru Tani Chat!' }}
      </h3>
      
      <p class="text-green-600 mb-6 leading-relaxed">
        {{ searchQuery 
          ? `Tidak ada conversation dengan "${searchQuery}". Coba kata kunci lain atau mulai chat baru.`
          : 'Mulai konsultasi dengan ahli pertanian, penyuluh, atau sesama petani. Dapatkan solusi terbaik untuk pertanian Anda!' 
        }}
      </p>
      
      <!-- Features highlight for empty state -->
      <div v-if="!searchQuery" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
        <div class="flex flex-col items-center p-3 bg-green-50 rounded-lg">
          <UIcon name="i-heroicons-academic-cap" class="w-6 h-6 text-green-600 mb-2" />
          <span class="text-green-700 font-medium">Konsultasi Ahli</span>
        </div>
        <div class="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
          <UIcon name="i-heroicons-megaphone" class="w-6 h-6 text-blue-600 mb-2" />
          <span class="text-blue-700 font-medium">Tips Penyuluh</span>
        </div>
        <div class="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
          <UIcon name="i-heroicons-users" class="w-6 h-6 text-amber-600 mb-2" />
          <span class="text-amber-700 font-medium">Komunitas Petani</span>
        </div>
      </div>
      
      <UButton
        v-if="!searchQuery"
        icon="i-heroicons-plus-circle"
        color="green"
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
        color="green"
        variant="outline"
        @click="$emit('clearSearch')"
      >
        Hapus Pencarian
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  searchQuery: string
}

defineProps<Props>()
defineEmits(['startNewChat', 'clearSearch'])
</script>