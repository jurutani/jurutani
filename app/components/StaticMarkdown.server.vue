<script setup lang="ts">
  const { base, path } = defineProps({
    base: {
      type: String,
      default: '/',
    },
    path: {
      type: String,
      required: true,
    },
  })

  const { data: post } = await useAsyncData(path, () => {
    return queryContent(base, path).findOne()
  })

  // Use seo.ts composables untuk konsistensi
  useSeoDetail({
    title: post.value?.title || 'Konten',
    description: post.value?.description || post.value?.title || 'Baca artikel lengkap di Juru Tani',
    keywords: post.value?.tags || [],
    image: post.value?.image,
    type: 'article',
  })
</script>
<template>
  <div
    id="post"
    class="dark:prose-invert dark:prose-gray-100 flex flex-col heading-offset max-w-none prose prose-gray-800 rounded-lg"
  >
    <ContentRenderer id="content" :value="post">
      <template #empty>
        <p>No content found.</p>
      </template>
    </ContentRenderer>
  </div>
</template>
<style scoped></style>
