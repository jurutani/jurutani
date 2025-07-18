<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// State untuk menyimpan data cuaca dan lokasi
const weatherData = ref<any>(null)
const forecastData = ref<any>(null)
const hourlyData = ref<any>(null)
const location = ref('')
const isLoading = ref(true)
const isForecastLoading = ref(false)
const isHourlyLoading = ref(false)
const error = ref('')
const forecastError = ref('')
const hourlyError = ref('')
const activeTab = ref('current')

// Environment variables
const API_KEY = process.env.OPENWEATHER_API_KEY || '416f0ed0bb28d3110beedecf5fa9cf85'
const BASE_URL = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'
// const API_KEY = process.env.OPENWEATHER_API_KEY || ''
// const BASE_URL = process.env.OPENWEATHER_BASE_URL || ''

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
    weatherData.value = data
    isLoading.value = false
  } catch (err) {
    console.error('Error mengambil data cuaca:', err)
    error.value = 'Gagal mengambil data cuaca'
    isLoading.value = false
  }
}

// Fungsi untuk mengambil data prediksi cuaca 5 hari + hourly
const fetchForecastData = async (lat: number, lon: number) => {
  isForecastLoading.value = true
  isHourlyLoading.value = true
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    
    // Group forecast data by day (5 days)
    const dailyForecast = groupForecastByDay(data.list)
    forecastData.value = dailyForecast
    
    // Get hourly data for next 24 hours
    const next24Hours = data.list.slice(0, 8) // 8 intervals = 24 hours (3-hour intervals)
    hourlyData.value = next24Hours
    
    isForecastLoading.value = false
    isHourlyLoading.value = false
  } catch (err) {
    console.error('Error mengambil data prediksi cuaca:', err)
    forecastError.value = 'Gagal mengambil data prediksi cuaca'
    hourlyError.value = 'Gagal mengambil data hourly cuaca'
    isForecastLoading.value = false
    isHourlyLoading.value = false
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
        wind_speed: item.wind.speed,
        pop: item.pop || 0 // Probability of precipitation
      }
    }
    
    grouped[dateKey].items.push(item)
    grouped[dateKey].temp_min = Math.min(grouped[dateKey].temp_min, item.main.temp_min)
    grouped[dateKey].temp_max = Math.max(grouped[dateKey].temp_max, item.main.temp_max)
  })
  
  return Object.values(grouped).slice(0, 5) // 5 hari ke depan
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

// Computed properties untuk waktu
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
  if (!weatherData.value || !weatherData.value.wind) return '-'
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

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(date)
}

const formatHour = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('id-ID', { 
    hour: '2-digit',
    hour12: false
  })
}

// Menjalankan fungsi untuk mendapatkan lokasi dan data cuaca saat halaman dimuat
onMounted(() => {
  getLocation()
})
</script>

<template>
  <div class="rounded-lg">
    <div class="container mx-auto px-4 py-6">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Info Cuaca Pertanian
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Informasi cuaca real-time untuk kebutuhan pertanian Anda
        </p>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex justify-center mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-lg">
          <nav class="flex space-x-1">
            <button
              :class="[
                'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                activeTab === 'current'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400'
              ]"
              @click="activeTab = 'current'"
            >
              <UIcon name="i-ic-baseline-wb-sunny" class="w-4 h-4 mr-2 inline-block" />
              Cuaca Saat Ini
            </button>
            <button
              :class="[
                'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                activeTab === 'hourly'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400'
              ]"
              @click="activeTab = 'hourly'"
            >
              <UIcon name="i-ic-baseline-access-time" class="w-4 h-4 mr-2 inline-block" />
              Ramalan 24 Jam
            </button>
            <button
              :class="[
                'px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                activeTab === 'forecast'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400'
              ]"
              @click="activeTab = 'forecast'"
            >
              <UIcon name="i-ic-baseline-date-range" class="w-4 h-4 mr-2 inline-block" />
              Ramalan 5 Hari
            </button>
          </nav>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-6xl mx-auto">
        <!-- Tab Cuaca Saat Ini -->
        <div v-if="activeTab === 'current'" class="space-y-6">
          <!-- Loading State -->
          <LoadingData v-if="isLoading" message="Memuat data cuaca..." />
          
          <!-- Error State -->
          <DataNotFound v-else-if="error" :message="error" />
          
          <!-- Weather Data -->
          <div v-else-if="weatherData" class="space-y-6">
            <!-- Main Weather Card -->
            <div class="bg-gradient-to-br from-green-500 to-green-800 rounded-3xl p-8 text-white shadow-2xl">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h2 class="text-2xl font-bold mb-1">{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
                  <p class="text-green-100 text-sm">{{ currentLocalTime }}</p>
                </div>
                <div class="text-right">
                  <div class="text-4xl font-light">{{ Math.round(weatherData.main.temp) }}°</div>
                  <p class="text-green-100 capitalize">{{ weatherData.weather[0].description }}</p>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img
                    src="/profile.png"
                    class="w-20 h-20 mr-4"
                    :alt="weatherData.weather[0].description"
                    @error="$event.target.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`"
                  >
                  <div>
                    <p class="text-sm text-green-100">Terasa seperti</p>
                    <p class="text-xl font-semibold">{{ Math.round(weatherData.main.feels_like) }}°C</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-green-100">Min / Max</p>
                  <p class="text-lg font-semibold">{{ Math.round(weatherData.main.temp_min) }}° / {{ Math.round(weatherData.main.temp_max) }}°</p>
                </div>
              </div>
            </div>

            <!-- Weather Details Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <!-- Kelembaban -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div class="flex items-center mb-2">
                  <UIcon name="i-ic-baseline-water-drop" class="w-6 h-6 text-green-500 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Kelembaban</span>
                </div>
                <p class="text-2xl font-bold dark:text-white">{{ weatherData.main.humidity }}%</p>
              </div>

              <!-- Angin -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div class="flex items-center mb-2">
                  <UIcon name="i-ic-baseline-air" class="w-6 h-6 text-green-500 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Angin</span>
                </div>
                <p class="text-2xl font-bold dark:text-white">{{ weatherData.wind?.speed || 0 }} m/s</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ windDirection }}</p>
              </div>

              <!-- Matahari Terbit -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div class="flex items-center mb-2">
                  <UIcon name="i-ic-baseline-wb-sunny" class="w-6 h-6 text-orange-500 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Terbit</span>
                </div>
                <p class="text-2xl font-bold dark:text-white">{{ sunriseTime }}</p>
              </div>

              <!-- Matahari Terbenam -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div class="flex items-center mb-2">
                  <UIcon name="i-ic-baseline-wb-twilight" class="w-6 h-6 text-red-500 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Terbenam</span>
                </div>
                <p class="text-2xl font-bold dark:text-white">{{ sunsetTime }}</p>
              </div>

              <!-- Jarak Pandang -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div class="flex items-center mb-2">
                  <UIcon name="i-ic-baseline-visibility" class="w-6 h-6 text-purple-500 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Pandang</span>
                </div>
                <p class="text-2xl font-bold dark:text-white">{{ (weatherData.visibility / 1000).toFixed(1) }} km</p>
              </div>

              <!-- Tekanan -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div class="flex items-center mb-2">
                  <UIcon name="i-ic-baseline-speed" class="w-6 h-6 text-indigo-500 mr-2" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">Tekanan</span>
                </div>
                <p class="text-2xl font-bold dark:text-white">{{ weatherData.main.pressure }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">hPa</p>
              </div>
            </div>

            <!-- Rekomendasi Pertanian -->
            <div v-if="farmingConditions" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 class="text-xl font-bold mb-4 flex items-center dark:text-white">
                <UIcon name="i-ic-baseline-agriculture" class="w-6 h-6 mr-2 text-green-500" />
                Rekomendasi Pertanian
              </h3>
              
              <div
                :class="[
                  'p-4 rounded-xl mb-4 border-l-4',
                  farmingConditions.suitable 
                    ? 'bg-green-50 border-green-500 dark:bg-green-900 dark:bg-opacity-20' 
                    : 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900 dark:bg-opacity-20'
                ]"
              >
                <p class="font-semibold flex items-center dark:text-gray-200">
                  <UIcon
                    :name="farmingConditions.suitable ? 'i-ic-baseline-check-circle' : 'i-ic-baseline-warning'"
                    :class="[
                      'w-5 h-5 mr-2',
                      farmingConditions.suitable ? 'text-green-600' : 'text-yellow-600'
                    ]"
                  />
                  {{ farmingConditions.suitable ? 'Kondisi Optimal' : 'Perlu Perhatian' }}
                </p>
              </div>
              
              <div class="space-y-3">
                <div
                  v-for="(rec, index) in farmingConditions.recommendations"
                  :key="index"
                  class="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <UIcon name="i-ic-baseline-info" class="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                  <span class="text-sm dark:text-gray-300">{{ rec }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Ramalan 24 Jam -->
        <div v-if="activeTab === 'hourly'" class="space-y-6">
          <LoadingData v-if="isHourlyLoading" message="Memuat ramalan 24 jam..." />
          <DataNotFound v-else-if="hourlyError" :message="hourlyError" />
          
          <div v-else-if="hourlyData && hourlyData.length > 0">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 class="text-xl font-bold mb-6 dark:text-white">Ramalan 24 Jam Kedepan</h3>
              
              <!-- Horizontal Scroll Container -->
              <div class="overflow-x-auto pb-4">
                <div class="flex space-x-4 min-w-max">
                  <div
                    v-for="(hour, index) in hourlyData"
                    :key="hour.dt"
                    class="flex-shrink-0 text-center bg-gray-50 dark:bg-gray-700 rounded-xl p-4 min-w-[120px]"
                  >
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {{ index === 0 ? 'Sekarang' : formatHour(hour.dt) }}
                    </p>
                    <img
                      :src="`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`"
                      class="w-12 h-12 mx-auto mb-2"
                      :alt="hour.weather[0].description"
                    >
                    <p class="text-lg font-bold dark:text-white mb-1">{{ Math.round(hour.main.temp) }}°</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ Math.round(hour.pop * 100) }}%</p>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      <p>💨 {{ hour.wind.speed.toFixed(1) }}m/s</p>
                      <p>💧 {{ hour.main.humidity }}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Ramalan 5 Hari -->
        <div v-if="activeTab === 'forecast'" class="space-y-6">
          <LoadingData v-if="isForecastLoading" message="Memuat ramalan 5 hari..." />
          <DataNotFound v-else-if="forecastError" :message="forecastError" />
          
          <div v-else-if="forecastData && forecastData.length > 0">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6 dark:text-white">Ramalan 5 Hari Kedepan</h3>
              
              <div class="space-y-3 sm:space-y-4">
                <div
                  v-for="(day, index) in forecastData"
                  :key="day.date"
                  class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <!-- Mobile Layout: Stacked -->
                  <div class="flex items-center justify-between sm:justify-start sm:flex-1 mb-3 sm:mb-0">
                    <div class="flex items-center flex-1 sm:flex-none">
                      <img
                        :src="`https://openweathermap.org/img/wn/${day.main_weather.icon}@2x.png`"
                        class="w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4 flex-shrink-0"
                        :alt="day.main_weather.description"
                      >
                      <div class="min-w-0 flex-1">
                        <h4 class="font-semibold text-base sm:text-lg dark:text-white truncate">
                          {{ index === 0 ? 'Hari Ini' : formatDateShort(day.date) }}
                        </h4>
                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 capitalize leading-tight">
                          {{ day.main_weather.description }}
                        </p>
                        <p class="text-xs text-green-600 dark:text-green-400 mt-1">
                          Hujan: {{ Math.round(day.pop * 100) }}%
                        </p>
                      </div>
                    </div>
                    
                    <!-- Temperature - Always visible on mobile -->
                    <div class="text-center sm:hidden ml-2">
                      <p class="text-xl font-bold dark:text-white">
                        {{ Math.round(day.temp_max) }}°
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ Math.round(day.temp_min) }}°
                      </p>
                    </div>
                  </div>
                  
                  <!-- Desktop Layout: Right side info -->
                  <div class="hidden sm:flex sm:items-center sm:space-x-6 sm:text-right">
                    <div class="text-center">
                      <p class="text-2xl font-bold dark:text-white">
                        {{ Math.round(day.temp_max) }}°
                      </p>
                      <p class="text-lg text-gray-500 dark:text-gray-400">
                        {{ Math.round(day.temp_min) }}°
                      </p>
                    </div>
                    <div class="text-center min-w-[60px]">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Kelembaban</p>
                      <p class="font-semibold dark:text-white">{{ day.humidity }}%</p>
                    </div>
                    <div class="text-center min-w-[60px]">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Angin</p>
                      <p class="font-semibold dark:text-white">{{ day.wind_speed.toFixed(1) }} m/s</p>
                    </div>
                  </div>
                  
                  <!-- Mobile Layout: Bottom row with additional info -->
                  <div class="flex justify-between items-center sm:hidden pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div class="text-center flex-1">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Kelembaban</p>
                      <p class="text-sm font-semibold dark:text-white">{{ day.humidity }}%</p>
                    </div>
                    <div class="text-center flex-1">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Angin</p>
                      <p class="text-sm font-semibold dark:text-white">{{ day.wind_speed.toFixed(1) }} m/s</p>
                    </div>
                    <div class="text-center flex-1">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Terasa</p>
                      <p class="text-sm font-semibold dark:text-white">{{ day.feels_like !== undefined ? Math.round(day.feels_like) : '-' }}°</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar untuk horizontal scroll */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>