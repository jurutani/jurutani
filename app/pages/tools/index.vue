<script setup lang="ts">
const tabItems = [
  { label: 'Kalkulator Benih', slot: 'benih' },
  { label: 'Kalkulator Pupuk', slot: 'pupuk' },
]
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto mb-12 max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full">
        <UIcon name="i-heroicons-calculator" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Penghitungan Pertanian</span>
      </div>
      
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
        Tools Tani JuruTani
      </h2>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
        Gunakan kalkulator pertanian kami untuk menghitung kebutuhan
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">benih yang optimal</span>, 
        <span class="font-semibold text-teal-600 dark:text-teal-400">pupuk yang tepat</span>, dan 
        <span class="font-semibold text-cyan-600 dark:text-cyan-400">perhitungan pertanian lainnya</span>.
        Dapatkan hasil yang akurat untuk meningkatkan produktivitas dan efisiensi usaha tani Anda.
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
