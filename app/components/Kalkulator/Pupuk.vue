<script setup lang="ts">
import { ref, computed } from 'vue'

const luasLahan = ref<number | null>(null) // dalam hektar

// Standar kebutuhan pupuk dasar per hektar (contoh padi sawah)
const ureaPerHa = 100 // kg
const npkPerHa = 150 // kg
const kclPerHa = 75 // kg

const totalUrea = computed(() => (luasLahan.value || 0) * ureaPerHa)
const totalNPK = computed(() => (luasLahan.value || 0) * npkPerHa)
const totalKCL = computed(() => (luasLahan.value || 0) * kclPerHa)
</script>

<template>
  <div class="rounded-xl p-6 shadow-md bg-white dark:bg-green-800">
    <h2 class="text-2xl font-bold text-primary mb-4">Kalkulator Pupuk Padi</h2>

    <div class="space-y-4">
      <div>
        <label class="block font-medium mb-1 text-gray-700 dark:text-gray-200">Luas Lahan (hektar)</label>
        <UInput v-model="luasLahan" type="number" placeholder="Masukkan luas lahan dalam hektar" />
      </div>

      <div class="mt-6 space-y-2">
        <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Kebutuhan Urea: <span class="text-primary">{{ totalUrea }} kg</span>
        </p>
        <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Kebutuhan NPK: <span class="text-primary">{{ totalNPK }} kg</span>
        </p>
        <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Kebutuhan KCL: <span class="text-primary">{{ totalKCL }} kg</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: #2E7D32;
}
</style>
