<script setup>
import { ref, nextTick, watch } from 'vue'

// Reactive state
const isOpen = ref(false)
const isExpanded = ref(false)
const expandedMessages = ref(new Set())
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const inputRef = ref(null)

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

// Methods
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
    <!-- Chat Button -->
    <button
      v-if="!isOpen"
      class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
      aria-label="Buka chatbot Jurutani"
      @click="isOpen = true"
    >
      <div class="relative">
        <Icon name="heroicons:chat-bubble-oval-left" class="w-6 h-6" />
        <div class="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"/>
      </div>
      <div class="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Konsultasi Pertanian & Pembangunan
      </div>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      :class="[
        'bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300',
        isExpanded ? 'w-96 h-[600px]' : 'w-80 h-96'
      ]"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="p-2 bg-white/20 rounded-full">
            <img src="/LOGO01.png" alt="Jurutani AI" class="w-8 h-8 rounded-full" >
          </div>
          <div>
            <h3 class="text-md font-semibold">Jurutani AI</h3>
            <p class="text-xs text-emerald-100">Penyuluh Pertanian & Pembangunan</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="hover:bg-white/20 p-1 rounded-full transition-colors"
            :aria-label="isExpanded ? 'Perkecil chat' : 'Perbesar chat'"
            @click="toggleChatExpansion"
          >
            <Icon v-if="isExpanded" name="heroicons:arrows-pointing-in" class="w-5 h-5" />
            <Icon v-else name="heroicons:arrows-pointing-out" class="w-5 h-5" />
          </button>
          <button
            class="hover:bg-white/20 p-1 rounded-full transition-colors"
            aria-label="Tutup chat"
            @click="isOpen = false"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
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
              'px-4 py-2 rounded-lg',
              message.type === 'user'
                ? 'bg-emerald-500 text-white ml-4'
                : 'bg-white text-gray-800 mr-4 shadow-sm border'
            ]"
          >
            <div class="flex items-start space-x-2">
              <div v-if="message.type === 'bot'" class="flex-shrink-0 mt-1">
                <div class="w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                  <Icon name="heroicons:computer-desktop" class="w-3 h-3 text-white" />
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm leading-relaxed whitespace-pre-wrap">
                  {{ shouldShowExpandButton(message) && !isMessageExpanded(message.id) 
                    ? truncateText(message.text) 
                    : message.text }}
                </p>
                
                <!-- Expand/Collapse button untuk pesan -->
                <button
                  v-if="shouldShowExpandButton(message)"
                  :class="[
                    'mt-1 flex items-center space-x-1 text-xs transition-colors',
                    message.type === 'user' 
                      ? 'text-emerald-100 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                  ]"
                  @click="toggleMessageExpansion(message.id)"
                >
                  <Icon v-if="isMessageExpanded(message.id)" name="heroicons:chevron-up" class="w-3 h-3" />
                  <Icon v-else name="heroicons:chevron-down" class="w-3 h-3" />
                  <span>{{ isMessageExpanded(message.id) ? 'Tutup' : 'Baca selengkapnya' }}</span>
                </button>
                
                <p
:class="[
                  'text-xs mt-1',
                  message.type === 'user' 
                    ? 'text-emerald-100' 
                    : 'text-gray-500'
                ]">
                  {{ formatTime(message.timestamp) }}
                </p>
              </div>
              <div v-if="message.type === 'user'" class="flex-shrink-0 mt-1">
                <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="heroicons:user" class="w-3 h-3 text-white" />
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
            'px-4 py-2 rounded-lg bg-white text-gray-800 mr-4 shadow-sm border'
          ]">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                <Icon name="heroicons:computer-desktop" class="w-3 h-3 text-white" />
              </div>
              <div class="flex items-center space-x-1">
                <Icon name="heroicons:arrow-path" class="w-4 h-4 animate-spin text-emerald-500" />
                <span class="text-sm text-gray-500">Sedang mengetik...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <form class="flex space-x-2" @submit.prevent="handleSendMessage">
          <input
            ref="inputRef"
            v-model="inputMessage"
            type="text"
            placeholder="Tanya tentang pertanian, peternakan, atau pembangunan..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            :disabled="isLoading"
          >
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isLoading"
            class="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors duration-200"
            aria-label="Kirim pesan"
          >
            <Icon name="heroicons:paper-airplane" class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>