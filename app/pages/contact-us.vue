<script setup lang="ts">
  definePageMeta({
    title: 'Contact Us',
    description: "Connect with Juru Tani: We're here to help farmers succeed!",
    navOrder: '11',
    type: 'secondary',
    icon: 'i-mdi-message-text-outline',
  })

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
      question: 'What services does Juru Tani provide?',
      answer: 'Juru Tani offers comprehensive agricultural advisory services, farming technology solutions, crop management systems, market connection platforms, and educational resources for sustainable farming practices.'
    },
    {
      question: 'How can I join the Juru Tani community?',
      answer: 'You can register through our mobile app or website. Once registered, you\'ll gain access to our knowledge base, community forums, and personalized agricultural services.'
    },
    {
      question: 'Is Juru Tani available in my region?',
      answer: 'Juru Tani currently serves multiple regions across Indonesia. Please contact our support team with your specific location to check availability in your area.'
    }
  ]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900">
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
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch with Juru Tani</h1>
          <p class="text-lg md:text-xl text-green-100 mb-10">We're here to support farmers and agricultural communities. Let us know how we can help you grow.</p>
          <div class="flex justify-center">
            <UButton size="lg" class="bg-white text-green-700 hover:bg-green-50" @click="$scrollTo('#contact-form')">
              Contact Us Now
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
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Call Us</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Our customer service team is available Monday to Friday, 8am to 5pm.</p>
          <div class="font-medium text-green-600 dark:text-green-400">+62 812 3456 7890</div>
          <div class="font-medium text-green-600 dark:text-green-400">+62 21 987 6543</div>
        </div>

        <!-- Contact card 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mb-6">
            <UIcon name="i-heroicons-envelope" class="text-green-600 dark:text-green-300 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Email Us</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
          <div class="font-medium text-green-600 dark:text-green-400">info@jurutani.com</div>
          <div class="font-medium text-green-600 dark:text-green-400">support@jurutani.com</div>
        </div>

        <!-- Contact card 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mb-6">
            <UIcon name="i-heroicons-map-pin" class="text-green-600 dark:text-green-300 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Visit Us</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Come visit our office for in-person assistance.</p>
          <div class="font-medium text-green-600 dark:text-green-400">Jalan Raya Pertanian No. 123</div>
          <div class="font-medium text-green-600 dark:text-green-400">Jakarta Selatan, Indonesia 12345</div>
        </div>
      </div>
    </div>

    <!-- Contact form and map section -->
    <div id="contact-form" class="container mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact form -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Send Us a Message</h2>
          
          <UAlert v-if="showSuccess" class="mb-6" color="green" variant="soft" title="Message Sent!">
            Thank you for reaching out. We'll get back to you shortly.
          </UAlert>
          
          <form @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <UFormGroup label="Full Name">
                <UInput 
                  v-model="contactForm.name" 
                  placeholder="Your name" 
                  class="border-gray-200 dark:border-gray-700"
                  required
                />
              </UFormGroup>
              
              <UFormGroup label="Email Address">
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
              <UFormGroup label="Phone Number">
                <UInput 
                  v-model="contactForm.phone" 
                  placeholder="+62 812 345 6789" 
                  class="border-gray-200 dark:border-gray-700"
                />
              </UFormGroup>
              
              <UFormGroup label="Subject">
                <UInput 
                  v-model="contactForm.subject" 
                  placeholder="How can we help?" 
                  class="border-gray-200 dark:border-gray-700"
                  required
                />
              </UFormGroup>
            </div>
            
            <UFormGroup label="Message" class="mb-6">
              <UTextarea 
                v-model="contactForm.message" 
                placeholder="Tell us about your inquiry or question..." 
                class="border-gray-200 dark:border-gray-700"
                :rows="3"
                required
              />
            </UFormGroup>
            
            <UButton 
              type="submit" 
              block 
              :loading="isSubmitting"
              :disabled="isSubmitting"
              class="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
            >
              <UIcon v-if="!isSubmitting" name="i-heroicons-paper-airplane" class="mr-2" />
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </UButton>
          </form>
        </div>
        
        <!-- Map -->
        <div class="lg:flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
          <div class="p-8">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Location</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              Find us at our headquarters in Jakarta. We're conveniently located near public transportation and have ample parking available.
            </p>
            <div class="flex items-center text-green-600 dark:text-green-400 mb-4">
              <UIcon name="i-heroicons-clock" class="mr-2" />
              <span>Open Monday - Friday, 8:00 AM - 5:00 PM</span>
            </div>
          </div>
          <div class="flex-grow relative min-h-[300px] bg-gray-200 dark:bg-gray-700">
            <!-- Placeholder for map (in a real app, you'd use an actual map component) -->
            <div class="absolute inset-0 bg-opacity-70 flex items-center justify-center">
              <img src="/jurutanicon.png" alt="Map of Juru Tani Office Location" class="w-full h-full object-cover" >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="container mx-auto px-6 py-16">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-12 text-center">Frequently Asked Questions</h2>
        
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
          <p class="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
          <UButton class="bg-green-600 hover:bg-green-700 text-white" to="#contact-form">Contact Our Support Team</UButton>
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