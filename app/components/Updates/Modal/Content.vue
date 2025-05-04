<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { modalStore } from '~/composables/useJuruTaniModal';

interface Attachment {
  url: string;
  type?: string;
}

interface Update {
  id: string;
  content: string;
  attachments: Attachment[];
  created_at?: string;
}

const props = defineProps<{
  update: Update;
}>();

const timer = ref(10);
let interval: ReturnType<typeof setInterval>;
const activeImageIndex = ref(0);

const isImage = (url: string) => {
  return url && url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
};

const getAttachmentType = (attachment: Attachment) => {
  if (!attachment.url) return 'unknown';
  if (isImage(attachment.url)) return 'image';
  if (attachment.url.match(/\.(pdf)$/i)) return 'pdf';
  if (attachment.url.match(/\.(doc|docx)$/i)) return 'document';
  if (attachment.url.match(/\.(xls|xlsx)$/i)) return 'spreadsheet';
  return 'file';
};

const images = computed(() => {
  return props.update.attachments.filter(att => isImage(att.url));
});

const closeModal = () => {
  modalStore.close();
};

onMounted(() => {
  interval = setInterval(() => {
    timer.value--;
    if (timer.value <= 0) {
      clearInterval(interval);
      closeModal();
    }
  }, 1000);

  // Add keyboard event listeners
  document.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  clearInterval(interval);
  document.removeEventListener('keydown', handleKeyPress);
});

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal();
  }
};

const nextImage = () => {
  if (images.value.length > 1) {
    activeImageIndex.value = (activeImageIndex.value + 1) % images.value.length;
  }
};

const prevImage = () => {
  if (images.value.length > 1) {
    activeImageIndex.value = (activeImageIndex.value - 1 + images.value.length) % images.value.length;
  }
};

const resetTimer = () => {
  timer.value = 10;
};
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50" 
    @click.self="closeModal"
  >
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
      <button 
        class="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-500 dark:hover:text-red-300 transition-colors" 
        @click="closeModal"
      >
        <Icon name="i-heroicons-x-mark" class="h-5 w-5" />
      </button>
      
      <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">
        Detail Update
      </h3>
      
      <!-- Gallery if multiple images -->
      <div v-if="images.length > 0" class="mb-4">
        <div class="relative">
          <div class="w-full aspect-video overflow-hidden rounded-lg mb-2">
            <img 
              :src="images[activeImageIndex]?.url" 
              alt="Gambar lampiran" 
              class="object-contain w-full h-full"
            >
          </div>
          
          <div v-if="images.length > 1" class="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2">
            <button 
              class="h-8 w-8 rounded-full bg-white/70 dark:bg-gray-800/70 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-800" 
              @click="prevImage"
              @mouseenter="resetTimer"
            >
              <Icon name="i-heroicons-chevron-left" class="h-5 w-5" />
            </button>
            <button 
              class="h-8 w-8 rounded-full bg-white/70 dark:bg-gray-800/70 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-800" 
              @click="nextImage"
              @mouseenter="resetTimer"
            >
              <Icon name="i-heroicons-chevron-right" class="h-5 w-5" />
            </button>
          </div>
          
          <div v-if="images.length > 1" class="flex justify-center gap-1 mt-2">
            <button 
              v-for="(_, index) in images" 
              :key="index"
              class="h-2 w-2 rounded-full transition-all duration-200"
              :class="index === activeImageIndex ? 'bg-green-600 dark:bg-green-400 scale-125' : 'bg-gray-300 dark:bg-gray-600'"
              @click="activeImageIndex = index"
              @mouseenter="resetTimer"
            />
          </div>
        </div>
      </div>
      
      <div class="text-gray-800 dark:text-gray-100 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p class="whitespace-pre-wrap text-sm">{{ props.update.content }}</p>
      </div>
      
      <div v-if="props.update.attachments.length" class="space-y-2 border-t dark:border-gray-700 pt-3">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lampiran:</h4>
        <div class="grid grid-cols-2 gap-2">
          <a 
            v-for="(file, index) in props.update.attachments" 
            :key="index"
            :href="file.url" 
            target="_blank" 
            class="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
            @mouseenter="resetTimer"
          >
            <div class="mr-2">
              <Icon 
                :name="`i-heroicons-${getAttachmentType(file) === 'image' ? 'photo' : 'document-text'}`" 
                class="h-5 w-5 text-gray-500 dark:text-gray-400" 
              />
            </div>
            <span class="text-sm text-blue-600 dark:text-blue-400 group-hover:underline truncate">
              Lampiran {{ index + 1 }}
            </span>
          </a>
        </div>
      </div>
      
      <div class="mt-4 flex items-center justify-end">
        <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Icon name="i-heroicons-clock" class="h-4 w-4 mr-1" />
          <span>Menutup dalam {{ timer }} detik</span>
        </div>
      </div>
    </div>
  </div>
</template>