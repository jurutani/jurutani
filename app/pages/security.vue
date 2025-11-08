<script lang="ts" setup>
// SEO Optimization
useSeoOptimized('security')

definePageMeta({
  middleware: ['auth']
});
</script>

<template>
  <div class="lg:pt-24 pt-20">
    <NuxtPage />
  </div>
</template>
