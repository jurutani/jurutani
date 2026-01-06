<script setup lang="ts">
// SEO Optimization
useSeoAuth('login')

definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})

const toastStore = usejuruTaniToast()
const { login, loginWithSocialProvider, loading } = useAuth()


const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isLoading = ref(false)
const showPassword = ref(false)

// Function to toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    toastStore.warning('Email dan kata sandi harus diisi.', 3000)
    return
  }

  try {
    isLoading.value = true

    const { success, error } = await login(form.value.email, form.value.password)

    if (success) {
      toastStore.success('Selamat datang di Juru Tani!', 3000)
      navigateTo('/')
    } else {
      toastStore.error(error || 'Email atau kata sandi tidak valid.', 3000)
    }
  } catch (error: any) {
    toastStore.error(error.message || 'Terjadi kesalahan saat login.', 3000)
  } finally {
    isLoading.value = false
  }
}

const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
  try {
    const { success, error: loginError } = await loginWithSocialProvider(provider)

    if (!success) {
      toastStore.error(
        loginError || `Login dengan ${provider} gagal.`,
        3000
      )
    }

  } catch (err: any) {
    const message = err?.message || 'Terjadi kesalahan saat login.'
    toastStore.error(message, 3000)
  }
}
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Side image - ilustrasi pertanian modern -->
    <div class="hidden lg:flex lg:w-1/2 bg-green-600 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-800 opacity-90"/>
      
      <!-- Pola abstrak -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 border-8 border-white rounded-full"/>
        <div class="absolute bottom-1/3 right-1/4 w-72 h-72 border-8 border-white rounded-full"/>
        <div class="absolute top-1/2 right-1/3 w-48 h-48 border-8 border-white rounded-full"/>
      </div>
      
      <!-- Info branding -->
      <div class="relative z-10 flex flex-col justify-between h-full p-12 text-white">
        <div>
          <div class="flex items-center space-x-3">
            <TheLogo />
          </div>
          <p class="mt-2 text-green-100">Mengelola pertanian dengan lebih pintar</p>
        </div>
        
        <div class="space-y-6">
          <!-- Highlight fitur -->
          <div class="flex items-start space-x-3">
            <UIcon name="i-ph-check-circle-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Pantau Lahan</h3>
              <p class="text-sm text-green-100">Lacak kondisi lahan dengan data real-time</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <UIcon name="i-ph-check-circle-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Prediksi Panen</h3>
              <p class="text-sm text-green-100">Estimasi hasil panen dengan teknologi AI</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <UIcon name="i-ph-check-circle-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Manajemen Bibit</h3>
              <p class="text-sm text-green-100">Kelola stok dan kualitas bibit tanaman</p>
            </div>
          </div>
        </div>
        
        <div class="text-sm">
          &copy; 2026 Juru Tani. Teknologi untuk pertanian Indonesia.
        </div>
      </div>
    </div>
    
    <!-- Form login -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="lg:hidden flex items-center justify-center space-x-3 mb-8">
          <TheLogo />
        </div>

        <!-- Heading -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Selamat datang kembali</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Masuk untuk melanjutkan ke sistem Juru Tani</p>
        </div>
        
        <UCard class="shadow-sm border-green-100 dark:border-green-700">
          <form @submit.prevent="handleLogin">
            <UFormField label="Email atau Username" name="email">
              <div class="relative">
                <UInput
                v-model="form.email"
                placeholder="nama@example.com"
                size="lg"
                class="w-full"
              />
                <div class="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
                  <UIcon name="i-lucide-mail" class="w-5 h-5" />
                </div>
              </div>
            </UFormField>

            <UFormField label="Kata Sandi" name="password" class="mt-4">
              <div class="relative">
                <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan kata sandi"
                size="lg"
                class="w-full"
              />
                <button
                  type="button"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors duration-200"
                  :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                  @click="togglePasswordVisibility"
                >
                  <UIcon 
                    :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" 
                    class="w-5 h-5" 
                  />
                </button>
              </div>
            </UFormField>

            <div class="flex justify-between items-center mt-4 px-2">
                <UCheckbox 
                v-model="form.remember" 
                label="Ingat saya" 
                name="remember"
                class="text-sm"
              />
              <UButton 
                variant="link" 
                to="/auth/forgot-password" 
                class="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
              >
                Lupa kata sandi?
              </UButton>
            </div>

            <div class="mt-6">
              <UButton
              type="submit"
              block
              color="primary"
              :loading="isLoading"
              :disabled="isLoading"
              class="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
                <template #leading>
                  <UIcon v-if="!isLoading" name="i-lucide-log-in" class="w-5 h-5" />
                </template>
                {{ isLoading ? 'Memproses...' : 'Masuk' }}
              </UButton>
            </div>
          </form>

          <div class="relative flex items-center justify-center gap-3 my-6">
            <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700"/>
            <span class="text-sm text-gray-400">atau</span>
            <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700"/>
          </div>

          <div class="grid grid-cols-1 place-items-center gap-3">
            <UButton
            variant="outline"
            :disabled="isLoading"
            class="bg-white cursor-pointer hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
            @click="handleSocialLogin('google')"
          >
              <UIcon name="i-logos-google-icon" class="mr-2 h-5 w-5" />
              Masuk dengan Google
            </UButton>
          </div>
        </UCard>
        
        <div class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Belum punya akun?
          <UButton 
            variant="link" 
            to="/auth/register" 
            class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            Daftar sekarang
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>