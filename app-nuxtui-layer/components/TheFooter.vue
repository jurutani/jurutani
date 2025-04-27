<script setup lang="ts">
// Kosong dulu, siapin buat ke depan kalau mau nambah logic
</script>

<template>
  <footer class="pb-24 pt-12 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200">
    <div class="container mx-auto px-8">
      <!-- Navigation Menu -->
      <div class="flex flex-wrap justify-center space-x-6 mb-8 text-sm font-semibold">
        <NuxtLink to="/" class="hover:text-green-600 transition-colors">Beranda</NuxtLink>
        <NuxtLink to="/about-us" class="hover:text-green-600 transition-colors">Tentang Kami</NuxtLink>
        <NuxtLink to="/news" class="hover:text-green-600 transition-colors">Berita</NuxtLink>
        <NuxtLink to="/contact-us" class="hover:text-green-600 transition-colors">Kontak</NuxtLink>
      </div>

      <!-- Social Media Links -->
      <div class="flex flex-wrap justify-center space-x-6 mb-8">
        <NuxtLink
          href="https://www.facebook.com/jurutani"
          aria-label="facebook"
          external
          target="_blank"
          class="hover:text-green-600 transition-colors"
        >
          <UIcon name="i-logos-facebook" class="text-3xl" />
        </NuxtLink>
        <NuxtLink
          href="https://twitter.com/jurutani"
          aria-label="twitter"
          external
          target="_blank"
          class="hover:text-green-600 transition-colors"
        >
          <UIcon name="i-logos-twitter" class="text-3xl" />
        </NuxtLink>
        <NuxtLink
          href="https://discord.gg/jurutani"
          aria-label="discord"
          external
          target="_blank"
          class="hover:text-green-600 transition-colors"
        >
          <UIcon name="i-logos-discord-icon" class="text-3xl" />
        </NuxtLink>
        <NuxtLink
          href="https://www.youtube.com/@jurutani"
          aria-label="youtube"
          external
          target="_blank"
          class="hover:text-green-600 transition-colors"
        >
          <UIcon name="i-logos-youtube-icon" class="text-3xl" />
        </NuxtLink>
      </div>

      <!-- Copyright -->
      <div class="text-center text-xs text-green-700 dark:text-green-300">
        © {{ new Date().getFullYear() }} Juru Tani. Semua Hak Dilindungi.
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Animasi smooth buat hover */
a {
  transition: color 0.3s ease-in-out;
}
</style>
