<script setup lang="ts">
import { ref, computed } from 'vue'

const luasLahan = ref<number | null>(null) // m2
const jarakBaris = ref<number | null>(null) // cm
const jarakTanam = ref<number | null>(null) // cm
const benihPerLubang = ref<number | null>(1)
const cadanganPersen = ref<number | null>(10) // %
const dayaTumbuhPersen = ref<number | null>(85) // %

const totalKebutuhanBenih = computed<number>(() => {
  if (
    !luasLahan.value ||
    !jarakBaris.value ||
    !jarakTanam.value ||
    !benihPerLubang.value ||
    !cadanganPersen.value ||
    !dayaTumbuhPersen.value
  ) {
    return 0
  }

  const jumlahLubang = (luasLahan.value * 10000) / (jarakBaris.value * jarakTanam.value)
  const totalBenih = (jumlahLubang * benihPerLubang.value) / (dayaTumbuhPersen.value / 100)
  const totalBenihDenganCadangan = totalBenih * (1 + cadanganPersen.value / 100)

  return totalBenihDenganCadangan
})
</script>

<template>
  <div class="rounded-xl p-6 shadow-md bg-white dark:bg-green-800">
    <h2 class="text-2xl font-bold text-primary mb-6">Kalkulator Benih</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Luas Lahan (m²)</label>
          <UInput v-model="luasLahan" type="number" placeholder="Contoh: 1000" />
        </div>

        <div>
          <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Jarak Tanam (cm)</label>
          <div class="flex items-center space-x-2">
            <UInput v-model="jarakBaris" type="number" placeholder="Baris (misal 25)" />
            <span class="text-gray-600">x</span>
            <UInput v-model="jarakTanam" type="number" placeholder="Tanam (misal 25)" />
          </div>
        </div>

        <div>
          <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Benih per Lubang</label>
          <UInput v-model="benihPerLubang" type="number" placeholder="Misal 1" />
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Cadangan (%)</label>
          <UInput v-model="cadanganPersen" type="number" placeholder="Misal 10" />
        </div>

        <div>
          <label class="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Daya Tumbuh (%)</label>
          <UInput v-model="dayaTumbuhPersen" type="number" placeholder="Misal 85" />
        </div>

        <div class="mt-6">
          <p class="text-lg font-bold text-gray-800 dark:text-gray-100">
            Total Kebutuhan Benih:
            <span class="text-primary">{{ totalKebutuhanBenih.toFixed(0) }} butir</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.text-primary {
  @apply text-green-700 dark:text-green-300;
}
</style>
