<script lang="ts" setup>
useSeoMeta({
  title: 'Keamanan — Juru Tani',
  description: 'Informasi terbaru dan panduan tentang keamanan aplikasi, perlindungan data, dan praktik terbaik untuk pengguna Juru Tani.',
  ogTitle: 'Keamanan — Juru Tani',
  ogDescription: 'Kumpulan pembaruan keamanan dan tips menjaga data Anda saat menggunakan Juru Tani.',
  ogType: 'website'
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
