<script setup lang="ts">
import { ref } from 'vue';

// Data cuaca untuk lokasi Yogyakarta
const weatherData = ref({
  location: "Yogyakarta",
  date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }),
  currentTemp: 29,
  weatherCondition: "Berawan Sebagian",
  humidity: 78,
  rainfall: 0.5,
  windSpeed: 8.2,
  soilMoisture: 65,
  uvIndex: 8
});

// Rekomendasi pertanian sederhana
const farmingTips = ref([
  "Waktu ideal untuk menyiram: Pagi (06:00-08:00)",
  "Tidak disarankan menyemprot pestisida hari ini",
  "Kelembaban tanah cukup, kurangi penyiraman"
]);

// Mendapatkan icon cuaca berdasarkan kondisi
const getWeatherIcon = () => {
  const condition = weatherData.value.weatherCondition.toLowerCase();
  if (condition.includes("cerah")) return "sun";
  if (condition.includes("berawan sebagian")) return "cloud-sun";
  if (condition.includes("berawan")) return "cloud";
  if (condition.includes("hujan")) return "cloud-rain";
  return "sun";
};

// Mendapatkan kelas warna untuk indeks UV
const getUvIndexClass = () => {
  const index = weatherData.value.uvIndex;
  if (index <= 2) return "bg-green-500";
  if (index <= 5) return "bg-yellow-500";
  if (index <= 7) return "bg-orange-500";
  return "bg-red-500";
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
      <div class="flex justify-between items-center mx-8">
        <div>
          <h2 class="text-xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Info Cuaca Pertanian
          </h2>
          <p class="text-green-100 text-sm mt-1">{{ weatherData.date }}</p>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ weatherData.location }}</span>
        </div>
      </div>
    </div>

    <!-- Main Weather Display -->
    <div class="flex flex-col md:flex-row p-4">
      <!-- Current Weather -->
      <div class="flex items-center justify-center flex-grow pb-4 md:pb-0 md:border-r border-gray-200">
        <div class="mr-4">
          <!-- Weather Icon -->
          <svg v-if="getWeatherIcon() === 'sun'" xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else-if="getWeatherIcon() === 'cloud-sun'" xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <svg v-else-if="getWeatherIcon() === 'cloud-rain'" xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <div>
          <p class="text-4xl font-bold text-gray-800">{{ weatherData.currentTemp }}°C</p>
          <p class="text-gray-500">{{ weatherData.weatherCondition }}</p>
        </div>
      </div>

      <!-- Weather Parameters -->
      <div class="flex-grow grid grid-cols-2 gap-3 md:pl-4">
        <!-- Humidity -->
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14.5v.5a2 2 0 01-2 2h-4l-4 4v-4H5a2 2 0 01-2-2v-7a2 2 0 012-2h2.5M15 3h6v6M14 10l6.5-6.5" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500">Kelembapan</p>
            <p class="font-bold text-gray-800">{{ weatherData.humidity }}%</p>
          </div>
        </div>

        <!-- Rainfall -->
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7l4-4m0 0l4 4m-4-4v18" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500">Curah Hujan</p>
            <p class="font-bold text-gray-800">{{ weatherData.rainfall }} mm</p>
          </div>
        </div>

       <!-- Wind -->
<div class="flex items-center">
  <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  </div>
  <div>
    <p class="text-xs text-gray-500">Kecepatan Angin</p>
    <p class="font-bold text-gray-800">{{ weatherData.windSpeed }} km/jam</p>
  </div>
</div>

<!-- Soil Moisture -->
<div class="flex items-center">
  <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4.5 8-10A8 8 0 104 12c0 5.5 8 10 8 10z" />
    </svg>
  </div>
  <div>
    <p class="text-xs text-gray-500">Kelembapan Tanah</p>
    <p class="font-bold text-gray-800">{{ weatherData.soilMoisture }}%</p>
  </div>
</div>

<!-- UV Index -->
<div class="col-span-2">
  <div class="flex items-center">
    <div :class="['w-10 h-10 rounded-full flex items-center justify-center mr-3', getUvIndexClass()]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>
    <div>
      <p class="text-xs text-gray-500">Indeks UV</p>
      <p class="font-bold text-gray-800">{{ weatherData.uvIndex }}</p>
    </div>
  </div>
</div>

    <!-- Farming Tips -->
<div class="p-4 bg-gray-50 border-t border-gray-200">
  <h3 class="font-semibold text-gray-700 mb-2">Rekomendasi Hari Ini</h3>
  <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600">
    <li v-for="(tip, index) in farmingTips" :key="index">{{ tip }}</li>
  </ul>
</div>
<!-- Farming Tips -->
<div class="p-4 bg-gray-50 border-t border-gray-200">
  <h3 class="font-semibold text-gray-700 mb-2">Quotes Juru Tani</h3>
  <p class="text-sm text-gray-600">"Berkebun adalah seni menunggu hasil dari kerja keras kita."</p>
  <p class="text-sm text-gray-600">"Tanah adalah ibu kita, rawatlah ia dengan baik."</p>
</div>

  </div>
</div>

</div>
</template>

<style scoped>
/* Transisi smooth untuk hover */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>