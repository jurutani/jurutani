<script setup lang="ts">
  definePageMeta({
    title: 'Help & FAQs',
    description: "Get answers to common questions about Juru Tani's agricultural services and platform",
    navOrder: '12',
    type: 'secondary',
    icon: 'i-heroicons-question-mark-circle',
  })

  // Category tabs
  const categories = [
    { id: 'general', name: 'General', icon: 'i-heroicons-information-circle' },
    { id: 'account', name: 'Account & Registration', icon: 'i-heroicons-user-circle' },
    { id: 'farming', name: 'Farming Advice', icon: 'i-heroicons-sparkles' },
    { id: 'marketplace', name: 'Marketplace', icon: 'i-heroicons-shopping-bag' },
    { id: 'technical', name: 'Technical Support', icon: 'i-heroicons-computer-desktop' }
  ]
  
  const activeCategory = ref('general')
  
  // FAQs data
  const faqs = {
    general: [
      {
        question: 'What is Juru Tani?',
        answer: 'Juru Tani is a comprehensive platform designed to support farmers with expert agricultural advice, technology solutions, market connections, and educational resources. Our mission is to empower agricultural communities through sustainable practices and innovative farming methods.'
      },
      {
        question: 'How can Juru Tani help my farming business?',
        answer: 'Juru Tani provides personalized crop management guidance, connects you with buyers for your produce, offers access to agricultural experts, provides weather and market insights, and shares best practices for sustainable farming. Our services are designed to increase productivity and profitability while promoting environmentally friendly approaches.'
      },
      {
        question: 'Is Juru Tani available throughout Indonesia?',
        answer: 'Juru Tani currently operates in major agricultural regions across Indonesia, including Java, Sumatra, Kalimantan, Sulawesi, and Bali. We are continuously expanding our coverage to reach more farming communities. Contact our team to check availability in your specific location.'
      },
      {
        question: 'What makes Juru Tani different from other agricultural services?',
        answer: 'Juru Tani combines traditional farming wisdom with modern technology and data-driven insights. Our platform offers end-to-end support including crop planning, pest management, harvest optimization, and market access—all in one integrated ecosystem. We also focus on community building, connecting farmers to share knowledge and resources.'
      }
    ],
    account: [
      {
        question: 'How do I create a Juru Tani account?',
        answer: 'To create an account, download the Juru Tani app from Google Play Store or Apple App Store, or visit our website. Click "Sign Up," provide your basic information including name, contact details, and location. Verify your phone number or email, and complete your farming profile to receive personalized recommendations.'
      },
      {
        question: 'Is there a fee to use Juru Tani services?',
        answer: 'Juru Tani offers both free and premium services. Basic features like weather updates, community forum access, and general farming tips are available free of charge. Premium services such as personalized crop management plans, priority expert consultations, and advanced market analytics require a subscription. Visit our pricing page for detailed information.'
      },
      {
        question: 'How do I reset my password?',
        answer: "If you forgot your password, click on Forgot Password on the login screen. Enter your registered email or phone number, and well send you a password reset link. Follow the instructions in the email or SMS to create a new password. For security reasons, links expire after 24 hours."
      },
      {
        question: 'Can I have multiple farm locations under one account?',
        answer: 'Yes, you can manage multiple farm locations under a single Juru Tani account. In your profile settings, find the "Farm Management" section and select "Add New Farm" to register additional locations. Each farm can have specific crop plans, soil information, and management schedules.'
      }
    ],
    farming: [
      {
        question: 'How does Juru Tani help with crop disease identification?',
        answer: 'Our mobile app allows you to take photos of affected plants and upload them to our AI-powered disease identification system. The system analyzes visual symptoms and provides potential disease diagnoses along with recommended treatments. For complex cases, our agricultural experts review the submissions and offer personalized advice within 24 hours.'
      },
      {
        question: 'Does Juru Tani provide soil analysis services?',
        answer: 'Yes, Juru Tani partners with certified agricultural laboratories to offer soil testing services. You can order a soil testing kit through our platform, collect samples following our guide, and send them to the nearest partner lab. Results are delivered digitally within 7-10 days, along with tailored recommendations for soil improvement and crop selection.'
      },
      {
        question: 'What kind of weather information does Juru Tani provide?',
        answer: 'Our platform offers hyperlocal weather forecasts including temperature, humidity, rainfall predictions, and severe weather alerts specific to your farm location. We also provide seasonal climate outlooks and historical weather data to help with long-term crop planning. Premium users receive customized notifications based on their specific crop requirements.'
      },
      {
        question: 'Can Juru Tani help me transition to organic farming?',
        answer: 'Absolutely! We offer comprehensive guidance for transitioning to organic or sustainable farming practices. Our platform provides step-by-step conversion plans, organic pest management techniques, natural fertilizer recipes, and connects you with certified organic advisors. We also help with organic certification processes and finding markets for organic produce.'
      }
    ],
    marketplace: [
      {
        question: 'How does the Juru Tani marketplace work?',
        answer: 'The Juru Tani marketplace connects farmers directly with buyers including retailers, processors, and consumers. Farmers can list their crops, expected harvest dates, quantities, and pricing. Interested buyers place orders, and our platform handles transaction security, payment processing, and delivery coordination to ensure a smooth experience for all parties.'
      },
      {
        question: 'How does Juru Tani ensure fair pricing for farmers?',
        answer: 'We provide real-time market price information so farmers can make informed decisions when setting prices. Our platform eliminates multiple middlemen, allowing farmers to capture more value. We also facilitate collective selling for small farmers to increase bargaining power, and our quality certification system helps farmers receive premium prices for superior produce.'
      },
      {
        question: 'What agricultural supplies can I purchase through Juru Tani?',
        answer: 'Our marketplace offers a wide range of agricultural inputs including quality seeds, organic and conventional fertilizers, pest control products, small farm equipment, irrigation supplies, and packaging materials. All products are vetted for quality and compliance with agricultural standards. Bulk purchasing options are available for farmer groups to access volume discounts.'
      },
      {
        question: 'How is delivery handled for marketplace transactions?',
        answer: 'Juru Tani partners with local logistics providers specializing in agricultural product transport. For crop sales, buyers can either arrange their own pickup or use our logistics network. For farm supplies, delivery is calculated based on weight and distance. We also organize collective delivery to neighboring farms to reduce transportation costs.'
      }
    ],
    technical: [
      {
        question: 'What devices and operating systems support the Juru Tani app?',
        answer: 'The Juru Tani mobile app is available for both Android (version 7.0 and above) and iOS (version 12.0 and above) devices. Our web platform works on all modern browsers including Chrome, Safari, Firefox, and Edge. For optimal performance, we recommend using the latest version of your operating system and browser.'
      },
      {
        question: 'Can I use Juru Tani offline?',
        answer: 'The Juru Tani mobile app includes offline functionality for essential features. You can access saved crop guides, previously downloaded market reports, and input your farm data while offline. Once your device reconnects to the internet, the app automatically syncs your data with our servers and updates with the latest information.'
      },
      {
        question: 'How secure is my farming and personal data on Juru Tani?',
        answer: 'We implement bank-level encryption and security protocols to protect your data. Your personal and farm information is never shared with third parties without your explicit consent. We utilize secure data centers, regular security audits, and follow international data protection standards. You can review and adjust your privacy settings at any time in your account.'
      },
      {
        question: 'How do I connect my weather station or soil sensors to Juru Tani?',
        answer: 'Juru Tani supports integration with major agricultural IoT devices. In the app, go to "Settings" > "Connected Devices" and select your device brand and model. Follow the step-by-step instructions to pair your sensors. Once connected, data flows automatically into your farm dashboard, enabling more precise recommendations and alerts based on real-time conditions.'
      }
    ]
  }

  // Search functionality
  const searchQuery = ref('')
  const searchResults = ref([])

  const performSearch = () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = []
      return
    }
    
    const query = searchQuery.value.toLowerCase()
    const results = []
    
    Object.keys(faqs).forEach(category => {
      faqs[category].forEach(faq => {
        if (faq.question.toLowerCase().includes(query) || 
            faq.answer.toLowerCase().includes(query)) {
          results.push({
            ...faq,
            category: categories.find(c => c.id === category).name
          })
        }
      })
    })
    
    searchResults.value = results
  }

  // Scroll to FAQ section
  const scrollToFaqs = () => {
    const element = document.getElementById('faq-categories')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Popular search terms
  const popularSearches = [
    'organic farming', 
    'pest control', 
    'rice cultivation', 
    'weather alerts', 
    'soil testing'
  ]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" stroke-width="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>
      
      <div class="container mx-auto px-6 py-16 sm:py-24 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">Help Center & FAQs</h1>
          <p class="text-lg md:text-xl text-green-100 mb-10">
            Find answers to common questions and learn how to make the most of Juru Tani's agricultural services.
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 flex items-center">
            <UIcon name="i-heroicons-magnifying-glass" class="text-gray-400 dark:text-gray-500 ml-4 text-xl" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search for answers..." 
              class="flex-grow px-4 py-2 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white"
              @keyup.enter="performSearch"
            >
            <UButton 
              color="green" 
              class="rounded-full px-6"
              @click="performSearch"
            >
              Search
            </UButton>
          </div>
          
          <!-- Popular Searches -->
          <div class="mt-6 flex flex-wrap justify-center gap-2">
            <span class="text-green-100 mr-2">Popular:</span>
            <UButton
              v-for="term in popularSearches"
              :key="term"
              variant="ghost"
              size="xs"
              color="white"
              class="rounded-full text-white hover:bg-white hover:bg-opacity-20"
              @click="searchQuery = term; performSearch()"
            >
              {{ term }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="container mx-auto px-6 py-10">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            Search Results ({{ searchResults.length }})
          </h2>
          <UButton 
            variant="ghost" 
            color="gray" 
            size="sm" 
            @click="searchResults = []; searchQuery = ''"
          >
            Clear Results
          </UButton>
        </div>
        
        <UAccordion class="bg-transparent" :ui="{ wrapper: 'border-b-0' }">
          <div 
            v-for="(result, index) in searchResults" 
            :key="index"
            class="bg-gray-50 dark:bg-gray-700 rounded-xl mb-4 border border-gray-100 dark:border-gray-600 overflow-hidden"
          >
            <div class="flex flex-col">
              <div class="p-4 flex justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-650 transition-colors">
                <div>
                  <div class="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    {{ result.category }}
                  </div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ result.question }}
                  </div>
                </div>
                <UIcon name="i-heroicons-chevron-down" class="text-gray-400" />
              </div>
              <div class="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-600">
                {{ result.answer }}
              </div>
            </div>
          </div>
        </UAccordion>
      </div>
    </div>
    
    <!-- Quick Help Categories -->
    <div class="container mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        Quick Help Categories
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Help Card 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-book-open" class="text-2xl text-green-600 dark:text-green-300" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">User Guides</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Step-by-step instructions for using all Juru Tani features and services.
          </p>
          <UButton color="green" variant="ghost" @click="scrollToFaqs">
            Browse Guides
          </UButton>
        </div>
        
        <!-- Help Card 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-video-camera" class="text-2xl text-green-600 dark:text-green-300" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Video Tutorials</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Watch visual demonstrations of farming techniques and platform usage.
          </p>
          <UButton color="green" variant="ghost" @click="scrollToFaqs">
            Watch Videos
          </UButton>
        </div>
        
        <!-- Help Card 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="text-2xl text-green-600 dark:text-green-300" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Community Forum</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Connect with other farmers to share knowledge and get community support.
          </p>
          <UButton color="green" variant="ghost" @click="scrollToFaqs">
            Join Discussion
          </UButton>
        </div>
        
        <!-- Help Card 4 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-phone" class="text-2xl text-green-600 dark:text-green-300" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Support</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Reach our dedicated support team for personalized assistance with any issues.
          </p>
          <UButton color="green" variant="ghost" to="/contact-us">
            Get Support
          </UButton>
        </div>
      </div>
    </div>
    
    <!-- FAQ Categories -->
    <div id="faq-categories" class="container mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        Frequently Asked Questions
      </h2>
      
      <!-- Category Tabs -->
      <div class="flex flex-wrap justify-center mb-10 gap-2">
        <UButton
          v-for="category in categories"
          :key="category.id"
          variant="soft"
          color="green"
          :class="activeCategory === category.id ? 'bg-green-600 text-white dark:bg-green-700' : ''"
          class="px-4 py-2 rounded-full"
          @click="activeCategory = category.id"
        >
          <UIcon :name="category.icon" class="mr-2" />
          {{ category.name }}
        </UButton>
      </div>
      
      <!-- FAQ Accordion -->
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <UAccordion :items="faqs[activeCategory]" :ui="{ wrapper: 'divide-y divide-gray-100 dark:divide-gray-700' }">
          <template #default="{ item, index, open }">
            <div class="p-5">
              <div class="flex justify-between items-center">
                <span class="font-medium text-lg text-gray-800 dark:text-white">{{ item.question }}</span>
                <UIcon 
                  :name="open ? 'i-heroicons-minus-circle' : 'i-heroicons-plus-circle'" 
                  class="text-xl text-green-600 dark:text-green-400"
                />
              </div>
            </div>
          </template>
          <template #item="{ item }">
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ item.answer }}
            </div>
          </template>
        </UAccordion>
      </div>
    </div>
    
    <!-- Can't Find Answer Section -->
    <div class="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 py-16">
      <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p class="text-green-100 mb-8">
            Our support team is ready to assist you with any questions or challenges you're facing.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton 
              to="/contact-us" 
              color="white" 
              class="text-green-700"
            >
              <UIcon name="i-heroicons-envelope" class="mr-2" />
              Contact Support
            </UButton>
            <UButton 
              variant="outline" 
              color="white" 
              class="text-white"
            >
              <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="mr-2" />
              Live Chat
            </UButton>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Support Resources -->
    <div class="container mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        Additional Resources
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Resource 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="h-40 bg-green-200 dark:bg-green-900 flex items-center justify-center">
            <UIcon name="i-heroicons-document-text" class="text-5xl text-green-700 dark:text-green-300" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Agricultural Guides
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Download comprehensive guides for various crops, growing techniques, and farming best practices.
            </p>
            <UButton variant="ghost" color="green" class="w-full">
              Browse Library
            </UButton>
          </div>
        </div>
        
        <!-- Resource 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="h-40 bg-green-200 dark:bg-green-900 flex items-center justify-center">
            <UIcon name="i-heroicons-academic-cap" class="text-5xl text-green-700 dark:text-green-300" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Farming Academy
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Access free online courses covering modern agricultural techniques, business skills, and technology adoption.
            </p>
            <UButton variant="ghost" color="green" class="w-full">
              Start Learning
            </UButton>
          </div>
        </div>
        
        <!-- Resource 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="h-40 bg-green-200 dark:bg-green-900 flex items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="text-5xl text-green-700 dark:text-green-300" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Webinars & Events
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Join live sessions with agricultural experts, participate in virtual field days, and community meetups.
            </p>
            <UButton variant="ghost" color="green" class="w-full">
              View Schedule
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the FAQ page */
:deep(.u-button.bg-green-600),
:deep(.u-button.dark\:bg-green-700) {
  border: none;
}

/* Custom animation for accordion */
:deep(.u-accordion-item) {
  transition: all 0.3s ease;
}

:deep(.u-accordion-item:hover) {
  background-color: rgba(0, 128, 0, 0.05);
}
</style>