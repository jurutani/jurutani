<script setup lang="ts">

</script>
<template>
  <div class="announcement-page container mx-auto px-4">
   <!-- Video Section Header -->
    <div class="mx-auto mb-16 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full">
        <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m0 6h1a3 3 0 000 6H9m3-18s3 0 3 3-3 3-3 3m0 0s3 0 3 3-3 3-3 3"/>
        </svg>
        <span class="text-sm font-medium text-red-700 dark:text-red-300">Pembelajaran Visual & Interaktif</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-red-700 via-pink-600 to-rose-600 bg-clip-text text-transparent">
        Video Edukasi JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Akses koleksi lengkap video pembelajaran pertanian dengan 
        <span class="font-semibold text-red-600 dark:text-red-400">tutorial praktis</span>, 
        <span class="font-semibold text-pink-600 dark:text-pink-400">teknik modern</span>, dan 
        <span class="font-semibold text-rose-600 dark:text-rose-400">tips ahli</span> untuk meningkatkan produktivitas dan keterampilan pertanian Anda.
      </p>
</div>
    <DiscussionsVideoSection />

   
    <!-- Materi Section Header -->
      <div class="mx-auto mb-16 max-w-4xl text-center">
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full">
          <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <span class="text-sm font-medium text-amber-700 dark:text-amber-300">Panduan Lengkap & Terstruktur</span>
        </div>
        
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
          Materi Edukasi JuruTani
        </h2>
        
        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Jelajahi koleksi lengkap materi edukasi dengan 
          <span class="font-semibold text-amber-600 dark:text-amber-400">panduan praktis</span>, 
          <span class="font-semibold text-orange-600 dark:text-orange-400">teknik berkelanjutan</span>, dan 
          <span class="font-semibold text-yellow-600 dark:text-yellow-400">strategi produktivitas</span> untuk mengoptimalkan usaha tani Anda.
        </p>
      </div>
    <DiscussionsMaterialSection />
  </div>
</template>
