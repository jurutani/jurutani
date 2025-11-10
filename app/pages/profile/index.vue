<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useProfile } from '~/composables/useProfile';

const {
  userData,
  loading,
  error,
  isEditing,
  fetchUserData,
  updateUserProfile,
  formatDate,
  formatRole,
  isValidUrl
} = useProfile();

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
};

const handleProfileUpdate = async (updatedProfile: Record<string, any>) => {
  await nextTick(); // Jika ada animasi atau loading
  await updateUserProfile(updatedProfile);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  console.error('Profile image failed to load:', target.src);
  target.src = '/profile.png';
};

onMounted(() => {
  fetchUserData();
});
</script>


<template>
  <div class="min-h-screen py-12 transition-colors duration-200">
    <div class="container mx-auto px-4 py-8">
       <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 dark:bg-green-700 rounded-full mb-4 shadow-lg dark:shadow-green-900/50">
          <UIcon name="i-lucide-user" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Profil Pengguna</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Kelola informasi akun Anda dengan aman.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-md border border-gray-100 dark:border-gray-800">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600 dark:text-green-400" />
          <span class="text-gray-600 dark:text-gray-400">Memuat profil pengguna...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-lg transition-colors duration-200">
          <div class="flex">
            <div class="flex-shrink-0">
              <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-400 dark:text-red-500" />
            </div>
            <div class="ml-3">
              <p class="text-red-800 dark:text-red-200 font-medium">Terjadi kesalahan saat memuat profil pengguna</p>
              <UButton
                color="red"
                variant="ghost"
                size="sm"
                class="mt-2"
                @click="fetchUserData"
              >
                Coba lagi
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="userData" class="max-w-4xl mx-auto">
        <div v-if="!isEditing" class="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-200">
          <!-- Header Profile dengan Background -->
          <div class="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 px-6 py-8 transition-all duration-200">
            <div class="flex flex-col md:flex-row items-center">
              <!-- Profile Image -->
              <div class="relative mb-4 md:mb-0 md:mr-6">
                <div class="w-32 h-32 rounded-full overflow-hidden bg-white dark:bg-gray-800 p-1 shadow-lg dark:shadow-black/50">
                  <NuxtImg 
                    :src="userData.avatar_url || 'profile.png'" 
                    :alt="userData.full_name || 'User'"
                    class="w-full h-full object-cover rounded-full"
                    @error="handleImageError"
                  />
                </div>
                <!-- Role Badge -->
                <div class="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-md dark:shadow-black/50 transition-all duration-200">
                  <span class="text-xs font-semibold text-green-600 dark:text-green-400">
                    {{ formatRole(userData.role) }}
                  </span>
                </div>
              </div>

              <!-- User Info -->
              <div class="flex-1 text-center md:text-left text-white">
                <h2 class="text-2xl font-bold mb-1">
                  {{ userData.full_name || 'Pengguna JuruTani' }}
                </h2>
                <p class="text-green-100 dark:text-green-200 text-lg mb-2">@{{ userData.username || 'username' }}</p>
                <p class="text-green-50 dark:text-green-100">{{ userData.email }}</p>
                <p v-if="userData.phone" class="text-green-50 dark:text-green-100">📱 {{ userData.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Profile Details -->
          <div class="p-6">
            <!-- Bio Section -->
            <div v-if="userData.bio" class="mb-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-800 transition-colors duration-200">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                <UIcon name="i-heroicons-chat-bubble-left" class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Tentang Saya
              </h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ userData.bio }}</p>
            </div>

            <!-- Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <!-- Personal Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-green-200 dark:border-green-800 pb-2 transition-colors duration-200">
                  Informasi Pribadi
                </h3>
                
                <div class="space-y-3">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                    <p class="text-gray-800 dark:text-gray-200">{{ userData.full_name || '-' }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Username</p>
                    <p class="text-gray-800 dark:text-gray-200">{{ userData.username || '-' }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Lahir</p>
                    <p class="text-gray-800 dark:text-gray-200">{{ formatDate(userData.birth_date) }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 transition-colors duration-200">
                      {{ formatRole(userData.role) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-green-200 dark:border-green-800 pb-2 transition-colors duration-200">
                  Kontak
                </h3>
                
                <div class="space-y-3">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p class="text-gray-800 dark:text-gray-200 break-words">{{ userData.email }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor Telepon</p>
                    <p class="text-gray-800 dark:text-gray-200">{{ userData.phone || '-' }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Website</p>
                    <div v-if="userData.website">
                      <NuxtLink
                        v-if="isValidUrl(userData.website)"
                        :to="userData.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:underline break-words inline-flex items-center transition-colors duration-200"
                      >
                        {{ userData.website }}
                        <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 ml-1" />
                      </NuxtLink>
                      <span v-else class="text-gray-800 dark:text-gray-200 break-words">{{ userData.website }}</span>
                    </div>
                    <p v-else class="text-gray-800 dark:text-gray-200">-</p>
                  </div>
                </div>
              </div>

              <!-- Address Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 border-b border-green-200 dark:border-green-800 pb-2 transition-colors duration-200">
                  Alamat
                </h3>
                
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Alamat Lengkap</p>
                  <p class="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {{ userData.address || 'Belum diisi' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <UButton
                color="green"
                variant="solid"
                size="lg"
                icon="i-lucide-pencil"
                @click="toggleEditMode"
              >
                Edit Profil
              </UButton>
            </div>
          </div>
        </div>

        <!-- Edit Form -->
        <ProfileForm 
          v-else
          :user-data="userData" 
          @update="handleProfileUpdate"
          @cancel="toggleEditMode"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles for JuruTani theme */
.container {
  max-width: 1200px;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #16a34a;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #15803d;
}
</style>