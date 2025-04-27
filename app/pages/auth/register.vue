<!-- pages/auth/register.vue -->
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
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const currentStep = ref(1)
const totalSteps = 2

// Validasi sederhana
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validatePhone = (phone: string) => {
  return /^[0-9]{10,13}$/.test(phone)
}

const validatePassword = (password: string) => {
  return password.length >= 8
}

// Handler next step
const goToNextStep = () => {
  if (currentStep.value === 1) {
    if (!form.value.fullName || !form.value.email || !form.value.phone) {
      toast.add({
        title: 'Peringatan',
        description: 'Mohon lengkapi semua data diri Anda.',
        color: 'orange',
        icon: 'i-ph-warning-circle',
        timeout: 3000
      })
      return
    }

    if (!validateEmail(form.value.email)) {
      toast.add({
        title: 'Peringatan',
        description: 'Format email tidak valid.',
        color: 'orange',
        icon: 'i-ph-warning-circle',
        timeout: 3000
      })
      return
    }

    if (!validatePhone(form.value.phone)) {
      toast.add({
        title: 'Peringatan',
        description: 'Nomor telepon harus berisi 10-13 digit angka.',
        color: 'orange',
        icon: 'i-ph-warning-circle',
        timeout: 3000
      })
      return
    }
  }

  currentStep.value++
}

// Handler previous step
const goToPreviousStep = () => {
  currentStep.value--
}

// Handler register
const handleRegister = async () => {
  if (!form.value.password || !form.value.confirmPassword) {
    toast.add({
      title: 'Peringatan',
      description: 'Mohon isi kata sandi dan konfirmasi kata sandi.',
      color: 'orange',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  if (!validatePassword(form.value.password)) {
    toast.add({
      title: 'Peringatan',
      description: 'Kata sandi minimal harus 8 karakter.',
      color: 'orange',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    toast.add({
      title: 'Peringatan',
      description: 'Konfirmasi kata sandi tidak sesuai.',
      color: 'orange',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  if (!form.value.agreeTerms) {
    toast.add({
      title: 'Peringatan',
      description: 'Anda harus menyetujui syarat dan ketentuan.',
      color: 'orange',
      icon: 'i-ph-warning-circle',
      timeout: 3000
    })
    return
  }

  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1500)) // simulasi loading

    toast.add({
      title: 'Berhasil',
      description: 'Akun Anda berhasil terdaftar! Silakan periksa email untuk verifikasi.',
      color: 'green',
      icon: 'i-ph-check-circle',
      timeout: 3000
    })

    // Setelah register sukses
    // navigateTo('/auth/login')
  } catch (error) {
    toast.add({
      title: 'Gagal',
      description: 'Terjadi kesalahan saat mendaftarkan akun. Silakan coba lagi.',
      color: 'red',
      icon: 'i-ph-x-circle',
      timeout: 3000
    })
  } finally {
    isLoading.value = false
  }
}

// Handler social register
const handleSocialRegister = (provider: string) => {
  isLoading.value = true
  setTimeout(() => {
    toast.add({
      title: 'Info',
      description: `Pendaftaran dengan ${provider} akan tersedia.`,
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
          <p class="mt-2 text-green-100">Bergabung untuk masa depan pertanian yang lebih baik</p>
        </div>
        
        <div class="space-y-6">
          <!-- Highlight fitur -->
          <div class="flex items-start space-x-3">
            <Icon name="ph:star-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Komunitas Petani</h3>
              <p class="text-sm text-green-100">Terhubung dengan ribuan petani sukses di seluruh Indonesia</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <Icon name="ph:leaf-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Teknologi Pertanian</h3>
              <p class="text-sm text-green-100">Akses teknologi terbaru untuk meningkatkan hasil panen</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <Icon name="ph:chart-line-up-fill" class="w-6 h-6 text-green-300 mt-0.5" />
            <div>
              <h3 class="font-medium">Analisis Pertanian</h3>
              <p class="text-sm text-green-100">Pantau perkembangan lahan dengan data analitik yang akurat</p>
            </div>
          </div>
        </div>
        
        <div class="text-sm">
          &copy; 2025 Juru Tani. Teknologi untuk pertanian Indonesia.
        </div>
      </div>
    </div>
    
    <!-- Form register -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="lg:hidden flex items-center justify-center space-x-3 mb-8">
          <div class="bg-green-600 rounded-full p-2 shadow-md">
            <Icon name="ph:plant-fill" class="text-white w-6 h-6" />
          </div>
          <h1 class="text-xl font-bold text-green-600">Juru Tani</h1>
        </div>
        
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Buat Akun Baru</h2>
          <p class="text-gray-500 mt-2">Bergabung dengan platform Juru Tani</p>
        </div>
        
        <!-- Step indicator -->
        <div class="flex items-center justify-center mb-6">
          <div class="flex items-center space-x-1 w-full max-w-xs">
            <div 
              class="h-2 rounded-full flex-1 transition-colors"
              :class="currentStep >= 1 ? 'bg-green-600' : 'bg-gray-200'"
            />
            <div 
              class="h-2 rounded-full flex-1 transition-colors"
              :class="currentStep >= 2 ? 'bg-green-600' : 'bg-gray-200'"
            />
          </div>
        </div>
        
        <UCard class="shadow-sm border-0">
          <div v-if="currentStep === 1">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Data Diri</h3>
            <UFormGroup label="Nama Lengkap" name="fullName">
              <UInput
                v-model="form.fullName"
                placeholder="Masukkan nama lengkap"
                size="lg"
                :ui="{
                  icon: { trailing: { pointer: '' } },
                  base: 'relative block w-full rounded-lg',
                  input: 'placeholder:text-gray-400 focus:ring-2 focus:ring-green-500'
                }"
              >
                <template #trailing>
                  <Icon name="ph:user" class="text-gray-400" />
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="Email" name="email" class="mt-4">
              <UInput
                v-model="form.email"
                type="email"
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

            <UFormGroup label="Nomor Telepon" name="phone" class="mt-4">
              <UInput
                v-model="form.phone"
                placeholder="08xx-xxxx-xxxx"
                size="lg"
                :ui="{
                  icon: { trailing: { pointer: '' } },
                  base: 'relative block w-full rounded-lg',
                  input: 'placeholder:text-gray-400 focus:ring-2 focus:ring-green-500'
                }"
              >
                <template #trailing>
                  <Icon name="ph:phone" class="text-gray-400" />
                </template>
              </UInput>
            </UFormGroup>

            <div class="mt-6">
                <UButton
                    block
                    color="green"
                    :ui="{
                    base: 'rounded-lg py-3 font-medium text-base'
                    }"
                    @click="goToNextStep"
                >
                    Lanjutkan
                    <template #trailing>
                    <Icon name="ph:arrow-right" class="w-5 h-5" />
                    </template>
                </UButton>
            </div>
          </div>

          <div v-else-if="currentStep === 2">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Keamanan Akun</h3>
            <UFormGroup label="Kata Sandi" name="password">
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 8 karakter"
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

            <UFormGroup label="Konfirmasi Kata Sandi" name="confirmPassword" class="mt-4">
              <UInput
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Masukkan kembali kata sandi"
                size="lg"
                :ui="{
                  icon: { trailing: { pointer: 'cursor-pointer' } },
                  base: 'relative block w-full rounded-lg',
                  input: 'placeholder:text-gray-400 focus:ring-2 focus:ring-green-500'
                }"
              >
                <template #trailing>
                  <Icon
                    :name="showConfirmPassword ? 'ph:eye-slash' : 'ph:eye'"
                    class="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <div class="mt-4">
                <UCheckbox 
                    v-model="form.agreeTerms" 
                    name="agreeTerms" 
                    color="green"
                    :ui="{ 
                        wrapper: 'items-start',
                        label: 'text-sm text-gray-600'
                    }"
                    >
                    <template #label>
                        <span>
                        Saya menyetujui 
                        <UButton
                            variant="link"
                            to="/terms"
                            class="text-green-600 hover:text-green-700 p-0 font-medium underline-offset-2"
                        >
                            Syarat & Ketentuan
                        </UButton> 
                        dan 
                        <UButton
                            variant="link"
                            to="/privacy"
                            class="text-green-600 hover:text-green-700 p-0 font-medium underline-offset-2"
                        >
                            Kebijakan Privasi
                        </UButton>
                        </span>
                    </template>
                    </UCheckbox>

            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
                <UButton
                    variant="outline"
                    color="gray"
                    :ui="{
                    base: 'rounded-lg py-3 font-medium text-base',
                    color: {
                        gray: {
                        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }
                    }
                    }"
                    @click="goToPreviousStep"
                >
                    <template #leading>
                    <Icon name="ph:arrow-left" class="w-5 h-5" />
                    </template>
                    Kembali
                </UButton>

                <UButton
                    type="submit"
                    color="green"
                    :loading="isLoading"
                    :disabled="isLoading"
                    :ui="{
                    base: 'rounded-lg py-3 font-medium text-base',
                    color: {
                        green: {
                        solid: 'bg-green-600 hover:bg-green-700 focus:ring-green-300 text-white'
                        }
                    }
                    }"
                    @click="handleRegister"
                >
                    {{ isLoading ? 'Memproses...' : 'Daftar' }}
                </UButton>
            </div>
          </div>

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
                base: 'rounded-lg py-2.5 border border-gray-300',
                color: {
                    white: {
                    solid: 'bg-white hover:bg-gray-50 focus:ring-gray-200'
                    }
                }
                }"
                :disabled="isLoading"
                @click="handleSocialRegister('Google')"
            >
                <Icon name="logos:google-icon" class="mr-2 h-5 w-5" />
                Google
            </UButton>
            <UButton
                color="white"
                variant="outline"
                :ui="{
                base: 'rounded-lg py-2 border border-gray-300',
                color: {
                    white: {
                    solid: 'bg-white hover:bg-gray-50 focus:ring-gray-200'
                    }
                }
                }"
                :disabled="isLoading"
                @click="handleSocialRegister('Telepon')"
            >
              <Icon name="ph:phone-fill" class="mr-2 h-5 w-5 text-green-600" />
              Telepon
            </UButton>
          </div>
        </UCard>
        
        <div class="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?
          <UButton variant="link" to="/auth/login" class="text-green-600 hover:text-green-700 font-medium">
            Masuk sekarang
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>