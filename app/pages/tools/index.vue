<script setup lang="ts">
const tabItems = [
  { label: 'Kalkulator Benih', slot: 'benih' },
  { label: 'Kalkulator Pupuk', slot: 'pupuk' },
]
</script>

<template>
  <UContainer class="py-8">
    <div class="mx-auto mb-12 max-w-2xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-green-800 dark:text-green-300">
          Alat Pertanian JuruTani
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Kalkulator Benih dan Kalkulator pupuk untuk menghitung kebutuhan pengguanaan pada pertanian anda.
        </p>
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
