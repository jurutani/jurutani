<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
    <div class="max-w-md mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
          <Icon name="heroicons:envelope" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Email Actions</h1>
        <p class="text-gray-600 text-sm">
          Pilih aksi yang ingin Anda lakukan dengan email
        </p>
      </div>

      <!-- Action Tabs -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              :class="[
                'flex-1 py-4 px-6 text-sm font-semibold transition-colors duration-200',
                activeTab === 'change-email' 
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-gray-700'
              ]"
              @click="activeTab = 'change-email'"
            >
              <Icon name="heroicons:at-symbol" class="w-4 h-4 mr-2 inline" />
              Ganti Email
            </button>
            <button
              :class="[
                'flex-1 py-4 px-6 text-sm font-semibold transition-colors duration-200',
                activeTab === 'reset-password' 
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-gray-700'
              ]"
              @click="activeTab = 'reset-password'"
            >
              <Icon name="heroicons:key" class="w-4 h-4 mr-2 inline" />
              Reset Password
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Change Email Form -->
          <div v-if="activeTab === 'change-email'" class="space-y-6">
            <!-- Current Email Info -->
            <div class="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
              <div class="flex items-center">
                <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-400 mr-2" />
                <div>
                  <p class="text-sm font-medium text-gray-900">Email Saat Ini</p>
                  <p class="text-sm text-gray-600">{{ currentUser?.email || 'user@example.com' }}</p>
                </div>
              </div>
            </div>

            <form class="space-y-4" @submit.prevent="handleChangeEmail">
              <!-- New Email Input -->
              <div class="space-y-2">
                <label for="newEmail" class="block text-sm font-semibold text-gray-700">
                  Email Baru
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="heroicons:envelope" class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newEmail"
                    v-model="newEmail"
                    type="email"
                    placeholder="nama@email.com"
                    class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-green-500 
                           bg-white text-gray-900 placeholder-gray-500
                           transition-colors duration-200
                           hover:border-gray-400"
                    required
                  >
                </div>
                <p v-if="emailError" class="text-red-500 text-sm flex items-center mt-1">
                  <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mr-1" />
                  {{ emailError }}
                </p>
              </div>

              <!-- Warning Notice -->
              <div class="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div class="flex items-start">
                  <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div class="text-sm">
                    <p class="font-medium text-amber-800 mb-1">Perhatian</p>
                    <p class="text-amber-700">
                      Setelah mengubah email, Anda perlu mengkonfirmasi email baru melalui link yang dikirim. 
                      Email lama akan tetap aktif hingga konfirmasi selesai.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoadingChangeEmail || !newEmail"
                class="w-full bg-gradient-to-r from-green-600 to-emerald-600 
                       hover:from-green-700 hover:to-emerald-700 
                       disabled:from-gray-400 disabled:to-gray-500
                       text-white font-semibold py-3 px-4 rounded-lg 
                       transition-all duration-200 transform 
                       hover:scale-[1.02] active:scale-[0.98]
                       disabled:cursor-not-allowed disabled:transform-none
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                       shadow-lg hover:shadow-xl"
              >
                <span v-if="isLoadingChangeEmail" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Mengirim...
                </span>
                <span v-else class="flex items-center justify-center">
                  <Icon name="heroicons:paper-airplane" class="w-5 h-5 mr-2" />
                  Kirim Link Konfirmasi
                </span>
              </button>
            </form>
          </div>

          <!-- Reset Password Form -->
          <div v-else class="space-y-6">
            <!-- Info Section -->
            <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
              <div class="flex items-start">
                <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-blue-900 mb-1">Reset Password</p>
                  <p class="text-sm text-blue-800">
                    Masukkan email Anda untuk menerima link reset password. 
                    Link akan dikirim ke email yang terdaftar.
                  </p>
                </div>
              </div>
            </div>

            <form class="space-y-4" @submit.prevent="handleResetPassword">
              <!-- Email Input -->
              <div class="space-y-2">
                <label for="resetEmail" class="block text-sm font-semibold text-gray-700">
                  Email Akun
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="heroicons:envelope" class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="resetEmail"
                    v-model="resetEmail"
                    type="email"
                    placeholder="nama@email.com"
                    class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-green-500 focus:border-green-500 
                           bg-white text-gray-900 placeholder-gray-500
                           transition-colors duration-200
                           hover:border-gray-400"
                    required
                  >
                </div>
                <p v-if="resetEmailError" class="text-red-500 text-sm flex items-center mt-1">
                  <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mr-1" />
                  {{ resetEmailError }}
                </p>
              </div>

              <!-- Instructions -->
              <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                <div class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div class="text-sm">
                    <p class="font-medium text-green-800 mb-2">Langkah selanjutnya:</p>
                    <ol class="text-green-700 space-y-1 list-decimal list-inside">
                      <li>Cek kotak masuk email Anda</li>
                      <li>Klik link reset password</li>
                      <li>Masukkan password baru Anda</li>
                      <li>Login dengan password baru</li>
                    </ol>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoadingResetPassword || !resetEmail"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
                       hover:from-blue-700 hover:to-indigo-700 
                       disabled:from-gray-400 disabled:to-gray-500
                       text-white font-semibold py-3 px-4 rounded-lg 
                       transition-all duration-200 transform 
                       hover:scale-[1.02] active:scale-[0.98]
                       disabled:cursor-not-allowed disabled:transform-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       shadow-lg hover:shadow-xl"
              >
                <span v-if="isLoadingResetPassword" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Mengirim...
                </span>
                <span v-else class="flex items-center justify-center">
                  <Icon name="heroicons:key" class="w-5 h-5 mr-2" />
                  Kirim Link Reset Password
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div class="flex items-center justify-between text-sm">
            <button 
              type="button"
              class="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center"
              @click="$router.back()"
            >
              <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </button>
            <div class="flex items-center text-gray-500">
              <Icon name="heroicons:shield-check" class="w-4 h-4 mr-1" />
              <span>Aman & Terenkripsi</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Help Text -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Butuh bantuan? 
          <NuxtLink to="/bantuan" class="text-green-600 hover:text-green-700 font-medium hover:underline">
            Hubungi Support
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { toastStore } from '~/composables/useJuruTaniToast'

const { supabase, user: currentUser } = useSupabase()

// SEO Meta
useHead({
  title: 'Email Actions - JuruTani',
  meta: [
    { name: 'description', content: 'Ganti email atau reset password akun JuruTani Anda dengan mudah dan aman.' }
  ]
})

// State management
const activeTab = ref('change-email')
const newEmail = ref('')
const resetEmail = ref('')
const isLoadingChangeEmail = ref(false)
const isLoadingResetPassword = ref(false)
const emailError = ref('')
const resetEmailError = ref('')

// Email validation
const validateEmail = (email: string) => {
  if (!email) return 'Email wajib diisi'
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!emailRegex.test(email)) {
    return 'Format email tidak valid'
  }
  
  return ''
}

// Watch for email changes to validate
watch(newEmail, (value) => {
  emailError.value = validateEmail(value)
})

watch(resetEmail, (value) => {
  resetEmailError.value = validateEmail(value)
})

// Handle change email
const handleChangeEmail = async () => {
  const validation = validateEmail(newEmail.value)
  if (validation) {
    emailError.value = validation
    return
  }

  // Check if new email is same as current email
  if (newEmail.value.toLowerCase().trim() === currentUser.value?.email?.toLowerCase()) {
    emailError.value = 'Email baru tidak boleh sama dengan email saat ini'
    return
  }

  isLoadingChangeEmail.value = true
  emailError.value = ''

  try {
    const { error } = await supabase.auth.updateUser({ 
      email: newEmail.value.toLowerCase().trim() 
    })

    if (error) {
      let errorMessage = 'Gagal mengubah email'
      
      if (error.message.includes('rate_limit')) {
        errorMessage = 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.'
      } else if (error.message.includes('email_address_invalid')) {
        errorMessage = 'Format email tidak valid'
      } else if (error.message.includes('signup_disabled')) {
        errorMessage = 'Pendaftaran email baru sedang dinonaktifkan'
      } else if (error.message.includes('email_address_taken')) {
        errorMessage = 'Email sudah digunakan oleh akun lain'
      }
      
      toastStore.error(errorMessage)
      emailError.value = errorMessage
    } else {
      toastStore.success('Link konfirmasi berhasil dikirim! Silakan cek kotak masuk email baru Anda dan klik link konfirmasi.')
      newEmail.value = ''
    }
  } catch (error) {
    console.error('Email update error:', error)
    toastStore.error('Terjadi kesalahan sistem. Silakan coba lagi.')
  } finally {
    isLoadingChangeEmail.value = false
  }
}

// Handle reset password
const handleResetPassword = async () => {
  const validation = validateEmail(resetEmail.value)
  if (validation) {
    resetEmailError.value = validation
    return
  }

  isLoadingResetPassword.value = true
  resetEmailError.value = ''

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      resetEmail.value.toLowerCase().trim(),
      {
        redirectTo: `${window.location.origin}/reset-password`
      }
    )

    if (error) {
      let errorMessage = 'Gagal mengirim link reset password'
      
      if (error.message.includes('rate_limit')) {
        errorMessage = 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.'
      } else if (error.message.includes('email_not_confirmed')) {
        errorMessage = 'Email belum dikonfirmasi. Silakan konfirmasi email terlebih dahulu.'
      } else if (error.message.includes('user_not_found')) {
        errorMessage = 'Email tidak terdaftar di sistem'
      }
      
      toastStore.error(errorMessage)
      resetEmailError.value = errorMessage
    } else {
      toastStore.success('Link reset password berhasil dikirim! Silakan cek kotak masuk email Anda.')
      resetEmail.value = ''
    }
  } catch (error) {
    console.error('Reset password error:', error)
    toastStore.error('Terjadi kesalahan sistem. Silakan coba lagi.')
  } finally {
    isLoadingResetPassword.value = false
  }
}

// Auto-fill current user email for reset password when switching tabs
watch(activeTab, (newTab) => {
  if (newTab === 'reset-password' && currentUser.value?.email) {
    resetEmail.value = currentUser.value.email
  }
})

// Auto-focus inputs when component mounts or tab changes
onMounted(() => {
  const emailInput = document.getElementById('newEmail')
  if (emailInput) {
    emailInput.focus()
  }
})

watch(activeTab, () => {
  nextTick(() => {
    const inputId = activeTab.value === 'change-email' ? 'newEmail' : 'resetEmail'
    const input = document.getElementById(inputId)
    if (input) {
      input.focus()
    }
  })
})
</script>