<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupabase } from '~/composables/useSupabase';

const route = useRoute();
const router = useRouter();
const { supabase } = useSupabase();

// Data
const instructor = ref(null);
const loading = ref(true);
const error = ref(null);
const creatingConversation = ref(false);

// Computed
const age = computed(() => {
  if (!instructor.value?.profiles?.birth_date) return null;
  
  const birthDate = new Date(instructor.value.profiles.birth_date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Functions
const fetchInstructor = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: fetchError } = await supabase
      .from('instructors')
      .select(`
        *,
        profiles (
          full_name,
          username,
          avatar_url,
          website,
          phone,
          bio,
          birth_date
        )
      `)
      .eq('id', route.params.id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      error.value = fetchError;
    } else {
      instructor.value = data;
    }
  } catch (err) {
    console.error(err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const startConversation = async () => {
  creatingConversation.value = true;
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${route.params.id}),and(participant1_id.eq.${route.params.id},participant2_id.eq.${user.id})`)
      .single();

    if (existingConversation) {
      // Redirect to existing conversation
      router.push(`/room-chat/${existingConversation.id}`);
    } else {
      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: route.params.id
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating conversation:', createError);
        error.value = createError;
      } else {
        // Redirect to new conversation
        router.push(`/room-chat/${newConversation.id}`);
      }
    }
  } catch (err) {
    console.error('Error starting conversation:', err);
    error.value = err;
  } finally {
    creatingConversation.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchInstructor();
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">Error: {{ error.message }}</p>
    </div>

    <!-- Instructor Profile -->
    <div v-else-if="instructor" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
          <!-- Profile Picture -->
          <div class="flex-shrink-0">
            <img 
              :src="instructor.profiles?.avatar_url || '/default-avatar.png'" 
              :alt="instructor.profiles?.full_name"
              class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
            >
          </div>
          
          <!-- Basic Info -->
          <div class="flex-1 text-white">
            <h1 class="text-3xl font-bold mb-2">{{ instructor.profiles?.full_name }}</h1>
            <p class="text-lg opacity-90 mb-2">@{{ instructor.profiles?.username }}</p>
            <div class="flex flex-wrap items-center gap-4 text-sm opacity-90">
              <span v-if="age" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
                {{ age }} tahun
              </span>
              <span v-if="instructor.provinces" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                {{ instructor.district }}, {{ instructor.provinces }}
              </span>
            </div>
          </div>

          <!-- Chat Button -->
          <div class="flex-shrink-0">
            <button 
              :disabled="creatingConversation"
              class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              @click="startConversation"
            >
              <svg v-if="!creatingConversation" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
              </svg>
              <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"/>
              {{ creatingConversation ? 'Memulai...' : 'Mulai Obrolan' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- About Section -->
          <div>
            <h2 class="text-xl font-semibold mb-4">Tentang Instruktur</h2>
            <p class="text-gray-700 leading-relaxed mb-6">
              {{ instructor.profiles?.bio || 'Belum ada deskripsi tersedia.' }}
            </p>

            <!-- Notes -->
            <div v-if="instructor.note" class="mb-6">
              <h3 class="text-lg font-semibold mb-3">Catatan</h3>
              <p class="text-gray-700 bg-gray-50 p-4 rounded-lg">{{ instructor.note }}</p>
            </div>
          </div>

          <!-- Contact & Info -->
          <div class="space-y-6">
            <!-- Contact Information -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Informasi Kontak</h3>
              <div class="space-y-3">
                
                <div v-if="instructor.profiles?.phone" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <span class="text-sm text-gray-700">{{ instructor.profiles.phone }}</span>
                </div>

                <div v-if="instructor.profiles?.website" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"/>
                  </svg>
                  <a :href="instructor.profiles.website" target="_blank" class="text-sm text-blue-600 hover:text-blue-800">{{ instructor.profiles.website }}</a>
                </div>
              </div>
            </div>

            <!-- Location Info -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-3 text-blue-800">Lokasi</h3>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">Provinsi:</span>
                  <span class="text-sm font-medium">{{ instructor.provinces }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">Kabupaten/Kota:</span>
                  <span class="text-sm font-medium">{{ instructor.district }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-semibold text-gray-600 mb-2">Instruktur Tidak Ditemukan</h2>
      <p class="text-gray-500">Instruktur yang Anda cari tidak tersedia.</p>
    </div>
  </div>
</template>

