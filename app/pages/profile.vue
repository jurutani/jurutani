<script lang="ts" setup>
useSeoMeta({
  title: 'Profil - Juru Tani',
  description: 'Kelola informasi akun, preferensi, dan pengaturan privasi Anda di Juru Tani.',
  ogTitle: 'Profil - Juru Tani',
  ogDescription: 'Kelola informasi akun, preferensi, dan pengaturan privasi Anda di Juru Tani.',
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
