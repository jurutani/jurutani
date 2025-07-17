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
    text: 'Halo! Saya adalah Jurutani AI, asisten penyuluh untuk pertanian, peternakan, dan pembangunan. Saya dapat membantu Anda dengan informasi tentang:\n\n• Teknik budidaya tanaman dan peternakan\n• Teknologi pertanian modern\n• Manajemen sumber daya alam\n• Pembangunan infrastruktur pertanian\n• Pemasaran hasil pertanian\n• Program pemerintah untuk petani\n\nAda yang ingin Anda tanyakan?',
    timestamp: new Date()
  }
])

// API Configuration
const GEMINI_API_KEY = 'AIzaSyB0B5HH0IPFc0eklYz4SpFdr_Lk90tGU2Q'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

// Storage methods
const saveToStorage = (key, value) => {
  try {
    const data = JSON.parse(localStorage.getItem('jurrutani-chat') || '{}')
    data[key] = value
    localStorage.setItem('jurrutani-chat', JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to storage:', error)
  }
}

const getFromStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem('jurrutani-chat') || '{}')
    return data[key]
  } catch (error) {
    console.error('Error reading from storage:', error)
    return null
  }
}

// Initialize on mounted
onMounted(() => {
  const seenSplash = getFromStorage('hasSeenSplash')
  if (seenSplash) {
    hasSeenSplash.value = true
    showSplash.value = false
  }
})

// Methods
const openChat = () => {
  if (!hasSeenSplash.value) {
    // Show splash for first time users
    showSplash.value = true
    isOpen.value = true
  } else {
    // Direct to chat for returning users
    showSplash.value = false
    isOpen.value = true
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
  }
}

const startChat = () => {
  hasSeenSplash.value = true
  saveToStorage('hasSeenSplash', true)
  showSplash.value = false
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    nextTick(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
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
}

const closeChat = () => {
  isOpen.value = false
}

const sendMessageToGemini = async (message) => {
  try {
    const systemPrompt = `Anda adalah Jurutani AI, asisten penyuluh pertanian dan pembangunan yang ahli dan berpengalaman. Tugas Anda adalah memberikan penjelasan yang jelas, akurat, praktis, dan mudah dipahami dalam bahasa Indonesia.

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

// Watchers
watch(messages, () => {
  scrollToBottom()
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
    <!-- Chat Bubble Button (when chat is closed) -->
    <div v-if="!isOpen" class="relative">
      <button
        class="w-16 h-16 bg-white rounded-full shadow-lg border-2 border-orange-400 hover:border-green-500 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Buka chat Jurutani AI"
        @click="openChat"
      >
        <div class="w-10 h-10 bg-orange-400 group-hover:bg-green-500 rounded-full flex items-center justify-center transition-colors duration-300">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      </button>
      
      <!-- Notification badge -->
      <div class="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"/>
      </div>
    </div>

    <!-- Splash Screen -->
    <div
      v-if="showSplash && isOpen"
      class="bg-white rounded-xl shadow-2xl border-2 border-orange-400 p-6 w-80 transform transition-all duration-500"
    >
      <div class="text-center space-y-4">
        <!-- Logo/Image -->
        <div class="mx-auto w-24 h-24 rounded-full overflow-hidden border-3 border-green-500 shadow-lg">
          <img 
            src="/chatbot.png" 
            alt="Jurutani AI" 
            class="w-full h-full object-cover"
            @error="$event.target.style.display='none'"
          >
        </div>
        
        <!-- Title -->
        <div>
          <h1 class="text-2xl font-bold text-orange-600 mb-2">
            Selamat Datang di Jurutani AI
          </h1>
          <p class="text-gray-600 text-sm">
            Asisten Penyuluh Pertanian & Pembangunan
          </p>
        </div>

        <!-- Description -->
        <div class="text-gray-700 text-sm leading-relaxed">
          <p>
            Saya siap membantu Anda dengan konsultasi pertanian, peternakan, dan pembangunan. 
            Mari kita mulai percakapan untuk solusi terbaik!
          </p>
        </div>

        <!-- Start Button -->
        <button
          class="w-full bg-orange-400 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200 border-2 border-orange-400 hover:border-green-500"
          @click="startChat"
        >
          Mulai Konsultasi
        </button>
      </div>
    </div>

    <!-- Chat Window -->
    <div
      v-if="isOpen && !showSplash"
      :class="[
        'bg-white rounded-xl shadow-2xl border-2 border-orange-400 flex flex-col overflow-hidden transition-all duration-300',
        isExpanded ? 'w-96 h-[600px]' : 'w-80 h-96'
      ]"
    >
      <!-- Header -->
      <div class="bg-orange-400 text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-sm">Jurutani AI</h3>
            <p class="text-xs text-orange-100">Penyuluh Pertanian & Pembangunan</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="hover:bg-white/20 p-1.5 rounded-full transition-colors"
            :aria-label="isExpanded ? 'Perkecil chat' : 'Perbesar chat'"
            @click="toggleChatExpansion"
          >
            <svg v-if="isExpanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8l4-4m0 0h4M8 4l5 5m7-5l-5 5m5-5v4m0-4h-4m4 0l-5 5M4 16l4 4m0 0h4m-4 0l5-5m7 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button
            class="hover:bg-white/20 p-1.5 rounded-full transition-colors"
            aria-label="Tutup chat"
            @click="closeChat"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.type === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              isExpanded ? 'max-w-md' : 'max-w-xs',
              'px-4 py-3 rounded-2xl',
              message.type === 'user'
                ? 'bg-orange-400 text-white ml-4 shadow-lg border-2 border-orange-300'
                : 'bg-white text-gray-800 mr-4 shadow-md border-2 border-green-300'
            ]"
          >
            <div class="flex items-start space-x-3">
              <div v-if="message.type === 'bot'" class="flex-shrink-0 mt-1">
                <div class="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm leading-relaxed whitespace-pre-wrap">
                  {{ shouldShowExpandButton(message) && !isMessageExpanded(message.id) 
                    ? truncateText(message.text) 
                    : message.text }}
                </p>
                
                <!-- Expand/Collapse button -->
                <button
                  v-if="shouldShowExpandButton(message)"
                  :class="[
                    'mt-2 flex items-center space-x-1 text-xs transition-colors',
                    message.type === 'user' 
                      ? 'text-orange-100 hover:text-white' 
                      : 'text-gray-500 hover:text-green-600'
                  ]"
                  @click="toggleMessageExpansion(message.id)"
                >
                  <svg v-if="isMessageExpanded(message.id)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>{{ isMessageExpanded(message.id) ? 'Tutup' : 'Baca selengkapnya' }}</span>
                </button>
                
                <p
:class="[
                  'text-xs mt-2',
                  message.type === 'user' 
                    ? 'text-orange-100' 
                    : 'text-gray-500'
                ]">
                  {{ formatTime(message.timestamp) }}
                </p>
              </div>
              <div v-if="message.type === 'user'" class="flex-shrink-0 mt-1">
                <div class="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div
:class="[
            isExpanded ? 'max-w-md' : 'max-w-xs',
            'px-4 py-3 rounded-2xl bg-white text-gray-800 mr-4 shadow-md border-2 border-green-300'
          ]">
            <div class="flex items-center space-x-3">
              <div class="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span class="text-sm text-gray-500">Sedang mengetik...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <form class="flex space-x-3" @submit.prevent="handleSendMessage">
          <div class="flex-1 relative">
            <input
              ref="inputRef"
              v-model="inputMessage"
              type="text"
              placeholder="Tanya tentang pertanian, peternakan, atau pembangunan..."
              class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 text-sm transition-all duration-200"
              :disabled="isLoading"
            >
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h3a1 1 0 011 1v2h4a1 1 0 011 1v3a1 1 0 01-1 1h-1l-1 10a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9H4a1 1 0 01-1-1V5a1 1 0 011-1h3z" />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isLoading"
            class="bg-orange-400 hover:bg-green-500 disabled:bg-gray-300 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-lg border-2 border-orange-400 hover:border-green-500"
            aria-label="Kirim pesan"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #fb923c;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #10b981;
}

/* Smooth animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.transition-all {
  animation: fadeIn 0.3s ease-out;
}

/* Focus styles */
input:focus {
  box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1);
}

button:focus {
  box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.2);
}

/* Pulse animation for notification */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style>