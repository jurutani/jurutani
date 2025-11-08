<script setup lang="ts">
// SEO Optimization
useSeoOptimized('contact')

// Form handling
  const contactForm = ref({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const isSubmitting = ref(false)
  const showSuccess = ref(false)

  const handleSubmit = () => {
    isSubmitting.value = true
    // Simulate form submission
    setTimeout(() => {
      isSubmitting.value = false
      showSuccess.value = true
      
      // Reset form
      contactForm.value = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    }, 1000)
  }

  // FAQ data
  const faqs = [
  {
    question: 'Layanan apa saja yang disediakan oleh Juru Tani?',
    answer: 'Juru Tani menyediakan layanan konsultasi pertanian yang komprehensif, solusi teknologi pertanian, sistem manajemen tanaman, platform koneksi pasar, dan sumber belajar untuk praktik pertanian berkelanjutan.'
  },
  {
    question: 'Bagaimana cara bergabung dengan komunitas Juru Tani?',
    answer: 'Anda dapat mendaftar melalui aplikasi seluler atau situs web kami. Setelah terdaftar, Anda akan mendapatkan akses ke basis pengetahuan, forum komunitas, dan layanan pertanian yang dipersonalisasi.'
  },
  {
    question: 'Apakah Juru Tani tersedia di wilayah saya?',
    answer: 'Juru Tani saat ini melayani berbagai wilayah di seluruh Indonesia. Silakan hubungi tim dukungan kami dengan lokasi spesifik Anda untuk memeriksa ketersediaan di daerah Anda.'
  }
];

</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900 pt-20 lg:pt-32">
    <!-- Hero section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700">
      <div class="absolute inset-0 opacity-20">
        <svg class="h-full w-full" viewBox="0 0 800 800">
          <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"/>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"/>
        </svg>
      </div>
      <div class="container mx-auto px-6 py-20 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">Hubungi Tim JuruTani</h1>
          <p class="text-lg md:text-xl text-green-100 mb-10">Kami disini untuk membantu komunitas pertanian Indonesia agar semakin maju. Berikan kami pertanyaan mengenai masalah pertanian agar berkembang bersama sama.</p>
          <div class="flex justify-center">
            <UButton size="lg" class="bg-white text-green-700 hover:bg-green-50" @click="$scrollTo('#contact-form')">
              Hubungi sekarang
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact information cards -->
    <div class="container mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Contact card 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mb-6">
            <UIcon name="i-heroicons-phone" class="text-green-600 dark:text-green-300 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Telepon kami</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Layanan Panggilan Juru Tani tersedia di hari Senin - jumat </p>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Jam layanan : 09.00 - 16.00 WIB</p>
      <div class="font-medium text-green-600 dark:text-green-400">+62 815 7552 5260</div>
        </div>

        <!-- Contact card 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mb-6">
            <UIcon name="i-heroicons-envelope" class="text-green-600 dark:text-green-300 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Email kami</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Kirimi kami pesan email dan segera Tim Juru Tani akan meberikan respon secepatnya.</p>
          <div class="font-medium text-green-600 dark:text-green-400">si.jurutani@gmail.com</div>
        </div>

        <!-- Contact card 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mb-6">
            <UIcon name="i-heroicons-map-pin" class="text-green-600 dark:text-green-300 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Lokasi kami</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Mari datang dan berdiskusi dengan tim Juru Tani secara langsung.</p>
          <div class="font-medium text-green-600 dark:text-green-400">Jl. Kusumanegara No.2, Tahunan, Kec. Umbulharjo, </div>
          <div class="font-medium text-green-600 dark:text-green-400">Kota Yogyakarta, Daerah Istimewa Yogyakarta 55167</div>
        </div>
      </div>
    </div>

    <!-- Contact form and map section -->
    <div id="contact-form" class="container mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact form -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Kirim pesan untuk tim JuruTani</h2>
          
          <UAlert v-if="showSuccess" class="mb-6" color="green" variant="soft" title="Message Sent!">
            Terimakasih sudah menghubungi tim JuruTani, kami akan merespon pesan anda segera.
          </UAlert>
          
          <form @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <UFormGroup label="Nama lengkap">
                <UInput 
                  v-model="contactForm.name" 
                  placeholder="Masukan nama lengkap" 
                  class="border-gray-200 dark:border-gray-700"
                  required
                />
              </UFormGroup>
              
              <UFormGroup label="Email">
                <UInput 
                  v-model="contactForm.email" 
                  type="email" 
                  placeholder="email@example.com" 
                  class="border-gray-200 dark:border-gray-700"
                  required
                />
              </UFormGroup>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <UFormGroup label="Nomor telepon">
                <UInput 
                  v-model="contactForm.phone" 
                  placeholder="+62 812 345 6789" 
                  class="border-gray-200 dark:border-gray-700"
                />
              </UFormGroup>
              
              <UFormGroup label="Subjek">
                <UInput 
                  v-model="contactForm.subject" 
                  placeholder="bagaimana kami bisa membantu ?"
                  class="border-gray-200 dark:border-gray-700"
                  required
                />
              </UFormGroup>
            </div>
            
            <UFormGroup label="Pesan" class="mb-6">
              <UTextarea 
                v-model="contactForm.message" 
                placeholder="Masukan pesan anda..." 
                class="border-gray-200 dark:border-gray-700"
                :rows="3"
                required
              />
            </UFormGroup>
            
            <UButton 
              type="Kirim" 
              block 
              :loading="isSubmitting"
              :disabled="isSubmitting"
              class="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
            >
              <UIcon v-if="!isSubmitting" name="i-heroicons-paper-airplane" class="mr-2" />
              {{ isSubmitting ? 'Mengirim...' : 'Pesan terkirim' }}
            </UButton>
          </form>
        </div>
        
        <!-- Map -->
        <div class="lg:flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
          <div class="p-8">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Lokasi Kami</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              Jl. Kusumanegara No.2, Tahunan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55167.
            </p>
            <div class="flex items-center text-green-600 dark:text-green-400 mb-4">
              <UIcon name="i-heroicons-clock" class="mr-2" />
              <span>Buka senin - jum'at, 09:00 - 17:00 WIB</span>
            </div>
          </div>
          <div class="flex-grow relative min-h-[300px] bg-gray-200 dark:bg-gray-700">
            <!-- Placeholder for map (in a real app, you'd use an actual map component) -->
            <a href="https://maps.app.goo.gl/UPTBRghSuHci7GxR7?g_st=awb" target="_blank" class="absolute inset-0">
              <span class="sr-only">Lihat lokasi di Google Maps</span>
            <div class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
              <img src="/maps.png" alt="Map of Juru Tani Office Location" class="w-full h-full object-cover" >
            </div>
          </a>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="container mx-auto px-6 py-16">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-12 text-center">Pertanyaan Umum</h2>
        
        <UAccordion :items="faqs" class="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <template #default="{ item, index, open }">
            <div class="p-4">
              <div class="font-medium text-lg text-gray-800 dark:text-white flex items-center justify-between">
                {{ item.question }}
                <UIcon 
                  :name="open ? 'i-heroicons-minus-circle' : 'i-heroicons-plus-circle'" 
                  class="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
          </template>
          <template #item="{ item }">
            <div class="p-4 pt-0 text-gray-600 dark:text-gray-300">
              {{ item.answer }}
            </div>
          </template>
        </UAccordion>
        
        <div class="mt-10 text-center">
          <p class="text-gray-600 dark:text-gray-300 mb-4">Masih memiliki pertanyaan?</p>
          <UButton class="bg-green-600 hover:bg-green-700 text-white" to="#contact-form">Hubungi tim JuruTani</UButton>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
/* Custom animations and effects */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.floating {
  animation: float 3s ease-in-out infinite;
}
</style>