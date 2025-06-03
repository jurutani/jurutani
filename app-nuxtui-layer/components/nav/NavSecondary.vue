<script setup lang="ts">
import { useSupabase } from '~/composables/useSupabase'
import { ref, onMounted } from 'vue';
import { toastStore } from '~/composables/useJuruTaniToast';

const { logout } = useSupabase()
const { supabase } = useSupabase();
const currentUserId = ref(null);
const user = ref(null);

const fetchCurrentUser = async () => {
  try {
    const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData) {
      toastStore.error('Tidak dapat memuat data pengguna. Silakan login kembali.');
      return;
    }

    // Fetch profile from 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('avatar_url, full_name, id')
      .eq('id', userData.id)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching profile:', profileError);
      toastStore.error('Gagal memuat profil pengguna.');
      return;
    }

    // Gabungkan data user auth dan profile
    user.value = {
      id: userData.id,
      email: userData.email,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url ? `${profileData.avatar_url}?t=${Date.now()}` : '/profile.png'
    };
    
    currentUserId.value = userData.id;

    console.log('User data loaded:', user.value);
  } catch (err) {
    console.error('Error fetching current user:', err);
    toastStore.error('Gagal memuat data pengguna.');
  }
};

// Handle image error
const handleImageError = (event) => {
  console.error('Profile image failed to load:', event.target.src);
  event.target.src = '/profile.png';
};

onMounted(() => {
  fetchCurrentUser();
});

const dropdownItems = [
  [
    {
      slot: 'account',
      disabled: true,
    }
  ],
];

const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    toastStore.success('Berhasil logout')
    window.location.href = '/'
  } else {
    toastStore.error('Gagal logout')
    console.error('Logout failed:', result.error);
  }
}
</script>



<template>
  <UDropdown
    :popper="{ placement: 'bottom-start' }"
    :ui="{
      container: '!-ml-2 sm:ml-auto',
      rounded: '',
      width: 'w-full sm:w-64',
      item: { disabled: 'cursor-text select-text opacity-100' },
      base: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border border-green-100 dark:border-green-800',
    }"
    :items="dropdownItems"
  >
    <UAvatar
      v-if="user && user.avatar_url"
      :src="user.avatar_url"
      alt="Avatar"
      size="lg"
      class="sm:ml-2"
    />
    <UAvatar
      v-else
      src="/profile.png"
      alt="Avatar"
      size="lg"
      class="sm:ml-2"
    />


    <template #account>
      <div class="my-2 w-full px-3">
        <!-- Logo dan Judul -->
        <div class="flex items-center space-x-2 mb-3">
          <TheLogo />
        </div>

        <ProfileActions class="sm:!hidden mb-2" />

        <!-- Tombol Sign In & Register atau Logout -->
        <div class="grid sm:grid-cols-1 grid-cols-2 gap-2 mt-4">
          <template v-if="user">
            <button
              class="col-span-2 font-bold w-full py-2 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border border-red-600 hover:border-red-700 text-white shadow-sm"
              type="button"
              @click="handleLogout"
            >
              <UIcon name="i-heroicons-arrow-left-on-rectangle" class="text-white w-5 h-5" />
              Logout
            </button>
          </template>

          <template v-else>
            <NuxtLink to="/auth/login" class="col-span-1">
              <UButton
                class="font-bold w-full py-2 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 border-none text-white shadow-sm"
                size="md"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="text-white w-5 h-5" />
                Sign In
              </UButton>
            </NuxtLink>

            <NuxtLink to="/auth/register" class="col-span-1">
              <UButton
                class="font-bold w-full py-2 text-sm flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 border-none text-white shadow-sm"
                size="md"
              >
                <UIcon name="i-heroicons-user-plus" class="text-white w-5 h-5" />
                Register
              </UButton>
            </NuxtLink>
          </template>
        </div>


        <!-- Secondary Navigation Items -->
        <div class="grid grid-cols-2 gap-2 mt-4">
          <ULink
            v-for="(nav, index) in navsSecondary"
            :key="nav.to"
            v-slot="{ isActive, navigate }"
            :to="nav.to"
            custom
          >
            <button 
              class="flex flex-col items-center justify-center p-3 rounded-md w-full transition-all duration-300"
              :class="{
                'bg-green-200/70 dark:bg-green-700/70': isActive,
                'hover:bg-green-200/40 dark:hover:bg-green-700/40': true
              }"
              @click="navigate"
            >
              <UIcon
                v-if="nav.icon"
                :name="nav.icon"
                class="text-[22px] mb-1"
                :class="isActive ? 'text-green-700 dark:text-green-300' : 'text-green-600 dark:text-green-400'"
              />
              <span 
                class="text-[10px] font-medium"
                :class="isActive ? 'text-green-800 dark:text-green-200' : 'text-green-700 dark:text-green-300'"
              >
                {{ nav.title }}
              </span>
            </button>
          </ULink>
        </div>
      </div>
    </template>
  </UDropdown>
</template>
