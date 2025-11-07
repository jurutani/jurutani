<script lang="ts" setup>
useSeoMeta({
  title: 'Pengaturan - Juru Tani',
  description: 'Kelola preferensi akun, notifikasi, dan pengaturan aplikasi Juru Tani untuk pengalaman yang lebih personal.',
  ogTitle: 'Pengaturan - Juru Tani',
  ogDescription: 'Kelola preferensi akun, notifikasi, dan pengaturan aplikasi Juru Tani untuk pengalaman yang lebih personal.',
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
