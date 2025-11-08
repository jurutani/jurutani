<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

// SEO Optimization
useSeoOptimized('educations')
</script>
<template>
  <div class="announcement-page container mx-auto py-12">
    <DiscussionsVideoSection />
    <DiscussionsMaterialSection />
  </div>
</template>
