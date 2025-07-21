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
const imageUrl = computed(() => {
  if (!course.value?.image_url) return null
  
  // Check if it's already a full URL
  if (course.value.image_url.startsWith('http')) {
    return course.value.image_url
  }
  
  // Get public URL from Supabase storage with correct bucket structure
  const { data } = supabase.storage
    .from('courses')
    .getPublicUrl(`images/${course.value.id}/${course.value.image_url}`)
  
  return data.publicUrl
})

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
    // Check if it's already a full URL
    if (file.url.startsWith('http')) {
      window.open(file.url, '_blank', 'noopener,noreferrer')
    } else {
      // Get public URL from Supabase storage with correct bucket structure
      const { data } = supabase.storage
        .from('courses')
        .getPublicUrl(`files/${course.value?.id}/${file.url}`)
      
      if (data.publicUrl) {
        window.open(data.publicUrl, '_blank', 'noopener,noreferrer')
      }
    }
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
</script>

<template>
  <div class="min-h-screen py-14">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button 
            class="flex items-center gap-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            @click="goBack"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            <span class="font-medium">Kembali ke Daftar Materi</span>
          </button>
          
          <div class="flex items-center gap-2 text-green-700 dark:text-green-400">
            <UIcon name="i-heroicons-academic-cap" class="w-5 h-5" />
            <span class="font-semibold">Juru Tani Edu</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
        <p class="text-gray-600 dark:text-gray-400 mt-4">Memuat Materi...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Oops! Terjadi Kesalahan</h3>
          <p class="text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
          <UButton color="red" variant="outline" @click="goBack">
            Kembali ke Daftar Materi
          </UButton>
        </div>
      </div>

      <!-- Course Detail Content -->
      <div v-else-if="course" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Course Header -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <!-- Hero Image -->
            <div class="relative h-64 md:h-80 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
              <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="course.title"
                class="w-full h-full object-cover"
                @error="console.log('Image failed to load:', imageUrl)"
              >
              <div v-else class="flex items-center justify-center h-full">
                <div class="text-center text-green-600 dark:text-green-400">
                  <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p class="text-sm opacity-75">Tidak ada gambar</p>
                </div>
              </div>

              <!-- Badges -->
              <div class="absolute top-4 right-4 flex flex-col gap-2">
                <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full shadow-sm">
                  <UIcon name="i-heroicons-light-bulb" class="w-3 h-3" />
                  {{ formatCategory(course.category) }}
                </span>
                
                <span v-if="course.duration" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full shadow-sm">
                  <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                  {{ course.duration }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 md:p-8">
              <!-- Title -->
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {{ course.title }}
              </h1>

              <!-- Meta Information -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div v-if="course.instructor" class="flex items-center gap-1">
                  <UIcon name="i-heroicons-user" class="w-4 h-4" />
                  <span>{{ course.instructor }}</span>
                </div>
                
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  <span>{{ formatDate(course.created_at) }}</span>
                </div>
                
                <div v-if="course.updated_at && course.updated_at !== course.created_at" class="flex items-center gap-1">
                  <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                  <span>Diperbarui {{ formatDate(course.updated_at) }}</span>
                </div>
              </div>

              <!-- Description -->
              <div class="mb-8">
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Deskripsi Materi</h2>
                
                <div v-if="course.description" class="prose prose-lg max-w-none prose-green prose-headings:text-gray-900 prose-p:text-gray-700 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-gray-300">
                  <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {{ course.description }}
                  </div>
                </div>
                
                <div v-else class="text-center py-8">
                  <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p class="text-gray-500 dark:text-gray-400 font-medium">Deskripsi belum tersedia</p>
                  <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Segera hadir dengan konten pembelajaran terbaik</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Sidebar - Resources -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <UIcon name="i-heroicons-folder-open" class="w-5 h-5 text-green-600" />
              Sumber Pembelajaran
            </h3>
            
            <div v-if="hasResources" class="space-y-6">
              <!-- Files Section -->
              <div v-if="hasFiles">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <div class="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center mr-2">
                    <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-green-800 dark:text-green-400" />
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
                        <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-green-800 dark:text-green-400" />
                      </div>
                      <span class="font-medium text-left">{{ file.name || `Dokumen ${index + 1}` }}</span>
                    </div>
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>

              <!-- Links Section -->
              <div v-if="hasLinks">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center mr-2">
                    <UIcon name="i-heroicons-link" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>

                  <!-- YouTube Link -->
                  <button
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
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            </div>

            <!-- No Resources Message -->
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-folder" class="w-8 h-8 text-gray-400 dark:text-gray-500" />
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
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1.25rem;
}

.prose h1, .prose h2, .prose h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.prose h1 {
  font-size: 1.875rem;
}

.prose h2 {
  font-size: 1.5rem;
}

.prose h3 {
  font-size: 1.25rem;
}

.prose ul, .prose ol {
  margin: 1.25rem 0;
  padding-left: 1.75rem;
}

.prose li {
  margin: 0.75rem 0;
}

.prose blockquote {
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 4px solid #10b981;
  font-style: italic;
  color: #6b7280;
}

.dark .prose blockquote {
  color: #9ca3af;
  border-left-color: #34d399;
}
</style>