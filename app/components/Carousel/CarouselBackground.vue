<script setup lang="ts">
import type { HeroData } from '~/composables/useHeroData'

interface Props {
  items: HeroData[]
  currentSlide: number
  getImageUrl: (imageUrl: string) => string | null
}

defineProps<Props>()
</script>

<template>
  <div class="absolute inset-0">
    <!-- Background Images dengan animasi transisi -->
    <div
      v-for="(item, index) in items"
      :key="`bg-${item.id}`"
      class="absolute inset-0 transition-all duration-1000 ease-out"
      :class="[currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105']"
    >
      <!-- Gambar Background jika ada -->
      <img
        v-if="getImageUrl(item.image_url)"
        :src="getImageUrl(item.image_url)!"
        :alt="item.title || 'Hero Image'"
        class="w-full h-full object-cover transition-transform duration-1000 ease-out"
        :class="[currentSlide === index ? 'scale-100' : 'scale-110']"
        loading="lazy"
        @error="(e: any) => {
          // console.error('Image load error:', e)
          e.target.style.display = 'none'
        }"
      />

      <!-- Background Hijau jika tidak ada gambar -->
      <div
        v-else
        class="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 transition-all duration-1000 ease-out"
        :class="[currentSlide === index ? 'scale-100' : 'scale-105']"
      />
    </div>

    <!-- Overlay untuk readability -->
    <div class="absolute inset-0 bg-black/30 dark:bg-black/50" />

    <!-- Shadow dari bawah -->
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

    <!-- Side shadows -->
    <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/30 to-transparent" />
    <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/30 to-transparent" />
  </div>
</template>
