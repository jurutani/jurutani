<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'

// Reactive state
const isOpen = ref(false)
const showSplash = ref(true)
const isExpanded = ref(false)
const isLoading = ref(false)
const hasSeenSplash = ref(false)
const messageListRef = ref(null)
const inputRef = ref(null)

const messages = ref([
  {
    id: 1,
    type: 'bot',
    text: 'Halo! Saya adalah Juru tani AI, asisten penyuluh juru tani untuk pertanian, peternakan, dan pembangunan. Saya dapat membantu Anda dengan informasi tentang:\n\n• Teknik budidaya tanaman dan peternakan\n• Teknologi pertanian modern\n• Manajemen sumber daya alam\n• Pembangunan infrastruktur pertanian\n• Pemasaran hasil pertanian\n• Program pemerintah untuk petani\n\nAda yang ingin Anda tanyakan?',
    timestamp: new Date()
  }
])

// API Configuration
const GEMINI_API_KEY = 'AIzaSyDkLlBPmVfFQUOq5Cb4RWF7TM2zUDIH6Kk'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`
// Methods
const openChat = () => {
  if (!hasSeenSplash.value) {
    showSplash.value = true
    isOpen.value = true
  } else {
    showSplash.value = false
    isOpen.value = true
    nextTick(() => {
      inputRef.value?.focus()
      messageListRef.value?.scrollToBottom()
    })
  }
}

const startChat = () => {
  hasSeenSplash.value = true
  showSplash.value = false
  nextTick(() => {
    inputRef.value?.focus()
    messageListRef.value?.scrollToBottom()
  })
}

const toggleChatExpansion = () => {
  isExpanded.value = !isExpanded.value
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })
}

const closeChat = () => {
  isOpen.value = false
}

const sendMessageToGemini = async (message) => {
  try {
    const systemPrompt = `Anda adalah Juru tani AI, asisten penyuluh juru tani yang ahli dan berpengalaman. Tugas Anda adalah memberikan penjelasan yang jelas, akurat, praktis, dan mudah dipahami dalam bahasa Indonesia.

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

const handleSendMessage = async (userMessage: string) => {
  if (!userMessage.trim() || isLoading.value) return

  const messageToPush = {
    id: messages.value.length + 1,
    type: 'user',
    text: userMessage,
    timestamp: new Date()
  }

  messages.value.push(messageToPush)
  isLoading.value = true

  // Auto scroll after user sends message
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })

  try {
    const botResponse = await sendMessageToGemini(userMessage)
    
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
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    // Event akan ditangani oleh ChatInput component
  }
}

// Watchers
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
      <ChatbotChatBubbleButton @click="openChat" />
    </div>

    <!-- Splash Screen -->
    <ChatbotSplashScreen
      v-if="showSplash && isOpen"
      @start="startChat"
    />

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
      <ChatbotChatHeader
        :is-expanded="isExpanded"
        @toggle-expand="toggleChatExpansion"
        @close="closeChat"
      />

      <!-- Messages Container -->
      <ChatbotMessageList
        ref="messageListRef"
        :messages="messages"
        :is-loading="isLoading"
        :is-expanded="isExpanded"
      />

      <!-- Input Area -->
      <ChatbotChatInput
        ref="inputRef"
        :disabled="isLoading"
        @submit="handleSendMessage"
      />
    </UCard>
  </div>
</template>

<style scoped>
/* Styles disediakan oleh component-component child */
</style>