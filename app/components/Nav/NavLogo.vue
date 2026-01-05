<script setup lang="ts">
import siteMeta from '@/site'

const { title } = siteMeta
</script>

<template>
  <NuxtLink 
    to="/" 
    class="flex items-center transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-green-500 focus-visible:outline-offset-2 rounded-lg"
    :aria-label="`${title} - Kembali ke beranda`"
  >
    <NuxtImg 
      src="/jurutani.png" 
      :alt="`Logo ${title}`"
      class="h-10 w-auto"
      loading="eager"
      preload
      format="webp"
      quality="90"
      width="160"
      height="40"
    />
  </NuxtLink>
</template>

<style scoped>
/* Smooth logo animation on hover */
a:hover img {
  filter: brightness(1.1);
}

a:active img {
  transform: scale(0.95);
}
</style>
