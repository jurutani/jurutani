<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

// SEO Optimization
useSeoOptimized('educations')
</script>

<template>
  <main class="educations-page container mx-auto px-4 py-12">
    <!-- Header Section -->
    <header class="mb-12 text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Pembelajaran Pertanian</span>
      </div>
      
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Edukasi Pertanian
      </h1>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Tingkatkan pengetahuan pertanian Anda melalui 
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">video edukatif</span> dan 
        <span class="font-semibold text-teal-600 dark:text-teal-400">materi pembelajaran berkualitas</span>
      </p>
    </header>

    <!-- Video Section -->
    <section aria-labelledby="video-section-heading">
      <h2 id="video-section-heading" class="sr-only">Video Edukasi Pertanian</h2>
      <DiscussionsVideoSection />
    </section>

    <!-- Material Section -->
    <section aria-labelledby="material-section-heading" class="mt-16">
      <h2 id="material-section-heading" class="sr-only">Materi Pembelajaran Pertanian</h2>
      <DiscussionsMaterialSection />
    </section>
  </main>
</template>
