// composables/useChatAnimations.ts
import { ref } from 'vue'

export const useChatAnimations = () => {
  const isAnimating = ref(false)
  
  /**
   * Trigger a ripple effect animation
   */
  const triggerRipple = (event: MouseEvent, element: HTMLElement) => {
    const ripple = document.createElement('span')
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.classList.add('ripple')
    
    element.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }
  
  /**
   * Smooth scroll to element
   */
  const smoothScrollTo = (element: HTMLElement, options = { behavior: 'smooth' as ScrollBehavior }) => {
    element.scrollIntoView(options)
  }
  
  /**
   * Fade in animation
   */
  const fadeIn = (element: HTMLElement, duration = 300) => {
    element.style.opacity = '0'
    element.style.transition = `opacity ${duration}ms ease-in-out`
    
    requestAnimationFrame(() => {
      element.style.opacity = '1'
    })
  }
  
  /**
   * Slide in animation
   */
  const slideIn = (element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom', duration = 300) => {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      top: 'translateY(-100%)',
      bottom: 'translateY(100%)'
    }
    
    element.style.transform = transforms[direction]
    element.style.transition = `transform ${duration}ms ease-out`
    
    requestAnimationFrame(() => {
      element.style.transform = 'translate(0, 0)'
    })
  }
  
  /**
   * Bounce animation
   */
  const bounce = (element: HTMLElement) => {
    element.style.animation = 'bounce 0.5s ease-in-out'
    
    setTimeout(() => {
      element.style.animation = ''
    }, 500)
  }
  
  return {
    isAnimating,
    triggerRipple,
    smoothScrollTo,
    fadeIn,
    slideIn,
    bounce
  }
}
