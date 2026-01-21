<script setup lang="ts">
interface Profile {
  full_name?: string;
  avatar_url?: string;
}

interface Props {
  id: number;
  profile: Profile | null;
  location?: string;
  category?: string;
  note?: string;
  type: 'instructor' | 'expert';
}

const props = defineProps<Props>();

const getDiscussionUrl = computed(() => {
  return `/discussions/${props.type}/${props.id}`;
});

const displayName = computed(() => {
  return props.profile?.full_name || 'Nama tidak tersedia';
});

const avatarUrl = computed(() => {
  return props.profile?.avatar_url || '/profile.png';
});
</script>

<template>
  <article>
    <UCard
      class="hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      :ui="{ 
        body: { padding: 'p-4 sm:p-6' }
      }"
    >
      <div class="flex flex-col items-center text-center space-y-4">
        <!-- Avatar -->
        <figure class="relative">
          <img
            :src="avatarUrl"
            :alt="`Foto profil ${displayName}`"
            class="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-green-100 dark:border-green-900"
          />
          <div class="absolute -bottom-2 -right-2 bg-green-500 dark:bg-green-600 w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center" aria-label="Terverifikasi">
            <UIcon 
              name="i-lucide-check" 
              class="w-3 h-3 text-white"
            />
          </div>
        </figure>

        <!-- Info -->
        <div class="space-y-2 flex-1">
          <header>
            <h3 class="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
              {{ displayName }}
            </h3>
          </header>
          
          <!-- Location for instructor -->
          <p v-if="location" class="text-sm text-gray-600 dark:text-gray-400">
            {{ location }}
          </p>
          
          <!-- Category badge for expert -->
          <UBadge v-if="category" color="success" variant="subtle">
            {{ category }}
          </UBadge>
          
          <!-- Note for expert -->
          <p v-if="note" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {{ note }}
          </p>
        </div>

        <!-- Button -->
        <UButton
          :to="getDiscussionUrl"
          color="success"
          size="md"
          class="w-full"
          icon="i-lucide-message-circle"
        >
          Mulai Diskusi
        </UButton>
      </div>
    </UCard>
  </article>
</template>
