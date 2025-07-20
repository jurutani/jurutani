<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'

// Reactive state
const isOpen = ref(false)
const showSplash = ref(true)
const isExpanded = ref(false)
const expandedMessages = ref(new Set())
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const inputRef = ref(null)
const hasSeenSplash = ref(false)

const messages = ref([
  {
    id: 1,
    type: 'bot',
    text: 'Halo! Saya adalah Jurutani AI, asisten penyuluh jurutani untuk pertanian, peternakan, dan pembangunan. Saya dapat membantu Anda dengan informasi tentang:\n\n• Teknik budidaya tanaman dan peternakan\n• Teknologi pertanian modern\n• Manajemen sumber daya alam\n• Pembangunan infrastruktur pertanian\n• Pemasaran hasil pertanian\n• Program pemerintah untuk petani\n\nAda yang ingin Anda tanyakan?',
    timestamp: new Date()
  }
])

// API Configuration
const GEMINI_API_KEY = 'AIzaSyB0B5HH0IPFc0eklYz4SpFdr_Lk90tGU2Q'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

// Methods
const openChat = () => {
  if (!hasSeenSplash.value) {
    showSplash.value = true
    isOpen.value = true
  } else {
    showSplash.value = false
    isOpen.value = true
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
      scrollToBottom()
    })
  }
}

const startChat = () => {
  hasSeenSplash.value = true
  showSplash.value = false
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    nextTick(() => {
      const element = messagesContainer.value
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      })
    })
  }
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const toggleMessageExpansion = (messageId) => {
  const newSet = new Set(expandedMessages.value)
  if (newSet.has(messageId)) {
    newSet.delete(messageId)
  } else {
    newSet.add(messageId)
  }
  expandedMessages.value = newSet
}

const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const shouldShowExpandButton = (message) => {
  return message.text.length > 150
}

const isMessageExpanded = (messageId) => {
  return expandedMessages.value.has(messageId)
}

const toggleChatExpansion = () => {
  isExpanded.value = !isExpanded.value
  nextTick(() => {
    scrollToBottom()
  })
}

const closeChat = () => {
  isOpen.value = false
}

const sendMessageToGemini = async (message) => {
  try {
    const systemPrompt = `Anda adalah Jurutani AI, asisten penyuluh jurutani yang ahli dan berpengalaman. Tugas Anda adalah memberikan penjelasan yang jelas, akurat, praktis, dan mudah dipahami dalam bahasa Indonesia.

    Bidang keahlian Anda meliputi:
    
    PERTANIAN:
    - Teknik budidaya tanaman pangan (padi, jagung, kedelai, dll)
    - Budidaya tanaman hortikultura (sayuran, buah-buahan)
    - Teknologi pertanian modern dan presisi
    - Manajemen hama dan penyakit tanaman
    - Pupuk dan nutrisi tanaman
    - Irigasi dan pengelolaan air
    - Pertanian organik dan berkelanjutan
    
    PETERNAKAN:
    - Budidaya ternak besar (sapi, kerbau, kambing)
    - Budidaya unggas (ayam, bebek, burung)
    - Perikanan dan akuakultur
    - Pakan ternak dan nutrisi
    - Kesehatan hewan dan pencegahan penyakit
    - Manajemen kandang dan lingkungan
    
    PEMBANGUNAN:
    - Infrastruktur pertanian (jalan tani, irigasi, gudang)
    - Teknologi pasca panen dan pengolahan
    - Koperasi dan kelembagaan petani
    - Pemasaran dan rantai nilai produk pertanian
    - Program pemerintah untuk petani
    - Ekonomi pertanian dan agribisnis
    - Pembangunan pedesaan
    
    LINGKUNGAN & KEBERLANJUTAN:
    - Konservasi tanah dan air
    - Adaptasi perubahan iklim
    - Energi terbarukan di pertanian
    - Pengelolaan limbah pertanian

    Instruksi penting:
    - Berikan jawaban yang praktis dan aplikatif untuk petani, peternak, dan masyarakat pedesaan
    - Gunakan bahasa Indonesia yang sederhana dan mudah dipahami
    - Sertakan tips praktis, langkah-langkah konkret, atau solusi yang bisa diterapkan
    - Batasi jawaban maksimal 5-6 kalimat agar mudah dibaca
    - Jika relevan, sebutkan program pemerintah atau bantuan yang tersedia
    - Jika pertanyaan di luar bidang keahlian, arahkan dengan sopan ke topik yang relevan
    - Prioritaskan keamanan dan keberlanjutan dalam setiap saran

    Pertanyaan: ${message}`

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error('Gagal menghubungi API Gemini')
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Error:', error)
    return 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi atau hubungi admin sistem.'
  }
}

const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = {
    id: messages.value.length + 1,
    type: 'user',
    text: inputMessage.value,
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const currentMessage = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true

  // Auto scroll after user sends message
  nextTick(() => {
    scrollToBottom()
  })

  try {
    const botResponse = await sendMessageToGemini(currentMessage)
    
    const botMessage = {
      id: messages.value.length + 1,
      type: 'bot',
      text: botResponse,
      timestamp: new Date()
    }

    messages.value.push(botMessage)
  } catch (error) {
    const errorMessage = {
      id: messages.value.length + 1,
      type: 'bot',
      text: 'Maaf, terjadi kesalahan sistem. Silakan coba lagi dalam beberapa saat.',
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
  }
}

// Handle Enter key for sending messages
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

// Watchers
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

watch(isOpen, (newVal) => {
  if (newVal && inputRef.value) {
    nextTick(() => {
      inputRef.value.focus()
    })
  }
})
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Bubble Button -->
    <div v-if="!isOpen" class="relative">
      <button
        @click="openChat"
        class="w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden border-2 border-green-400"
      >
        <img 
          src="/chatbot.png" 
          alt="Chatbot" 
          class="w-full h-full object-cover"
        />
      </button>
      <!-- Notification dot -->
      <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
    </div>

    <!-- Splash Screen -->
    <UCard 
      v-if="showSplash && isOpen"
      class="w-80 border-2 border-green-400 shadow-2xl"
      :ui="{ 
        base: 'transform transition-all duration-500',
        body: { padding: 'p-6' }
      }"
    >
      <div class="text-center space-y-4">
        <!-- Logo -->
        <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
          <UIcon name="i-heroicons-microphone" class="w-10 h-10 text-green-600" />
        </div>
        
        <!-- Title -->
        <div>
          <h1 class="text-xl font-bold text-green-700 mb-2">
            Jurutani AI
          </h1>
          <p class="text-gray-600 text-sm">
            Asisten Penyuluh Jurutani
          </p>
        </div>

        <!-- Description -->
        <p class="text-gray-700 text-sm leading-relaxed">
          Konsultasi pertanian, peternakan, dan pembangunan. 
          Mari mulai percakapan untuk solusi terbaik!
        </p>

        <!-- Start Button -->
        <UButton
          color="green"
          size="lg"
          block
          @click="startChat"
          class="hover:bg-green-700 transition-colors duration-200"
        >
          Mulai Konsultasi
        </UButton>
      </div>
    </UCard>

    <!-- Chat Window -->
    <UCard
      v-if="isOpen && !showSplash"
      :class="[
        'relative overflow-hidden border-2 border-green-400 shadow-2xl transition-all duration-300',
        isExpanded ? 'w-96 h-[600px]' : 'w-80 h-96'
      ]"
      :ui="{ body: { padding: 'p-0' } }"
    >
      <!-- Header -->
      <div class="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-green-500 text-white p-4 flex items-center justify-between z-10">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center shadow-inner">
            <UIcon name="i-heroicons-microphone" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-sm">Jurutani AI</h3>
            <p class="text-xs text-green-100">Penyuluh Jurutani</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <UButton
            :icon="isExpanded ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
            color="green"
            variant="ghost"
            size="xs"
            @click="toggleChatExpansion"
            class="hover:bg-white/20"
          />
          <UButton
            icon="i-heroicons-x-mark"
            color="green"
            variant="ghost"
            size="xs"
            @click="closeChat"
            class="hover:bg-white/20"
          />
        </div>
      </div>

      <!-- Messages Container with improved scrolling -->
      <div 
        ref="messagesContainer" 
        class="absolute top-20 bottom-20 left-0 right-0 overflow-y-scroll p-4 space-y-3 bg-gradient-to-b from-gray-50 to-gray-100 scroll-smooth"
        style="scroll-behavior: smooth;"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex animate-fade-in',
            message.type === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              isExpanded ? 'max-w-md' : 'max-w-xs',
              'px-3 py-2 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md',
              message.type === 'user'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white ml-4'
                : 'bg-white text-gray-800 mr-4 border border-gray-200'
            ]"
          >
            <div class="flex items-start space-x-2">
              <div v-if="message.type === 'bot'" class="flex-shrink-0 mt-0.5">
                <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                  <UIcon name="i-heroicons-microphone" class="w-3 h-3 text-green-600" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {{ shouldShowExpandButton(message) && !isMessageExpanded(message.id) 
                    ? truncateText(message.text) 
                    : message.text }}
                </p>
                
                <!-- Expand/Collapse button -->
                <UButton
                  v-if="shouldShowExpandButton(message)"
                  :icon="isMessageExpanded(message.id) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                  size="2xs"
                  variant="ghost"
                  :color="message.type === 'user' ? 'white' : 'gray'"
                  class="mt-1 hover:bg-black/10"
                  @click="toggleMessageExpansion(message.id)"
                >
                  {{ isMessageExpanded(message.id) ? 'Tutup' : 'Selengkapnya' }}
                </UButton>
                
                <p class="text-xs mt-1 opacity-70">
                  {{ formatTime(message.timestamp) }}
                </p>
              </div>
              <div v-if="message.type === 'user'" class="flex-shrink-0 mt-0.5">
                <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                  <UIcon name="i-heroicons-user" class="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-start animate-fade-in">
          <div :class="[
            isExpanded ? 'max-w-md' : 'max-w-xs',
            'px-3 py-2 rounded-lg bg-white text-gray-800 mr-4 border border-gray-200 shadow-sm'
          ]">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                <UIcon name="i-heroicons-microphone" class="w-3 h-3 text-green-600" />
              </div>
              <div class="flex items-center space-x-2">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-sm text-gray-500">Mengetik...</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Scroll anchor -->
        <div id="scroll-anchor" style="height: 1px;"></div>
      </div>

      <!-- Input Area - Fixed at bottom -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white z-20">
        <form class="flex space-x-2" @submit.prevent="handleSendMessage">
          <UInput
            ref="inputRef"
            v-model="inputMessage"
            placeholder="Tanya tentang pertanian..."
            :disabled="isLoading"
            size="sm"
            class="flex-1"
            @keydown="handleKeydown"
          />
          <UButton
            type="submit"
            :disabled="!inputMessage.trim() || isLoading"
            icon="i-heroicons-paper-airplane"
            color="green"
            size="sm"
            class="transition-all duration-200 hover:scale-105"
          />
        </form>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
/* Custom scrollbar styling */
.overflow-y-scroll::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #10b981, #059669);
  border-radius: 3px;
  transition: all 0.2s ease;
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #059669, #047857);
}

/* Firefox scrollbar */
.overflow-y-scroll {
  scrollbar-width: thin;
  scrollbar-color: #10b981 #f1f5f9;
}

/* Smooth animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Better text wrapping for long messages */
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Improved scroll behavior */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Enhanced hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:shadow-3xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>