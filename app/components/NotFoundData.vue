<script setup lang="ts">
// Props
const props = defineProps({
  message: {
    type: String,
    default: 'Tidak ada produk tersedia untuk kategori ini.'
  },
  actionText: {
    type: String,
    default: 'Jelajahi Kategori Lain'
  },
  showAction: {
    type: Boolean,
    default: true
  }
});

// Emits
const emit = defineEmits(['action']);

// Methods
const handleAction = () => {
  emit('action');
};
</script>

<template>
  <UCard class="text-center dark:text-gray-200 mb-8">
    <div class="py-8">
      <!-- Empty State Icon -->
      <div class="mb-6">
        <UIcon 
          name="i-heroicons-folder-open" 
          class="w-16 h-16 text-amber-400 mx-auto mb-2"
        />
        <p class="text-4xl">🏜️</p>
      </div>

      <!-- Content -->
      <div class="space-y-3 dark:text-gray-200 text-gray-800">
        <h3 class="text-xl font-semibold ">
          Kebun masih kosong 🌾
        </h3>
        <p >{{ message }}</p>
        <p class="text-sm ">
          Coba cari di kategori lain atau periksa kembali nanti
        </p>
      </div>

      <!-- Action Button -->
      <div v-if="showAction" class="mt-6">
        <UButton 
          color="green"
          icon="i-heroicons-magnifying-glass"
          @click="handleAction"
        >
          {{ actionText }}
        </UButton>
      </div>

      <!-- Tips -->
      <UAlert
        class="mt-6 text-left"
        icon="i-heroicons-light-bulb"
        color="amber"
        variant="soft"
        title="Tips untuk Petani:"
        description="Gunakan kata kunci yang berbeda atau hubungi admin untuk menambah produk baru"
      />
    </div>
  </UCard>
</template>