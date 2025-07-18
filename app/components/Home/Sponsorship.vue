<script setup lang="ts">
import { ref } from 'vue'

// Interface untuk tipe sponsor
interface Sponsor {
  id: number
  name: string
  logo: string
  description: string
  website?: string
}

// Data sponsor
const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "Partner Teknologi Pertanian",
    logo: "/logo/sponsor1.png",
    description: "Partner Teknologi Pertanian Terpercaya",
    website: "https://example.com"
  }
]

// Reactive variables
const isLoading = ref<boolean>(false)
const currentSponsor = ref<Sponsor | null>(sponsors[0])
</script>

<template>
  <div class="bg-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Partner Teknologi Pertanian
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Didukung oleh perusahaan terkemuka dalam bidang teknologi pertanian dan agrikultur modern
        </p>
      </div>

      <!-- Sponsor Card -->
      <div class="flex justify-center">
        <div class="sponsor-card group max-w-sm">
          <div class="bg-white p-8 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-center h-20 mb-4">
              <img 
                :src="currentSponsor?.logo" 
                :alt="currentSponsor?.name" 
                class="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              >
            </div>
            <p class="text-sm text-gray-600 text-center">
              {{ currentSponsor?.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sponsor-card {
  transition: transform 0.3s ease;
}

.sponsor-card:hover {
  transform: translateY(-2px);
}
</style>