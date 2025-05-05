<template>
    <div class="aspect-video w-full max-w-2xl mx-auto">
      <iframe
        :src="embedUrl"
        frameborder="0"
        allowfullscreen
        class="w-full h-full rounded-xl"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  const ytUrl = 'https://youtu.be/2sAD3Q_zyjk?si=UaVcd5LQBuTMuZYx'
  
  // Fungsi konversi ke format embed
  const embedUrl = `https://www.youtube.com/embed/${new URLSearchParams(new URL(ytUrl).search).get('v')}`
  </script>
  