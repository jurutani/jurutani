<template>
  <div class="max-w-2xl mx-auto py-12 space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Pengaturan Akun</h2>
      <p class="text-gray-600">Kelola email dan password akun Anda</p>
    </div>

    <!-- Email Settings -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div class="flex items-center mb-6">
        <Icon name="i-heroicons:envelope" class="w-6 h-6 text-green-600 mr-3" />
        <h3 class="text-lg font-semibold text-gray-900">Pengaturan Email</h3>
      </div>

      <!-- Current Email Display -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
        <p class="text-sm font-medium text-gray-700 mb-1">Email Saat Ini</p>
        <p class="text-gray-900 font-medium">{{ currentUser?.email || 'Tidak ada email' }}</p>
      </div>

      <!-- Change Email Form -->
      <form class="space-y-4" @submit.prevent="handleChangeEmail">
        <div>
          <label for="newEmail" class="block text-sm font-medium text-gray-700 mb-2">
            Email Baru
          </label>
          <div class="relative">
            <input
              id="newEmail"
              v-model="newEmail"
              type="email"
              placeholder="masukkan@email.baru"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              :class="{ 'border-red-300': emailError }"
              required
            >
          </div>
          <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
        </div>

        <div>
          <label for="confirmEmail" class="block text-sm font-medium text-gray-700 mb-2">
            Konfirmasi Email Baru
          </label>
          <input
            id="confirmEmail"
            v-model="confirmEmail"
            type="email"
            placeholder="konfirmasi email baru"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            :class="{ 'border-red-300': confirmEmailError }"
            required
          >
          <p v-if="confirmEmailError" class="text-red-500 text-sm mt-1">{{ confirmEmailError }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoadingChangeEmail || !isEmailFormValid"
          class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <span v-if="isLoadingChangeEmail" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Mengubah Email...
          </span>
          <span v-else>Ubah Email</span>
        </button>
      </form>
    </div>

    <!-- Password Settings -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div class="flex items-center mb-6">
        <Icon name="i-heroicons:key" class="w-6 h-6 text-blue-600 mr-3" />
        <h3 class="text-lg font-semibold text-gray-900">Pengaturan Password</h3>
      </div>

      <form class="space-y-4" @submit.prevent="handleResetPassword">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
          <div class="flex items-start">
            <Icon name="i-heroicons:information-circle" class="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div class="text-sm text-blue-800">
              <p class="font-medium mb-1">Reset Password</p>
              <p>Kami akan mengirim link reset password ke email Anda.</p>
            </div>
          </div>
        </div>

        <div>
          <label for="resetEmail" class="block text-sm font-medium text-gray-700 mb-2">
            Email Akun
          </label>
          <input
            id="resetEmail"
            v-model="resetEmail"
            type="email"
            placeholder="email@akun.anda"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="{ 'border-red-300': resetEmailError }"
            required
          >
          <p v-if="resetEmailError" class="text-red-500 text-sm mt-1">{{ resetEmailError }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoadingResetPassword || !resetEmail"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          <span v-if="isLoadingResetPassword" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Mengirim Link...
          </span>
          <span v-else>Kirim Link Reset Password</span>
        </button>
      </form>
    </div>

    <!-- Success Messages -->
    <div v-if="successMessage" class="bg-green-50 rounded-lg p-4 border border-green-200">
      <div class="flex items-start">
        <Icon name="i-heroicons:check-circle" class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
        <p class="text-sm text-green-800">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { toastStore } from '~/composables/useJuruTaniToast'
import { useProfile } from '~/composables/useProfile';

const {
  userData,
  loading,
  error,
  isEditing,
  fetchUserData,
  updateUserProfile,
  formatDate,
  formatRole,
  isValidUrl
} = useProfile();

const { supabase } = useSupabase()

// Get current user from Supabase auth
const currentUser = ref(null)

// State
const newEmail = ref('')
const confirmEmail = ref('')
const resetEmail = ref('')
const isLoadingChangeEmail = ref(false)
const isLoadingResetPassword = ref(false)
const emailError = ref('')
const confirmEmailError = ref('')
const resetEmailError = ref('')
const successMessage = ref('')

// Function to get current user
const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    currentUser.value = user
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Email validation
const validateEmail = (email: string) => {
  if (!email) return 'Email wajib diisi'
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (!emailRegex.test(email)) return 'Format email tidak valid'
  return ''
}

// Computed properties
const isEmailFormValid = computed(() => {
  return newEmail.value && 
         confirmEmail.value && 
         newEmail.value === confirmEmail.value && 
         !emailError.value && 
         !confirmEmailError.value &&
         newEmail.value.toLowerCase() !== currentUser.value?.email?.toLowerCase()
})

// Watchers for real-time validation
watch(newEmail, (value) => {
  emailError.value = validateEmail(value)
  if (value && currentUser.value?.email && value.toLowerCase() === currentUser.value.email.toLowerCase()) {
    emailError.value = 'Email baru harus berbeda dengan email saat ini'
  }
  // Revalidate confirmation email
  if (confirmEmail.value && value !== confirmEmail.value) {
    confirmEmailError.value = 'Email konfirmasi tidak cocok'
  } else if (confirmEmail.value && value === confirmEmail.value) {
    confirmEmailError.value = ''
  }
})

watch(confirmEmail, (value) => {
  if (value && newEmail.value && value !== newEmail.value) {
    confirmEmailError.value = 'Email konfirmasi tidak cocok'
  } else if (value && newEmail.value && value === newEmail.value) {
    confirmEmailError.value = ''
  }
})

watch(resetEmail, (value) => {
  resetEmailError.value = validateEmail(value)
})

// Handle change email
const handleChangeEmail = async () => {
  // Clear previous messages
  successMessage.value = ''
  
  // Validate inputs
  const newEmailValidation = validateEmail(newEmail.value)
  const confirmEmailValidation = validateEmail(confirmEmail.value)
  
  if (newEmailValidation) {
    emailError.value = newEmailValidation
    return
  }
  
  if (confirmEmailValidation) {
    confirmEmailError.value = confirmEmailValidation
    return
  }
  
  if (newEmail.value !== confirmEmail.value) {
    confirmEmailError.value = 'Email konfirmasi tidak cocok'
    return
  }
  
  if (newEmail.value.toLowerCase() === currentUser.value?.email?.toLowerCase()) {
    emailError.value = 'Email baru harus berbeda dengan email saat ini'
    return
  }

  isLoadingChangeEmail.value = true
  emailError.value = ''
  confirmEmailError.value = ''

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
      } else if (error.message.includes('email_address_taken')) {
        errorMessage = 'Email sudah digunakan oleh akun lain'
      }
      
      emailError.value = errorMessage
      toastStore.error(errorMessage)
    } else {
      successMessage.value = 'Link konfirmasi berhasil dikirim ke email baru Anda. Silakan cek kotak masuk dan klik link konfirmasi.'
      toastStore.success('Email berhasil diubah! Cek email baru untuk konfirmasi.')
      newEmail.value = ''
      confirmEmail.value = ''
    }
  } catch (error) {
    console.error('Email update error:', error)
    emailError.value = 'Terjadi kesalahan sistem. Silakan coba lagi.'
    toastStore.error('Terjadi kesalahan sistem. Silakan coba lagi.')
  } finally {
    isLoadingChangeEmail.value = false
  }
}

// Handle reset password
const handleResetPassword = async () => {
  // Clear previous messages
  successMessage.value = ''
  
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
      } else if (error.message.includes('user_not_found')) {
        errorMessage = 'Email tidak terdaftar di sistem'
      }
      
      resetEmailError.value = errorMessage
      toastStore.error(errorMessage)
    } else {
      successMessage.value = 'Link reset password berhasil dikirim ke email Anda. Silakan cek kotak masuk.'
      toastStore.success('Link reset password berhasil dikirim!')
      resetEmail.value = ''
    }
  } catch (error) {
    console.error('Reset password error:', error)
    resetEmailError.value = 'Terjadi kesalahan sistem. Silakan coba lagi.'
    toastStore.error('Terjadi kesalahan sistem. Silakan coba lagi.')
  } finally {
    isLoadingResetPassword.value = false
  }
}

// Initialize component
onMounted(async () => {
  await fetchUserData()
  const user = await getCurrentUser()
  
  // Auto-fill current user email for reset password
  if (user?.email) {
    resetEmail.value = user.email
  }
})

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    currentUser.value = session.user
    if (session.user.email && !resetEmail.value) {
      resetEmail.value = session.user.email
    }
  } else {
    currentUser.value = null
    resetEmail.value = ''
  }
})
</script>