<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'

// Types
interface CourseItem {
  id: string
  title: string
  description?: string
  category?: string
  duration?: string
  instructor?: string
  image_url?: string
  files?: Array<{
    name: string
    url: string
  }>
  link_drive?: string
  link_youtube?: string
  user_id?: string
  created_at: string
  updated_at: string
}

// Composables
const route = useRoute()
const router = useRouter()
const { supabase } = useSupabase()

// State
const courseId = route.params.id as string
const course = ref<CourseItem | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Computed
const imgSrc = ref('/placeholder.png') // default awal

const imageUrl = computed(() => {
  if (!course.value?.image_url) return null
  return course.value.image_url.startsWith('http')
    ? course.value.image_url
    : supabase.storage.from('courses').getPublicUrl(course.value.image_url).data.publicUrl
})

function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.onerror = null
  img.src = '/placeholder.png'
}

const hasFiles = computed(() => {
  return course.value?.files && Array.isArray(course.value.files) && course.value.files.length > 0
})

const hasLinks = computed(() => {
  return course.value?.link_drive || course.value?.link_youtube
})

const hasResources = computed(() => {
  return hasFiles.value || hasLinks.value
})

// Methods
const fetchCourseDetail = async (): Promise<void> => {
  loading.value = true
  error.value = null

  try {
    const { data, error: fetchError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (fetchError) {
      console.error('Error fetching course:', fetchError)
      error.value = 'Gagal memuat Materi'
      return
    }

    if (!data) {
      error.value = 'Materi tidak ditemukan'
      return
    }

    course.value = data
  } catch (err) {
    console.error('Unexpected error:', err)
    error.value = 'Terjadi kesalahan yang tidak terduga'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatCategory = (category?: string): string => {
  if (!category) return 'Pertanian'
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const goBack = (): void => {
  router.push('/educations')
}

const downloadFile = (file: { name: string; url: string }): void => {
  if (file.url) {
    window.open(file.url, '_blank', 'noopener,noreferrer')
  }
}

const openDriveLink = (): void => {
  if (course.value?.link_drive) {
    window.open(course.value.link_drive, '_blank', 'noopener,noreferrer')
  }
}

const openYouTubeLink = (): void => {
  if (course.value?.link_youtube) {
    window.open(course.value.link_youtube, '_blank', 'noopener,noreferrer')
  }
}

// Lifecycle
onMounted(() => {
  fetchCourseDetail()
})
onMounted(async () => {
  await fetchCourseDetail()
  imgSrc.value = imageUrl.value ?? '/placeholder.png'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"/>
        <p class="text-gray-600 dark:text-gray-400">Memuat Materi...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Terjadi Kesalahan</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button 
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          @click="goBack"
        >
          Kembali ke Daftar Materi
        </button>
      </div>
    </div>

    <!-- Course Detail Content -->
    <div v-else-if="course" class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
        <!-- Back Button -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <button 
            class="flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
            @click="goBack"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Kembali ke Daftar Materi
          </button>
        </div>

        <!-- Course Header -->
        <div class="relative">
          <!-- Hero Image -->
          <div class="h-64 md:h-80 overflow-hidden">
             <img
                :src="imgSrc"
                :alt="course.title"
                class="w-full h-full object-cover"
                @error="handleImgError"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
          </div>
          
          <!-- Course Info Overlay -->
          <div :class="imageUrl ? 'absolute bottom-0 left-0 right-0 p-6 text-white' : 'p-6'">
            <div class="flex items-center space-x-3 mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                {{ formatCategory(course.category) }}
              </span>
              
              <span v-if="course.duration" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ course.duration }}
              </span>
            </div>
            
            <h1 :class="imageUrl ? 'text-3xl md:text-4xl font-bold mb-4' : 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'">
              {{ course.title }}
            </h1>
            
            <div class="flex items-center space-x-6 text-sm">
              <div v-if="course.instructor" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span :class="imageUrl ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'">{{ course.instructor }}</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span :class="imageUrl ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'">{{ formatDate(course.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Deskripsi Materi</h2>
            
            <div v-if="course.description" class="prose dark:prose-invert max-w-none">
              <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {{ course.description }}
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p class="text-gray-500 dark:text-gray-400">Deskripsi belum tersedia</p>
            </div>
          </div>
        </div>

        <!-- Sidebar - Resources -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Sumber Pembelajaran</h3>
            
            <div v-if="hasResources" class="space-y-6">
              <!-- Files Section -->
              <div v-if="hasFiles">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <div class="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center mr-2">
                    <svg class="w-4 h-4 text-green-800 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  Materi & Dokumen
                </h4>
                
                <div class="space-y-3">
                  <button
                    v-for="(file, index) in course.files"
                    :key="index"
                    class="flex items-center justify-between w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-green-50 hover:to-green-100 dark:hover:from-green-900/30 dark:hover:to-green-800/30 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300 rounded-lg transition-all duration-300 group"
                    @click="downloadFile(file)"
                  >
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5 text-green-800 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <span class="font-medium text-left">{{ file.name || `Dokumen ${index + 1}` }}</span>
                    </div>
                    <svg class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Links Section -->
              <div v-if="hasLinks">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center mr-2">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                  </div>
                  Link Pembelajaran
                </h4>
                
                <div class="space-y-3">
                  <!-- Google Drive Link -->
                  <button
                    v-if="course.link_drive"
                    class="flex items-center justify-between w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/40 dark:hover:to-emerald-800/40 text-green-700 dark:text-green-300 rounded-lg transition-all duration-300 group"
                    @click="openDriveLink"
                  >
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5 text-green-800 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 01-6.033-6.032 6.033 6.033 0 016.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748L12.545 10.239z"/>
                        </svg>
                      </div>
                      <div class="text-left">
                        <p class="font-semibold">Google Drive</p>
                        <p class="text-sm opacity-75">Akses file dan gambar teknis</p>
                      </div>
                    </div>
                    <svg class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </button>

                  <!-- YouTube Link -->
                  <!-- <button
                    v-if="course.link_youtube"
                    class="flex items-center justify-between w-full p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-800/40 dark:hover:to-pink-800/40 text-red-700 dark:text-red-300 rounded-lg transition-all duration-300 group"
                    @click="openYouTubeLink"
                  >
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5 text-red-800 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <div class="text-left">
                        <p class="font-semibold">YouTube</p>
                        <p class="text-sm opacity-75">Video pembelajaran & tutorial</p>
                      </div>
                    </div>
                    <svg class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </button> -->
                </div>
              </div>
            </div>

            <!-- No Resources Message -->
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <p class="text-gray-500 dark:text-gray-400 font-medium">Materi sedang dipersiapkan</p>
              <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Segera hadir dengan konten pembelajaran terbaik</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.prose ul, .prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>