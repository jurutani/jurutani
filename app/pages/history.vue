<script lang="ts" setup>
useSeoMeta({
  title: 'Riwayat — Juru Tani',
  description: 'Lihat riwayat aktivitas, pembaruan, dan perubahan penting di Juru Tani.',
  ogTitle: 'Riwayat — Juru Tani',
  ogDescription: 'Lihat riwayat aktivitas, pembaruan, dan perubahan penting di Juru Tani.',
})
definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="lg:pt-24 pt-20">
    <NuxtPage />
  </div>
</template>
