<script lang="ts" setup>
useSeoMeta({
  title: 'Ruang Obrolan — Juru Tani',
  description: 'Ikuti percakapan dan pembaruan terbaru di Ruang Obrolan Juru Tani untuk berdiskusi, berbagi tips, dan mendapatkan info pertanian terkini.',
  ogTitle: 'Ruang Obrolan — Juru Tani',
  ogDescription: 'Ikuti percakapan dan pembaruan terbaru di Ruang Obrolan Juru Tani untuk berdiskusi, berbagi tips, dan mendapatkan info pertanian terkini.',
})
definePageMeta({
  prerender: false,
  middleware: ['auth']
});
</script>

<template>
  <div class="lg:pt-16 pt-12">
    <NuxtPage />
  </div>
</template>
