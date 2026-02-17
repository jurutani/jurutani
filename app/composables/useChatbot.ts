import { GoogleGenAI } from '@google/genai'

export const useChatbot = () => {
    const config = useRuntimeConfig()
    const apiKey = config.public.geminiApiKey as string

    const sendMessage = async (message: string): Promise<string> => {
        try {
            if (!apiKey) {
                return '⚠️ API key tidak tersedia'
            }

            if (!message?.trim()) {
                return '⚠️ Pesan kosong'
            }

            // Inisialisasi Gemini AI
            const ai = new GoogleGenAI({ apiKey })

            // System prompt ringkas untuk JuruTani AI
            const contents = [
                {
                    role: 'user',
                    parts: [
                        { text: `Anda adalah JuruTani AI, asisten ahli pertanian, peternakan, dan pembangunan pedesaan di Indonesia. Jawab dalam bahasa Indonesia yang praktis, jelas, dan mudah dipahami. Fokus pada solusi konkret untuk petani dan peternak. Maksimal 5-6 kalimat.\n\nPertanyaan: ${message}` }
                    ]
                }
            ]

            // Generate content
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents
            })

            return response.text || 'Tidak ada respons.'

        } catch (error: any) {
            console.error('Chatbot error:', error)
            return '⚠️ Terjadi kesalahan. Silakan coba lagi.'
        }
    }

    return {
        sendMessage
    }
}
