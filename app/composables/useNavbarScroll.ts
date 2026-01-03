import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable untuk manage navbar scroll state dan behavior
 * Mendeteksi scroll position dan update state untuk glassmorphism effect
 */
export const useNavbarScroll = () => {
    const isScrolled = ref(false)
    const scrollY = ref(0)

    const handleScroll = () => {
        scrollY.value = window.scrollY
        isScrolled.value = scrollY.value > 10 // Threshold 10px untuk smooth transition
    }

    onMounted(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll, { passive: true })
            // Initial check
            handleScroll()
        }
    })

    onUnmounted(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', handleScroll)
        }
    })

    return {
        isScrolled,
        scrollY,
    }
}
