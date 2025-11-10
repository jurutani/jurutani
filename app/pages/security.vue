<script lang="ts" setup>
// SEO Optimization
useSeoOptimized('security')

definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="lg:pt-16 pt-12">
    <NuxtPage />
  </div>
</template>
