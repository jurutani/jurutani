<script setup lang="ts">

</script>
<template>
  <div class="announcement-page container mx-auto px-4 py-12">
   <!-- Video Section Header -->
    <div class="mx-auto mb-6 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-play-circle" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Pembelajaran Visual & Interaktif</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Video Edukasi JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Akses koleksi lengkap video pembelajaran pertanian dengan 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">tutorial praktis</span>, 
        <span class="font-semibold text-teal-600 dark:text-teal-400">teknik modern</span>, dan  
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">tips ahli</span> untuk meningkatkan produktivitas dan keterampilan pertanian Anda.
      </p>
    </div>
    <DiscussionsVideoSection />
      <div class="mx-auto mb-4 max-w-4xl text-center py-12">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
          <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Panduan Lengkap & Terstruktur</span>
        </div>
        
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Materi Edukasi JuruTani
        </h2>
        
        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Jelajahi koleksi lengkap materi edukasi dengan 
          <span class="font-semibold text-emerald-600 dark:text-emerald-400">panduan praktis</span>,
          <span class="font-semibold text-teal-600 dark:text-teal-400">
          teknik berkelanjutan</span>, dan
          <span class="font-semibold text-cyan-600 dark:text-cyan-400">strategi produktivitas</span> untuk mengoptimalkan usaha tani Anda.
        </p>
      </div>
    <DiscussionsMaterialSection />
  </div>
</template>
