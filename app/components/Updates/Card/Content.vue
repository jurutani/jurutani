<script setup lang="ts">
import { computed } from 'vue';
import { modalStore } from '~/composables/useJuruTaniModal';
import UpdatesModalContent from '~/components/Updates/Modal/Content.vue';

interface Attachment {
  url: string;
}

interface Update {
  id: string;
  content: string;
  attachments: Attachment[];
  created_at: string;
  user_id?: string | null;
}

const props = defineProps<{
  update: Update;
}>();

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(props.update.created_at));
});

const firstImage = computed(() => {
  return props.update.attachments.find(att => att.url && att.url.match(/\.(jpeg|jpg|png|gif|webp)$/i))?.url || '/placeholder.png';
});

const openUpdateModal = (update: Update) => {
  modalStore.open(UpdatesModalContent, { update });
};
</script>

<template>
  <div class="rounded-xl bg-white dark:bg-green-900 shadow-md p-4 space-y-3 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300">
    <div v-if="firstImage" class="w-full aspect-video overflow-hidden rounded-md">
      <img
        :src="firstImage"
        alt="Lampiran"
        class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
      >
    </div>
    <p class="text-sm text-green-900 dark:text-green-100 line-clamp-3">
      {{ update.content }}
    </p>
    <div class="flex justify-between items-center text-xs text-green-700 dark:text-green-300">
      <span>{{ formattedDate }}</span>
      <button
        class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 dark:bg-green-800 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-700 transition-colors"
        @click="openUpdateModal(update)"
      >
        <Icon name="i-heroicons-eye" class="h-4 w-4" />
        <span>Lihat</span>
      </button>
    </div>
  </div>
</template>