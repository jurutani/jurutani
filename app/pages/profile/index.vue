<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { toastStore } from '~/composables/useJuruTaniToast';

const { supabase } = useSupabase();

const userData = ref(null);
const loading = ref(true);
const error = ref(null);
const isEditing = ref(false);

// Format date utility
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return '-';
  }
};

// Format role display
const formatRole = (role) => {
  const roleLabels = {
    'admin': 'Administrator',
    'expert': 'Ahli Pertanian',
    'farmer': 'Petani',
    'user': 'Pengguna'
  };
  return roleLabels[role] || role || 'Pengguna';
};

// Fetch user data
const fetchUserData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toastStore.error('Tidak dapat memuat data pengguna. Silakan login kembali.');
      return;
    }

    // Get the user profile from the profiles table
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      error.value = profileError;
      toastStore.error('Gagal memuat profil pengguna.');
    } else {
      userData.value = {
        ...data,
        email: user.email, // Email dari auth
        // Cache busting untuk avatar URL
        avatar_url: data.avatar_url ? `${data.avatar_url}?t=${Date.now()}` : data.avatar_url
      };
      console.log('User data loaded:', userData.value);
    }
  } catch (err) {
    console.error('Exception fetching user data:', err);
    error.value = err;
    toastStore.error('Terjadi kesalahan saat memuat data profil.');
  } finally {
    loading.value = false;
  }
};

// Handle profile update
const handleProfileUpdate = async (updatedProfile) => {
  // Update userData with new profile data
  userData.value = { ...userData.value, ...updatedProfile };
  
  // Refresh data dari database untuk memastikan sinkronisasi
  await nextTick();
  await fetchUserData();
  
  toastStore.success('Profil berhasil diperbarui');
  isEditing.value = false;
};

// Toggle edit mode
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
};

// Handle image error
const handleImageError = (event) => {
  console.error('Profile image failed to load:', event.target.src);
  event.target.src = '/profile.png'; // Fallback to default image
};

// Check if URL is valid
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header dengan tema JuruTani -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="bg-green-100 p-3 rounded-full mr-3">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Profil JuruTani</h1>
            <p class="text-green-600 font-medium">Kelola informasi akun Anda</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center px-6 py-3 bg-white rounded-lg shadow-sm">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span class="text-gray-600">Memuat profil pengguna...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-red-800 font-medium">Terjadi kesalahan saat memuat profil pengguna</p>
              <button 
                class="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
                @click="fetchUserData"
              >
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="userData" class="max-w-4xl mx-auto">
        <div v-if="!isEditing" class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Header Profile dengan Background -->
          <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
            <div class="flex flex-col md:flex-row items-center">
              <!-- Profile Image -->
              <div class="relative mb-4 md:mb-0 md:mr-6">
                <div class="w-32 h-32 rounded-full overflow-hidden bg-white p-1 shadow-lg">
                  <img 
                    :src="userData.avatar_url || 'profile.png'" 
                    :alt="userData.full_name || 'User'"
                    class="w-full h-full object-cover rounded-full"
                    @error="handleImageError"
                  >
                </div>
                <!-- Role Badge -->
                <div class="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 shadow-md">
                  <span class="text-xs font-semibold text-green-600">
                    {{ formatRole(userData.role) }}
                  </span>
                </div>
              </div>

              <!-- User Info -->
              <div class="flex-1 text-center md:text-left text-white">
                <h2 class="text-2xl font-bold mb-1">
                  {{ userData.full_name || 'Pengguna JuruTani' }}
                </h2>
                <p class="text-green-100 text-lg mb-2">@{{ userData.username || 'username' }}</p>
                <p class="text-green-200">{{ userData.email }}</p>
                <p v-if="userData.phone" class="text-green-200">📱 {{ userData.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Profile Details -->
          <div class="p-6">
            <!-- Bio Section -->
            <div v-if="userData.bio" class="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                Tentang Saya
              </h3>
              <p class="text-gray-600 leading-relaxed">{{ userData.bio }}</p>
            </div>

            <!-- Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <!-- Personal Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 border-b border-green-200 pb-2">
                  Informasi Pribadi
                </h3>
                
                <div class="space-y-3">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Nama Lengkap</p>
                    <p class="text-gray-800">{{ userData.full_name || '-' }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500">Username</p>
                    <p class="text-gray-800">{{ userData.username || '-' }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500">Tanggal Lahir</p>
                    <p class="text-gray-800">{{ formatDate(userData.birth_date) }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500">Role</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ formatRole(userData.role) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 border-b border-green-200 pb-2">
                  Kontak
                </h3>
                
                <div class="space-y-3">
                  <div>
                    <p class="text-sm font-medium text-gray-500">Email</p>
                    <p class="text-gray-800 break-words">{{ userData.email }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500">Nomor Telepon</p>
                    <p class="text-gray-800">{{ userData.phone || '-' }}</p>
                  </div>
                  
                  <div>
                    <p class="text-sm font-medium text-gray-500">Website</p>
                    <div v-if="userData.website">
                      <a 
                        v-if="isValidUrl(userData.website)"
                        :href="userData.website" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-green-600 hover:text-green-800 hover:underline break-words inline-flex items-center"
                      >
                        {{ userData.website }}
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      </a>
                      <span v-else class="text-gray-800 break-words">{{ userData.website }}</span>
                    </div>
                    <p v-else class="text-gray-800">-</p>
                  </div>
                </div>
              </div>

              <!-- Address Info -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 border-b border-green-200 pb-2">
                  Alamat
                </h3>
                
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Alamat Lengkap</p>
                  <p class="text-gray-800 leading-relaxed">
                    {{ userData.address || 'Belum diisi' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center pt-6 border-t border-gray-200">
              <button 
                class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                @click="toggleEditMode"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit Profil
              </button>
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