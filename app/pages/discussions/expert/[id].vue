<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"/>
        <p class="text-gray-600 font-medium">Memuat profil pakar...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm">
        <div class="flex">
          <svg class="w-6 h-6 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Terjadi Kesalahan</h3>
            <p class="text-red-700">{{ error.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Expert Profile -->
    <div v-else-if="expert" class="max-w-6xl mx-auto px-4 py-8">
      <!-- Hero Section -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <!-- Cover Background -->
        <div class="h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative">
          <div class="absolute inset-0 bg-black bg-opacity-20"/>
          <div class="absolute top-6 right-6">
            <div class="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-white font-semibold text-sm">Pakar ahli {{ expert.category }}</span>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="px-8 pb-8">
          <div class="flex flex-col lg:flex-row items-start lg:items-end gap-6 -mt-16">
            <!-- Avatar -->
            <div class="relative">
              <img 
                :src="expert.profiles?.avatar_url || '/profile.png'" 
                :alt="expert.profiles?.full_name"
                class="w-32 h-32 rounded-2xl border-6 border-white shadow-xl object-cover bg-white"
              >
              <div class="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>

            <!-- Basic Info & Action -->
            <div class="flex-1 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pt-4">
              <div>
                <h1 class="text-3xl font-bold text-dark mb-2">
                  {{ expert.profiles?.full_name }}
                </h1>
                <p class="text-lg text-indigo-600 font-semibold mb-2">
                  Pakar Profesional
                </p>
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span v-if="age" class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                    {{ age }} tahun
                  </span>
                  <span v-if="expert.provinces" class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                    {{ expert.district }}, {{ expert.provinces }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Terverifikasi
                  </span>
                </div>
              </div>

              <!-- Consultation Button -->
              <button 
                :disabled="creatingConversation"
                class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 min-w-fit"
                @click="startConversation"
              >
                <svg v-if="!creatingConversation" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"/>
                <span class="text-lg">
                  {{ creatingConversation ? 'Memulai...' : 'Konsultasi Sekarang' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- About Section -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Tentang Pakar</h2>
            </div>
            <div class="prose prose-gray max-w-none">
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ expert.profiles?.bio || 'Seorang pakar profesional yang berpengalaman di bidangnya dengan dedikasi tinggi untuk berbagi pengetahuan dan memberikan konsultasi terbaik.' }}
              </p>
            </div>
          </div>

          <!-- Expertise Notes -->
          <div v-if="expert.note" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-100">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">Keahlian & Spesialisasi</h3>
            </div>
            <div class="bg-white rounded-xl p-6 shadow-sm">
              <p class="text-gray-700 leading-relaxed text-lg">{{ expert.note }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Contact Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Kontak</h3>
            </div>
            <div class="space-y-4">
              
              <div v-if="expert.profiles?.phone" class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Telepon</p>
                  <p class="text-sm text-gray-800 font-medium">{{ expert.profiles.phone }}</p>
                </div>
              </div>

              <div v-if="expert.profiles?.website" class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Website</p>
                  <a :href="expert.profiles.website" target="_blank" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    {{ expert.profiles.website.replace('https://', '').replace('http://', '') }}
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Username</p>
                  <p class="text-sm text-gray-800 font-medium">@{{ expert.profiles?.username }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Location Card -->
          <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-6 border border-emerald-100">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Lokasi</h3>
            </div>
            <div class="space-y-3">
              <div class="bg-white rounded-xl p-4 shadow-sm">
                <p class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Alamat</p>
                <p class="text-gray-800 font-semibold">{{ expert.profiles?.address }}</p>
              </div>
              
            </div>
          </div>

          <!-- Trust Badge -->
          <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-6 border border-yellow-200">
            <div class="text-center">
              <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-900 mb-2">Pakar Terverifikasi</h4>
              <p class="text-sm text-gray-600">Telah melewati proses verifikasi dan memiliki kredibilitas tinggi di bidangnya</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="max-w-4xl mx-auto px-4 py-20 text-center">
      <div class="bg-white rounded-2xl shadow-lg p-12">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <h2 class="text-3xl font-bold text-gray-700 mb-4">Pakar Tidak Ditemukan</h2>
        <p class="text-gray-500 text-lg">Maaf, pakar yang Anda cari tidak tersedia atau mungkin sudah tidak aktif.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupabase } from '~/composables/useSupabase';

const route = useRoute();
const router = useRouter();
const { supabase } = useSupabase();

// Data
const expert = ref(null);
const loading = ref(true);
const error = ref(null);
const creatingConversation = ref(false);

// Computed
const age = computed(() => {
  if (!expert.value?.profiles?.birth_date) return null;
  
  const birthDate = new Date(expert.value.profiles.birth_date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Functions
const fetchExpert = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: fetchError } = await supabase
      .from('experts')
      .select(`
        *,
        profiles (
          full_name,
          username,
          avatar_url,
          website,
          phone,
          bio,
          birth_date, 
          address
        )
      `)
      .eq('id', route.params.id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      error.value = fetchError;
    } else {
      expert.value = data;
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
  fetchExpert();
});
</script>