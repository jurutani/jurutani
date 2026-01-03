export const useCarousel = (itemsCount: Ref<number>) => {
    const currentSlide = ref(0)
    const autoplayInterval = ref<NodeJS.Timeout | null>(null)
    const isTransitioning = ref(false)
    const isSwiping = ref(false)
    const isMobile = ref(false)

    // Touch/Swipe states
    const startX = ref(0)
    const startY = ref(0)
    const swipeThreshold = 50

    // Device detection
    const detectDevice = () => {
        if (process.client) {
            isMobile.value = window.innerWidth < 768
        }
    }

    // Animation trigger
    const triggerContentAnimation = () => {
        isTransitioning.value = true
        setTimeout(() => {
            isTransitioning.value = false
        }, 800)
    }

    // Navigation functions
    const goToSlide = (index: number) => {
        if (isTransitioning.value || itemsCount.value === 0) return
        currentSlide.value = index
        triggerContentAnimation()
    }

    const nextSlide = () => {
        if (isTransitioning.value || itemsCount.value === 0) return
        const nextIndex = (currentSlide.value + 1) % itemsCount.value
        currentSlide.value = nextIndex
        triggerContentAnimation()
    }

    const prevSlide = () => {
        if (isTransitioning.value || itemsCount.value === 0) return
        const prevIndex = (currentSlide.value - 1 + itemsCount.value) % itemsCount.value
        currentSlide.value = prevIndex
        triggerContentAnimation()
    }

    // Autoplay functions
    const startAutoplay = () => {
        if (autoplayInterval.value || itemsCount.value <= 1) {
            if (autoplayInterval.value) {
                clearInterval(autoplayInterval.value)
            }
        }

        if (itemsCount.value > 1) {
            autoplayInterval.value = setInterval(() => {
                if (!isSwiping.value && !isTransitioning.value) {
                    nextSlide()
                }
            }, 4000)
        }
    }

    const stopAutoplay = () => {
        if (autoplayInterval.value) {
            clearInterval(autoplayInterval.value)
            autoplayInterval.value = null
        }
    }

    // Touch/Swipe handlers
    const handleTouchStart = (e: TouchEvent) => {
        if (isTransitioning.value || itemsCount.value === 0) return

        isSwiping.value = true
        startX.value = e.touches[0].clientX
        startY.value = e.touches[0].clientY
        stopAutoplay()
    }

    const handleTouchEnd = (e: TouchEvent) => {
        if (!isSwiping.value || itemsCount.value === 0) return

        const endX = e.changedTouches[0].clientX
        const endY = e.changedTouches[0].clientY
        const deltaX = endX - startX.value
        const deltaY = endY - startY.value

        isSwiping.value = false

        // Check if it's a horizontal swipe (not vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                prevSlide() // Swipe right -> previous
            } else {
                nextSlide() // Swipe left -> next
            }
        }

        setTimeout(() => startAutoplay(), 100)
    }

    // Click handler for desktop
    const handleClick = (e: MouseEvent) => {
        if (isTransitioning.value || isMobile.value || itemsCount.value === 0) return

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const containerWidth = rect.width

        // Left half = previous, right half = next
        if (clickX < containerWidth / 2) {
            prevSlide()
        } else {
            nextSlide()
        }
    }

    // Mouse handlers for pausing autoplay on hover (desktop only)
    const handleMouseEnter = () => {
        if (!isMobile.value) {
            stopAutoplay()
        }
    }

    const handleMouseLeave = () => {
        if (!isMobile.value) {
            setTimeout(() => startAutoplay(), 200)
        }
    }

    // Window resize handler
    const handleResize = () => {
        detectDevice()
    }

    // Lifecycle
    onMounted(() => {
        detectDevice()
        // Don't start autoplay here - let watch handle it when data loads
        // This prevents race condition with async data fetching
        window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
        stopAutoplay()
        if (process.client) {
            window.removeEventListener('resize', handleResize)
        }
    })

    // Watch for items count changes
    watch(itemsCount, (newLength, oldLength) => {
        if (newLength > 0) {
            // Reset slide if out of bounds
            if (currentSlide.value >= newLength) {
                currentSlide.value = 0
            }

            // Trigger animation when data first loads (undefined/0 -> n)
            if (!oldLength || oldLength === 0) {
                nextTick(() => {
                    triggerContentAnimation()
                })
            }

            startAutoplay()
        } else {
            stopAutoplay()
        }
    }, { immediate: false })

    return {
        currentSlide,
        isTransitioning,
        isMobile,
        goToSlide,
        nextSlide,
        prevSlide,
        handleTouchStart,
        handleTouchEnd,
        handleClick,
        handleMouseEnter,
        handleMouseLeave,
        triggerContentAnimation
    }
}
