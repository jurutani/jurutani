// composables/useChatLayout.ts
import { ref, onMounted, onUnmounted } from 'vue'

export const useChatLayout = () => {
  const sidebarOpen = ref(true)
  const isMobile = ref(false)
  
  // Check if mobile on mount
  onMounted(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      isMobile.value = mobile
      
      // Auto-close sidebar on mobile, open on desktop
      if (mobile) {
        sidebarOpen.value = false
      } else {
        sidebarOpen.value = true
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })
  })
  
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }
  
  const openSidebar = () => {
    sidebarOpen.value = true
  }
  
  const closeSidebar = () => {
    sidebarOpen.value = false
  }
  
  // Auto-close sidebar on mobile when chat is selected
  const onChatSelected = () => {
    if (isMobile.value) {
      closeSidebar()
    }
  }
  
  return {
    sidebarOpen,
    isMobile,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    onChatSelected
  }
}
