<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// State untuk menyimpan data cuaca dan lokasi
const weatherData = ref<any>(null)
const forecastData = ref<any>(null)
const location = ref('')
const isLoading = ref(true)
const isForecastLoading = ref(false)
const error = ref('')
const forecastError = ref('')
const activeTab = ref('today')

// Environment variables
const API_KEY = process.env.OPENWEATHER_API_KEY || '416f0ed0bb28d3110beedecf5fa9cf85'
const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'

// Fungsi untuk mengakses lokasi pengguna
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        location.value = `${lat}, ${lon}`

        // Ambil data cuaca hari ini
        await fetchWeatherData(lat, lon)
        // Ambil data prediksi cuaca
        await fetchForecastData(lat, lon)
      },
      (error) => {
        console.error('Error mendapatkan lokasi:', error)
        location.value = 'Lokasi tidak dapat diakses'
        isLoading.value = false
        error.value = 'Tidak dapat mengakses lokasi Anda'
      }
    )
  } else {
    location.value = 'Geolocation tidak didukung di browser ini'
    isLoading.value = false
    error.value = 'Geolocation tidak didukung di browser ini'
  }
}

// Fungsi untuk mengambil data cuaca hari ini
const fetchWeatherData = async (lat: number, lon: number) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    console.log('Data cuaca hari ini:', data)
    weatherData.value = data
    isLoading.value = false
  } catch (err) {
    console.error('Error mengambil data cuaca:', err)
    error.value = 'Gagal mengambil data cuaca'
    isLoading.value = false
  }
}

// Fungsi untuk mengambil data prediksi cuaca 7 hari
const fetchForecastData = async (lat: number, lon: number) => {
  isForecastLoading.value = true
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    console.log('Data prediksi cuaca:', data)
    
    // Group forecast data by day
    const dailyForecast = groupForecastByDay(data.list)
    forecastData.value = dailyForecast
    isForecastLoading.value = false
  } catch (err) {
    console.error('Error mengambil data prediksi cuaca:', err)
    forecastError.value = 'Gagal mengambil data prediksi cuaca'
    isForecastLoading.value = false
  }
}

// Fungsi untuk mengelompokkan data prediksi berdasarkan hari
const groupForecastByDay = (forecastList: any[]) => {
  const grouped: any = {}
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dateKey = date.toISOString().split('T')[0]
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        items: [],
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        main_weather: item.weather[0],
        humidity: item.main.humidity,
        wind_speed: item.wind.speed
      }
    }
    
    grouped[dateKey].items.push(item)
    grouped[dateKey].temp_min = Math.min(grouped[dateKey].temp_min, item.main.temp_min)
    grouped[dateKey].temp_max = Math.max(grouped[dateKey].temp_max, item.main.temp_max)
  })
  
  return Object.values(grouped).slice(0, 7) // Ambil 7 hari ke depan
}

// Computed properties untuk informasi pertanian
const farmingConditions = computed(() => {
  if (!weatherData.value) return null

  const temp = weatherData.value.main.temp
  const humidity = weatherData.value.main.humidity
  const windSpeed = weatherData.value.wind.speed
  const clouds = weatherData.value.clouds.all
  const weatherMain = weatherData.value.weather[0].main.toLowerCase()
  
  const conditions = {
    suitable: true,
    recommendations: [] as string[]
  }

  // Kondisi suhu
  if (temp > 35) {
    conditions.suitable = false
    conditions.recommendations.push('Suhu terlalu tinggi. Siram tanaman lebih sering dan hindari penyemprotan pestisida.')
  } else if (temp < 15) {
    conditions.suitable = false
    conditions.recommendations.push('Suhu terlalu rendah. Lindungi tanaman dari embun beku.')
  } else if (temp >= 25 && temp <= 35) {
    conditions.recommendations.push('Suhu optimal untuk pertumbuhan tanaman tropis.')
  }

  // Kondisi kelembaban
  if (humidity > 85) {
    conditions.recommendations.push('Kelembaban tinggi. Waspada serangan jamur dan hama.')
  } else if (humidity < 40) {
    conditions.recommendations.push('Kelembaban rendah. Tingkatkan penyiraman.')
  } else {
    conditions.recommendations.push('Kelembaban ideal untuk sebagian besar tanaman.')
  }

  // Kondisi angin
  if (windSpeed > 5) {
    conditions.recommendations.push('Angin kencang. Hindari penyemprotan pestisida atau pupuk.')
  } else {
    conditions.recommendations.push('Kondisi angin baik untuk penyemprotan pestisida/pupuk.')
  }

  // Kondisi awan
  if (clouds > 80) {
    conditions.recommendations.push('Tingkat cahaya matahari rendah. Tanaman mungkin kurang optimal untuk fotosintesis.')
  } else if (clouds < 30) {
    conditions.recommendations.push('Cahaya matahari optimal untuk fotosintesis tanaman.')
  }

  // Kondisi cuaca
  if (weatherMain.includes('rain') || weatherMain.includes('thunder')) {
    conditions.suitable = false
    conditions.recommendations.push('Hujan. Tunda pemupukan dan penyemprotan pestisida.')
  } else if (weatherMain.includes('clear')) {
    conditions.recommendations.push('Cuaca cerah. Waktu ideal untuk pemupukan dan pengolahan lahan.')
  }

  return conditions
})

// Mendapatkan jam matahari terbit dan terbenam berdasarkan timezone
const currentLocalTime = computed(() => {
  if (!weatherData.value) return '-'

  const timestamp = weatherData.value.dt
  const timezoneOffset = weatherData.value.timezone

  const utcDate = new Date((timestamp + timezoneOffset) * 1000)

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(utcDate)
})

const sunriseTime = computed(() => {
  if (!weatherData.value) return '-'

  const timestamp = weatherData.value.sys.sunrise
  const timezoneOffset = weatherData.value.timezone
  const utcDate = new Date((timestamp + timezoneOffset) * 1000)

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(utcDate)
})

const sunsetTime = computed(() => {
  if (!weatherData.value) return '-'

  const timestamp = weatherData.value.sys.sunset
  const timezoneOffset = weatherData.value.timezone
  const utcDate = new Date((timestamp + timezoneOffset) * 1000)

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(utcDate)
})

// Mendapatkan arah angin dalam bahasa Indonesia
const windDirection = computed(() => {
  if (!weatherData.value) return '-'
  
  const deg = weatherData.value.wind.deg
  
  if (deg >= 337.5 || deg < 22.5) return 'Utara'
  if (deg >= 22.5 && deg < 67.5) return 'Timur Laut'
  if (deg >= 67.5 && deg < 112.5) return 'Timur'
  if (deg >= 112.5 && deg < 157.5) return 'Tenggara'
  if (deg >= 157.5 && deg < 202.5) return 'Selatan'
  if (deg >= 202.5 && deg < 247.5) return 'Barat Daya'
  if (deg >= 247.5 && deg < 292.5) return 'Barat'
  if (deg >= 292.5 && deg < 337.5) return 'Barat Laut'
  
  return '-'
})

// Fungsi untuk format tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date)
}

// Fungsi untuk format tanggal pendek
const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(date)
}

// Menjalankan fungsi untuk mendapatkan lokasi dan data cuaca saat halaman dimuat
onMounted(() => {
  getLocation()
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
    <!-- Header Panel -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white px-6 py-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold flex items-center">
          <Icon name="mdi:weather-partly-cloudy" class="w-6 h-6 mr-2" />
          Info Cuaca Pertanian
        </h2>
        <div class="text-sm bg-green-800 bg-opacity-30 dark:bg-green-900 dark:bg-opacity-50 px-3 py-1 rounded-full">
          {{ currentLocalTime }}
        </div>
      </div>
      <p v-if="weatherData" class="text-sm mt-1">
        {{ weatherData.name }}, {{ weatherData.sys.country }}
      </p>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-600">
      <nav class="flex">
        <button
        :class="[
          'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
          activeTab === 'today'
          ? 'border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 dark:bg-opacity-20'
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        ]"
        @click="activeTab = 'today'"
        >
          <Icon name="mdi:weather-sunny" class="w-4 h-4 mr-2 inline-block" />
          Cuaca Hari Ini
        </button>
        <button
        :class="[
          'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
          activeTab === 'forecast'
          ? 'border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 dark:bg-opacity-20'
          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        ]"
        @click="activeTab = 'forecast'"
        >
          <Icon name="mdi:calendar-week" class="w-4 h-4 mr-2 inline-block" />
          Prediksi 5 Hari
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      <!-- Tab Cuaca Hari Ini -->
      <div v-if="activeTab === 'today'">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent dark:border-green-400"/>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Memuat data cuaca...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error">
          <div class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4" role="alert">
            <p class="font-bold">Error</p>
            <p>{{ error }}</p>
          </div>
        </div>

        <!-- Weather Data -->
        <div v-else-if="weatherData">
          <!-- Current Weather Summary -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <img
                :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" 
                class="w-16 h-16" 
                :alt="weatherData.weather[0].description"
              >
              <div class="ml-2">
                <h3 class="text-2xl font-bold dark:text-white">{{ Math.round(weatherData.main.temp) }}°C</h3>
                <p class="text-gray-600 dark:text-gray-300 capitalize">{{ weatherData.weather[0].description }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm dark:text-gray-200">Terasa seperti: <span class="font-semibold">{{ Math.round(weatherData.main.feels_like) }}°C</span></p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Min: {{ Math.round(weatherData.main.temp_min) }}°C / Max: {{ Math.round(weatherData.main.temp_max) }}°C</p>
            </div>
          </div>

          <!-- Detailed Weather Info -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                <Icon name="mdi:water-percent" class="w-5 h-5 mr-1" />
                <span class="text-sm">Kelembaban</span>
              </div>
              <p class="text-lg font-semibold dark:text-white">{{ weatherData.main.humidity }}%</p>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                <Icon name="mdi:weather-windy" class="w-5 h-5 mr-1" />
                <span class="text-sm">Angin</span>
              </div>
              <p class="text-lg font-semibold dark:text-white">{{ weatherData.wind.speed }} m/s</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Arah: {{ windDirection }}</p>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                <Icon name="mdi:weather-sunset-up" class="w-5 h-5 mr-1" />
                <span class="text-sm">Matahari Terbit</span>
              </div>
              <p class="text-lg font-semibold dark:text-white">{{ sunriseTime }}</p>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                <Icon name="mdi:weather-sunset-down" class="w-5 h-5 mr-1" />
                <span class="text-sm">Matahari Terbenam</span>
              </div>
              <p class="text-lg font-semibold dark:text-white">{{ sunsetTime }}</p>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                <Icon name="mdi:eye" class="w-5 h-5 mr-1" />
                <span class="text-sm">Jarak Pandang</span>
              </div>
              <p class="text-lg font-semibold dark:text-white">{{ weatherData.visibility / 1000 }} km</p>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                <Icon name="mdi:gauge" class="w-5 h-5 mr-1" />
                <span class="text-sm">Tekanan</span>
              </div>
              <p class="text-lg font-semibold dark:text-white">{{ weatherData.main.pressure }} hPa</p>
            </div>
          </div>

          <!-- Farming Recommendations -->
          <div v-if="farmingConditions" class="border-t dark:border-gray-600 pt-4">
            <h3 class="text-lg font-semibold mb-2 flex items-center dark:text-white">
              <Icon name="mdi:tractor" class="w-5 h-5 mr-2" />
              Rekomendasi Pertanian
            </h3>
            
            <div
              :class="['p-3 rounded-lg mb-2', 
                farmingConditions.suitable 
                  ? 'bg-green-50 border border-green-200 dark:bg-green-900 dark:bg-opacity-20 dark:border-green-700' 
                  : 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-900 dark:bg-opacity-20 dark:border-yellow-700']"
            >
              <p class="font-medium mb-1 dark:text-gray-200">
                <Icon
                  :name="farmingConditions.suitable ? 'mdi:check-circle' : 'mdi:alert-circle'" 
                  :class="['w-5 h-5 inline-block mr-1', 
                    farmingConditions.suitable 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400']"
                />
                <span v-if="farmingConditions.suitable">Kondisi cuaca cocok untuk aktivitas pertanian</span>
                <span v-else>Kondisi cuaca kurang optimal untuk beberapa aktivitas pertanian</span>
              </p>
            </div>
            
            <ul class="space-y-2">
              <li v-for="(rec, index) in farmingConditions.recommendations" :key="index" class="flex items-start">
                <Icon name="mdi:information" class="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span class="text-sm dark:text-gray-300">{{ rec }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tab Prediksi 7 Hari -->
      <div v-if="activeTab === 'forecast'">
        <!-- Loading State -->
        <div v-if="isForecastLoading" class="flex justify-center items-center py-8">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent dark:border-green-400"/>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Memuat prediksi cuaca...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="forecastError">
          <div class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4" role="alert">
            <p class="font-bold">Error</p>
            <p>{{ forecastError }}</p>
          </div>
        </div>

        <!-- Forecast Data -->
        <div v-else-if="forecastData && forecastData.length > 0" class="space-y-4">
          <div
            v-for="(day, index) in forecastData"
            :key="day.date"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div class="flex items-center">
              <img
                :src="`https://openweathermap.org/img/wn/${day.main_weather.icon}@2x.png`"
                class="w-12 h-12 mr-3"
                :alt="day.main_weather.description"
              >
              <div>
                <h4 class="font-medium dark:text-white">
                  {{ index === 0 ? 'Hari Ini' : formatDateShort(day.date) }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {{ day.main_weather.description }}
                </p>
              </div>
            </div>
            
            <div class="text-right">
              <div class="flex items-center space-x-4">
                <div class="text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Min/Max</p>
                  <p class="font-semibold dark:text-white">
                    {{ Math.round(day.temp_min) }}°/{{ Math.round(day.temp_max) }}°
                  </p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Kelembaban</p>
                  <p class="font-semibold dark:text-white">{{ day.humidity }}%</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Angin</p>
                  <p class="font-semibold dark:text-white">{{ day.wind_speed.toFixed(1) }} m/s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>