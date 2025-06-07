<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
    <h2 class="text-xl font-semibold mb-4">Ganti Password</h2>

    <form class="space-y-4" @submit.prevent="handleChangePassword">
      <div>
        <label for="newPassword" class="block text-sm font-medium">Password Baru</label>
        <input
          id="newPassword"
          v-model="newPassword"
          type="password"
          class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
          required
        >
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium">Konfirmasi Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
          required
        >
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50"
      >
        {{ loading ? 'Memproses...' : 'Simpan Password' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSupabase } from '@/composables/useSupabase';
import { toastStore } from '@/composables/useJuruTaniToast';

const { supabase } = useSupabase();

const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toastStore.error('Password tidak cocok');
    return;
  }

  if (newPassword.value.length < 6) {
    toastStore.error('Password harus minimal 6 karakter');
    return;
  }

  loading.value = true;
  const { error } = await supabase.auth.updateUser({ password: newPassword.value });

  if (error) {
    toastStore.error(error.message || 'Gagal mengganti password');
  } else {
    toastStore.success('Password berhasil diperbarui');
    newPassword.value = '';
    confirmPassword.value = '';
  }
  loading.value = false;
};
</script>
