<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import { toastStore } from '~/composables/useJuruTaniToast';

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update', 'cancel']);

const { supabase } = useSupabase();

const loading = ref(false);
const imageFile = ref(null);
const imagePreview = ref(null);

// Create a reactive copy of user data
const formData = reactive({
  full_name: props.userData.full_name || '',
  phone: props.userData.phone || '',
  address: props.userData.address || '',
  bio: props.userData.bio || '',
  avatar_url: props.userData.avatar_url || ''
});

// Handle image selection
const handleImageSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    toastStore.error('Format file tidak didukung. Gunakan JPG, PNG, atau GIF.');
    return;
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    toastStore.error('Ukuran file terlalu besar. Maksimal 2MB.');
    return;
  }

  imageFile.value = file;
  
  // Create image preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Reset image selection
const resetImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};

// Handle form submission
const handleSubmit = async () => {
  loading.value = true;
  try {
    let newAvatarUrl = formData.avatar_url; // Keep existing avatar URL by default

    // Upload new avatar if selected
    if (imageFile.value) {
      // Delete old avatar if exists (perbaikan: cek path yang lebih robust)
      if (formData.avatar_url && formData.avatar_url.includes('avatars/')) {
        try {
          const oldPath = formData.avatar_url.split('avatars/')[1].split('?')[0]; // Remove query params
          if (oldPath) {
            const { error: deleteError } = await supabase.storage
              .from('avatars')
              .remove([oldPath]);
            
            if (deleteError) {
              console.warn('Could not delete old avatar:', deleteError);
            }
          }
        } catch (deleteErr) {
          console.warn('Error deleting old avatar:', deleteErr);
        }
      }

      // Upload new avatar
      const fileExt = imageFile.value.name.split('.').pop();
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      const filePath = `${props.userData.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, imageFile.value, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toastStore.error(`Gagal mengunggah gambar profil: ${uploadError.message}`);
        return;
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (publicUrl) {
        // PERBAIKAN: Tambahkan timestamp untuk cache busting
        newAvatarUrl = `${publicUrl}?t=${Date.now()}`;
        formData.avatar_url = newAvatarUrl;
        console.log('New avatar URL:', newAvatarUrl); // Debug log
      } else {
        console.error('Failed to get public URL');
        toastStore.error('Gagal mendapatkan URL gambar profil.');
        return;
      }
    }

    // Prepare update data
    const updates = {
      id: props.userData.id,
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      bio: formData.bio.trim(),
      avatar_url: newAvatarUrl,
      updated_at: new Date().toISOString()
    };

    // Update profile in database
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', props.userData.id)
      .select();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      toastStore.error(`Gagal memperbarui profil: ${updateError.message}`);
      return;
    }

    console.log('Profile updated successfully:', updateData); // Debug log

    // Emit update event with updated data
    emit('update', { ...updates, email: props.userData.email });
    toastStore.success('Profil berhasil diperbarui.');
    
    // Reset image selection after successful update
    resetImage();
    
  } catch (err) {
    console.error('Exception updating profile:', err);
    toastStore.error('Terjadi kesalahan saat memperbarui profil.');
  } finally {
    loading.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  // Reset any changes
  resetImage();
  emit('cancel');
};

// Compute current avatar display
const currentAvatar = computed(() => {
  // Priority: preview image > current avatar > default
  if (imagePreview.value) {
    return imagePreview.value;
  }
  
  if (formData.avatar_url) {
    return formData.avatar_url;
  }
  
  return '/profile.png';
});

// Handle image load error
const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src);
  event.target.src = '/profile.png'; // Fallback to default image
};
</script>

<template>
  <form class="bg-white rounded-lg shadow-md p-6" @submit.prevent="handleSubmit">
    <h2 class="text-xl font-semibold mb-6">Edit Profil</h2>

    <!-- Avatar Upload -->
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-medium mb-2">Foto Profil</label>
      
      <div class="flex items-center">
        <div class="w-24 h-24 rounded-full overflow-hidden mr-4 bg-gray-100">
          <img 
            :src="currentAvatar" 
            alt="Avatar Preview"
            class="w-full h-full object-cover"
            @error="handleImageError"
            @load="console.log('Image loaded:', $event.target.src)"
          >
        </div>
        
        <div class="flex flex-col">
          <input 
            id="avatar" 
            type="file" 
            accept="image/*" 
            class="hidden"
            @change="handleImageSelect"
          >
          <div class="flex space-x-2">
            <label 
              for="avatar" 
              class="cursor-pointer bg-blue-100 text-blue-600 px-3 py-2 rounded hover:bg-blue-200"
            >
              Pilih Gambar
            </label>
            <button 
              v-if="imagePreview" 
              type="button" 
              class="bg-gray-100 text-gray-600 px-3 py-2 rounded hover:bg-gray-200"
              @click="resetImage"
            >
              Batal
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Format: JPG, PNG, GIF. Maks. 2MB
          </p>
          <!-- Debug info -->
          <p v-if="formData.avatar_url" class="text-xs text-blue-500 mt-1">
            Current URL: {{ formData.avatar_url }}
          </p>
        </div>
      </div>
    </div>

    <!-- Name -->
    <div class="mb-4">
      <label for="full_name" class="block text-gray-700 text-sm font-medium mb-2">
        Nama Lengkap
      </label>
      <input
        id="full_name"
        v-model="formData.full_name"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan nama lengkap Anda"
      >
    </div>

    <!-- Phone -->
    <div class="mb-4">
      <label for="phone" class="block text-gray-700 text-sm font-medium mb-2">
        Nomor Telepon
      </label>
      <input
        id="phone"
        v-model="formData.phone"
        type="tel"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Contoh: 08123456789"
      >
    </div>

    <!-- Address -->
    <div class="mb-4">
      <label for="address" class="block text-gray-700 text-sm font-medium mb-2">
        Alamat
      </label>
      <input
        id="address"
        v-model="formData.address"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan alamat lengkap Anda"
      >
    </div>

    <!-- Bio -->
    <div class="mb-6">
      <label for="bio" class="block text-gray-700 text-sm font-medium mb-2">
        Bio
      </label>
      <textarea
        id="bio"
        v-model="formData.bio"
        rows="4"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ceritakan sedikit tentang diri Anda..."
      />
    </div>

    <!-- Buttons -->
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        :disabled="loading"
        @click="handleCancel"
      >
        Batal
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="loading"
      >
        <span v-if="loading">Menyimpan...</span>
        <span v-else>Simpan</span>
      </button>
    </div>
  </form>
</template>