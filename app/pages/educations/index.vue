<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

// SEO Optimization
useSeoOptimized('educations')
</script>

<template>
  <main class="educations-page container mx-auto px-4 py-12">

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
