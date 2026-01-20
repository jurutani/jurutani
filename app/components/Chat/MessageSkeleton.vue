<script setup lang="ts">
interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 3
})
</script>

<template>
  <div class="space-y-4 p-4">
    <div v-for="i in count" :key="i" :class="['flex', i % 2 === 0 ? 'justify-end' : 'justify-start']">
      <div :class="['max-w-xs lg:max-w-md space-y-2', i % 2 === 0 ? 'items-end' : 'items-start']">
        <USkeleton :class="['h-16 rounded-2xl', i % 2 === 0 ? 'w-48' : 'w-56']" />
        <USkeleton class="h-3 w-16" />
      </div>
    </div>
  </div>
</template>
