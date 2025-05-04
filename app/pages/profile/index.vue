<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { toastStore } from '~/composables/useJuruTaniToast';

const { supabase } = useSupabase();

const userData = ref(null);
const loading = ref(true);
const error = ref(null);
const isEditing = ref(false);

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
        email: user.email,
      };
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
const handleProfileUpdate = (updatedProfile) => {
  userData.value = { ...userData.value, ...updatedProfile };
  toastStore.success('Profil berhasil diperbarui');
  isEditing.value = false;
};

// Toggle edit mode
const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="profile-page container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-center mb-8">Profil Pengguna</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Memuat profil pengguna...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Terjadi kesalahan saat memuat profil pengguna.</p>
      <button class="mt-2 text-blue-600 hover:underline" @click="fetchUserData">
        Coba lagi
      </button>
    </div>

    <!-- Profile Content -->
    <div v-else-if="userData" class="max-w-3xl mx-auto">
      <div v-if="!isEditing" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex flex-col md:flex-row items-center mb-6">
          <!-- Profile Image -->
          <div class="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img 
              :src="userData.avatar_url || '/img/default-avatar.png'" 
              :alt="userData.full_name || 'User'"
              class="w-full h-full object-cover"
            >
          </div>

          <!-- User Info -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-xl font-semibold">{{ userData.full_name || 'Pengguna' }}</h2>
            <p class="text-gray-600">{{ userData.email }}</p>
            <p v-if="userData.phone" class="text-gray-600">{{ userData.phone }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <h3 class="text-lg font-medium mb-3">Informasi Pengguna</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500 text-sm">Nama Lengkap</p>
              <p>{{ userData.full_name || '-' }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">Email</p>
              <p>{{ userData.email }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">Nomor Telepon</p>
              <p>{{ userData.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">Alamat</p>
              <p>{{ userData.address || '-' }}</p>
            </div>
          </div>
          
          <div class="mt-6">
            <p class="text-gray-500 text-sm">Bio</p>
            <p>{{ userData.bio || '-' }}</p>
          </div>
        </div>

        <div class="mt-6">
          <button 
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
            @click="toggleEditMode"
          >
            Edit Profil
          </button>
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
</template>