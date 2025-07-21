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
      router.push('/auth/login');
      return;
    }

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${expert.value.user_id}),and(participant1_id.eq.${expert.value.user_id},participant2_id.eq.${user.id})`)
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
          participant2_id: expert.value.user_id,
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


<template>
  <div class="min-h-screen py-12 px-6">
    <!-- Loading State -->
    <LoadingData v-if="loading" message="Memuat profil pakar..." />

    <!-- Error State -->
    <ErrorData v-else-if="error" :error="error" />

    <!-- Expert Profile -->
    <div v-else-if="expert" class="max-w-6xl mx-auto py-8">
      <!-- Back Button -->
      <div class="mb-6">
        <NuxtLink 
          to="/discussions/expert" 
          class="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors group"
        >
          <svg class="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
          </svg>
          Kembali ke Daftar Pakar
        </NuxtLink>
      </div>

      <!-- Hero Section -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <!-- Cover Background with Agriculture Pattern -->
        <div class="h-48  relative agriculture-pattern">
          <!-- Expert Badge -->
          <div class="absolute top-6 right-6">
            <div class="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
              <UBadge color="green" variant="soft" class="font-semibold text-sm">
                Pakar {{ expert.category || 'Pertanian' }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="pb-8">
          <div class="flex flex-col lg:flex-row items-start lg:items-end gap-6 -mt-16 px-6">
            <!-- Avatar -->
            <div class="relative flex-shrink-0">
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
            <div class="flex-1 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pt-4 w-full">
              <div class="flex-1 min-w-0">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
                  {{ expert.profiles?.full_name || 'Nama Pakar' }}
                </h1>
                <p class="text-lg text-green-600 font-semibold mb-2">
                  Pakar Juru Tani Profesional
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
                class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 min-w-fit"
                @click="startConversation"
              >
                <svg v-if="!creatingConversation" class="w-5 sm:w-6 h-5 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
                </svg>
                <div v-else class="animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 border-white"/>
                <span class="text-sm sm:text-lg">
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
              <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Tentang Pakar</h2>
            </div>
            <div class="prose prose-gray max-w-none">
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ expert.profiles?.bio || 'Seorang pakar pertanian profesional yang berpengalaman di bidangnya dengan dedikasi tinggi untuk berbagi pengetahuan dan memberikan konsultasi terbaik dalam bidang pertanian dan agribisnis.' }}
              </p>
            </div>
          </div>

          <!-- Expertise Notes -->
          <div v-if="expert.note" class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
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
                  <a :href="expert.profiles.website" target="_blank" class="text-sm text-green-600 hover:text-green-800 font-medium">
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
                <p class="text-gray-800 font-semibold">{{ expert.profiles?.address || 'Alamat tidak tersedia' }}</p>
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
              <p class="text-sm text-gray-600">Telah melewati proses verifikasi dan memiliki kredibilitas tinggi di bidang pertanian</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="max-w-4xl mx-auto py-20 text-center">
      <div class="bg-white rounded-2xl shadow-lg p-12">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <h2 class="text-3xl font-bold text-gray-700 mb-4">Pakar Tidak Ditemukan</h2>
        <p class="text-gray-500 text-lg mb-6">Maaf, pakar yang Anda cari tidak tersedia atau mungkin sudah tidak aktif.</p>
        <NuxtLink 
          to="/discussions/expert"
          class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
          </svg>
          Kembali ke Daftar Pakar
        </NuxtLink>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Agriculture pattern background */
.agriculture-pattern {
  background-image: 
    radial-gradient(circle at 25px 25px, rgba(34, 197, 94, 0.2) 2px, transparent 2px),
    radial-gradient(circle at 75px 75px, rgba(22, 163, 74, 0.15) 1.5px, transparent 1.5px),
    radial-gradient(circle at 50px 100px, rgba(21, 128, 61, 0.1) 1px, transparent 1px);
  background-size: 100px 100px, 80px 80px, 120px 120px;

}



/* Responsive text fix */
@media (max-width: 1024px) {
  .text-3xl {
    font-size: 1.875rem;
  }
}

@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.5rem;
  }
}
</style>

