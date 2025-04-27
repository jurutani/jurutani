<!-- pages/auth/login.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '#imports'

// Definisikan layout
definePageMeta({
  layout: 'blank'
})

const toast = useToast()

// State form
const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isLoading = ref(false)
const showPassword = ref(false)

// Handler login
const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    toast.add({
      title: 'Peringatan',
      description: 'Email dan kata sandi harus diisi.',
      color: 'orange',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000)) // simulasi loading

    toast.add({
      title: 'Berhasil',
      description: 'Selamat datang di Juru Tani!',
      color: 'green',
      icon: 'i-ph-check-circle',
      timeout: 3000
    })

    // Setelah login sukses
    // navigateTo('/dashboard')
  } catch (error) {
    toast.add({
      title: 'Gagal',
      description: 'Email atau kata sandi tidak valid.',
      color: 'red',
      icon: 'i-ph-x-circle',
      timeout: 3000
    })
  } finally {
    isLoading.value = false
  }
}

// Handler login sosial
const handleSocialLogin = (provider: string) => {
  isLoading.value = true
  setTimeout(() => {
    toast.add({
      title: 'Info',
      description: `Login dengan ${provider} akan tersedia.`,
      color: 'blue',
      icon: 'i-ph-info-circle',
      timeout: 3000
    })
    isLoading.value = false
  }, 800)
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
            <div class="bg-white rounded-full p-2 shadow-lg">
              <Icon name="ph:plant-fill" class="text-green-600 w-8 h-8" />
            </div>
            <h1 class="text-2xl font-bold">Juru Tani</h1>
          </div>
          <p class="mt-2 text-green-100">Mengelola pertanian dengan lebih pintar</p>
        </div>
        
        <div class="space-y-6">
          <!-- Highlight fitur -->
          <div class="flex items-start space-x-3">
            <Icon name="ph:check-circle-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Pantau Lahan</h3>
              <p class="text-sm text-green-100">Lacak kondisi lahan dengan data real-time</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <Icon name="ph:check-circle-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Prediksi Panen</h3>
              <p class="text-sm text-green-100">Estimasi hasil panen dengan teknologi AI</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <Icon name="ph:check-circle-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Manajemen Bibit</h3>
              <p class="text-sm text-green-100">Kelola stok dan kualitas bibit tanaman</p>
            </div>
          </div>
        </div>
        
        <div class="text-sm">
          &copy; 2025 Juru Tani. Teknologi untuk pertanian Indonesia.
        </div>
      </div>
    </div>
    
    <!-- Form login -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="lg:hidden flex items-center justify-center space-x-3 mb-8">
          <div class="bg-green-600 rounded-full p-2 shadow-md">
            <Icon name="ph:plant-fill" class="text-white w-6 h-6" />
          </div>
          <h1 class="text-xl font-bold text-green-600">Juru Tani</h1>
        </div>
        
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Selamat datang kembali</h2>
          <p class="text-gray-500 mt-2">Masuk untuk melanjutkan ke sistem Juru Tani</p>
        </div>
        
        <UCard class="shadow-sm border-0">
          <form @submit.prevent="handleLogin">
            <UFormGroup label="Email atau Username" name="email">
              <UInput
                v-model="form.email"
                placeholder="nama@example.com"
                size="lg"
                :ui="{
                  icon: { trailing: { pointer: '' } },
                  base: 'relative block w-full rounded-lg',
                  input: 'placeholder:text-gray-400 focus:ring-2 focus:ring-green-500'
                }"
              >
                <template #trailing>
                  <Icon name="ph:at" class="text-gray-400" />
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="Kata Sandi" name="password" class="mt-4">
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan kata sandi"
                size="lg"
                :ui="{
                  icon: { trailing: { pointer: 'cursor-pointer' } },
                  base: 'relative block w-full rounded-lg',
                  input: 'placeholder:text-gray-400 focus:ring-2 focus:ring-green-500'
                }"
              >
                <template #trailing>
                  <Icon
                    :name="showPassword ? 'ph:eye-slash' : 'ph:eye'"
                    class="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <div class="flex justify-between items-center mt-4">
              <UCheckbox 
                v-model="form.remember" 
                label="Ingat saya" 
                name="remember" 
                color="green"
                :ui="{ 
                  wrapper: 'items-center',
                  label: 'text-sm text-gray-600'
                }" 
              />
              <UButton 
                variant="link" 
                to="/auth/forgot-password" 
                class="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Lupa kata sandi?
              </UButton>
            </div>

            <div class="mt-6">
                <UButton
                    type="submit"
                    block
                    color="green"
                    :loading="isLoading"
                    :disabled="isLoading"
                    :ui="{
                        base: 'rounded-lg p-4 font-medium text-base',
                        color: {
                        green: {
                            solid: 'bg-green-600 hover:bg-green-700 focus:ring-green-300 text-white'
                        }
                        }
                    }"
                    >
                    <template #leading>
                        <Icon v-if="!isLoading" name="ph:sign-in" class="w-5 h-5" />
                    </template>
                    {{ isLoading ? 'Memproses...' : 'Masuk' }}
                    </UButton>

            </div>
          </form>

          <div class="relative flex items-center justify-center gap-3 my-6">
            <span class="h-px flex-1 bg-gray-200"/>
            <span class="text-sm text-gray-400">atau</span>
            <span class="h-px flex-1 bg-gray-200"/>
          </div>

          <div class="grid grid-cols-2 gap-3">
        <UButton
            color="white"
            variant="outline"
            :ui="{ 
            base: 'rounded-lg p-2', 
            color: {
                white: {
                solid: 'bg-white hover:bg-gray-50'
                }
            }
            }"
            :disabled="isLoading"
            @click="handleSocialLogin('Google')"
        >
            <Icon name="logos:google-icon" class="mr-2 h-5 w-5" />
            Google
        </UButton>

        <UButton
            color="white"
            variant="outline"
            :ui="{ 
            base: 'rounded-lg p-2', 
            color: {
                white: {
                solid: 'bg-white hover:bg-gray-50'
                }
            }
            }"
            :disabled="isLoading"
            @click="handleSocialLogin('Telepon')"
        >
            <Icon name="ph:phone-fill" class="mr-2 h-5 w-5 text-green-600" />
            Telepon
        </UButton>
        </div>

        </UCard>
        
        <div class="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?
          <UButton variant="link" to="/auth/register" class="text-green-600 hover:text-green-700 font-medium">
            Daftar sekarang
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>