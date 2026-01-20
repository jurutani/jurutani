<script setup lang="ts">
interface Props {
  images: string[]
  currentIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0
})

const emit = defineEmits<{
  close: []
}>()

const currentImageIndex = ref(props.currentIndex)

const currentImage = computed(() => props.images[currentImageIndex.value])

const canGoPrev = computed(() => currentImageIndex.value > 0)
const canGoNext = computed(() => currentImageIndex.value < props.images.length - 1)

const goToPrev = () => {
  if (canGoPrev.value) {
    currentImageIndex.value--
  }
}

const goToNext = () => {
  if (canGoNext.value) {
    currentImageIndex.value++
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') goToPrev()
  if (e.key === 'ArrowRight') goToNext()
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
    <!-- Close Button -->
    <button
      class="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      @click="emit('close')"
    >
      <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
    </button>

    <!-- Navigation Buttons -->
    <button
      v-if="canGoPrev"
      class="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
      @click="goToPrev"
    >
      <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
    </button>

    <button
      v-if="canGoNext"
      class="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
      @click="goToNext"
    >
      <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
    </button>

    <!-- Image -->
    <div class="max-w-5xl max-h-full">
      <img
        :src="currentImage"
        alt="Full size image"
        class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
      >
    </div>

    <!-- Image Counter -->
    <div
      v-if="images.length > 1"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm"
    >
      {{ currentImageIndex + 1 }} / {{ images.length }}
    </div>
  </div>
</template>
