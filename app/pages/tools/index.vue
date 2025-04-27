<script setup lang="ts">
const tabItems = [
  { label: 'Kalkulator Benih', slot: 'benih' },
  { label: 'Kalkulator Pupuk Padi', slot: 'pupuk' },
]
</script>

<template>
  <UContainer class="py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-primary">Alat Pertanian</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">Hitung kebutuhan benih dan pupuk padi Anda dengan mudah.</p>
    </div>

    <UTabs :items="tabItems" class="text-primary">
      <template #benih>
        <KalkulatorBenih />
      </template>
      <template #pupuk>
        <KalkulatorPupuk />
      </template>
    </UTabs>
  </UContainer>
</template>

<style scoped>
.text-primary {
  color: #2E7D32;
}
</style>
