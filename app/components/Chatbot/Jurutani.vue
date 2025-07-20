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

// Methods (localStorage tidak digunakan untuk artifact)
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
    <!-- Chat Bubble Button -->
    <div v-if="!isOpen">
      <UButton
        icon="i-heroicons-chat-bubble-left-ellipsis"
        size="xl"
        color="green"
        variant="solid"
        :ui="{ 
          rounded: 'rounded-full', 
          base: 'w-16 h-16 shadow-lg',
          icon: { size: { xl: 'w-8 h-8' } }
        }"
        @click="openChat"
      />
      <!-- Notification dot -->
      <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
    </div>

    <!-- Splash Screen -->
    <UCard 
      v-if="showSplash && isOpen"
      class="w-80 border-2 border-green-400"
      :ui="{ 
        base: 'transform transition-all duration-500',
        body: { padding: 'p-6' }
      }"
    >
      <div class="text-center space-y-4">
        <!-- Logo -->
        <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-microphone" class="w-10 h-10 text-green-600" />
        </div>
        
        <!-- Title -->
        <div>
          <h1 class="text-xl font-bold text-green-700 mb-2">
            Jurutani AI
          </h1>
          <p class="text-gray-600 text-sm">
            Asisten Penyuluh Pertanian & Pembangunan
          </p>
        </div>

        <!-- Description -->
        <p class="text-gray-700 text-sm">
          Konsultasi pertanian, peternakan, dan pembangunan. 
          Mari mulai percakapan untuk solusi terbaik!
        </p>

        <!-- Start Button -->
        <UButton
          color="green"
          size="lg"
          block
          @click="startChat"
        >
          Mulai Konsultasi
        </UButton>
      </div>
    </UCard>

    <!-- Chat Window -->
    <UCard
      v-if="isOpen && !showSplash"
      :class="[
        'flex flex-col overflow-hidden border-2 border-green-400 transition-all duration-300',
        isExpanded ? 'w-96 h-[600px]' : 'w-80 h-96'
      ]"
      :ui="{ body: { padding: 'p-0' } }"
    >
      <!-- Header -->
      <div class="bg-green-600 text-white p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-microphone" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-sm">Jurutani AI</h3>
            <p class="text-xs text-green-100">Penyuluh Pertanian</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <UButton
            :icon="isExpanded ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
            color="green"
            variant="ghost"
            size="xs"
            @click="toggleChatExpansion"
          />
          <UButton
            icon="i-heroicons-x-mark"
            color="green"
            variant="ghost"
            size="xs"
            @click="closeChat"
          />
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
              'px-3 py-2 rounded-lg',
              message.type === 'user'
                ? 'bg-green-600 text-white ml-4'
                : 'bg-white text-gray-800 mr-4 border border-gray-200'
            ]"
          >
            <div class="flex items-start space-x-2">
              <div v-if="message.type === 'bot'" class="flex-shrink-0 mt-0.5">
                <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-microphone" class="w-3 h-3 text-green-600" />
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm whitespace-pre-wrap">
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
                  class="mt-1"
                  @click="toggleMessageExpansion(message.id)"
                >
                  {{ isMessageExpanded(message.id) ? 'Tutup' : 'Selengkapnya' }}
                </UButton>
                
                <p class="text-xs mt-1 opacity-70">
                  {{ formatTime(message.timestamp) }}
                </p>
              </div>
              <div v-if="message.type === 'user'" class="flex-shrink-0 mt-0.5">
                <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-user" class="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div :class="[
            isExpanded ? 'max-w-md' : 'max-w-xs',
            'px-3 py-2 rounded-lg bg-white text-gray-800 mr-4 border border-gray-200'
          ]">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-microphone" class="w-3 h-3 text-green-600" />
              </div>
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin text-green-600" />
                <span class="text-sm text-gray-500">Mengetik...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-gray-200 bg-white">
        <form class="flex space-x-2" @submit.prevent="handleSendMessage">
          <UInput
            ref="inputRef"
            v-model="inputMessage"
            placeholder="Tanya tentang pertanian..."
            :disabled="isLoading"
            size="sm"
            class="flex-1"
          />
          <UButton
            type="submit"
            :disabled="!inputMessage.trim() || isLoading"
            icon="i-heroicons-paper-airplane"
            color="green"
            size="sm"
          />
        </form>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #10b981;
  border-radius: 2px;
}
</style>