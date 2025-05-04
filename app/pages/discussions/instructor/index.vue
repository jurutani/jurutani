<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

interface Instructor {
  id: number;
  name: string;
  province: string;
  district: string;
  note: string;
  image: string;
}

export default defineComponent({
  name: 'InstructorDiscussions',
  
  setup() {
    const selectedProvince = ref<string>('Jawa Barat');
    const searchQuery = ref<string>('');
    
    const provinces = [
      'Jawa Barat',
      'Jawa Tengah',
      'Jawa Timur'
    ];
    
    const districts = {
      'Jawa Barat': ['Bandung', 'Bogor', 'Cianjur'],
      'Jawa Tengah': ['Semarang', 'Solo', 'Magelang'],
      'Jawa Timur': ['Surabaya', 'Malang', 'Kediri']
    };
    
    const selectedDistrict = ref<string>(districts[selectedProvince.value][0]);
    
    const instructors: Instructor[] = [
      {
        id: 1,
        name: 'Ir. Bambang Suryanto',
        province: 'Jawa Barat',
        district: 'Bandung',
        note: 'Spesialis tanaman padi dengan pengalaman 15 tahun di lahan pertanian dataran tinggi',
        image: '/placeholder.png'
      },
      {
        id: 2,
        name: 'Dr. Siti Nurhasanah',
        province: 'Jawa Barat',
        district: 'Bogor',
        note: 'Ahli budidaya hortikultura dan pengelolaan lahan perkebunan organik',
        image: '/placeholder.png'
      },
      {
        id: 3,
        name: 'Muh. Rizki Pratama, M.Sc',
        province: 'Jawa Tengah',
        district: 'Semarang',
        note: 'Konsultan pertanian terpadu dengan keahlian dalam sistem irigasi modern',
        image: '/placeholder.png'
      }
    ];
    
    const availableDistricts = computed(() => {
      return districts[selectedProvince.value] || [];
    });
    
    const filteredInstructors = computed(() => {
      return instructors.filter(instructor => {
        const matchesLocation = instructor.province === selectedProvince.value && 
                               instructor.district === selectedDistrict.value;
        
        // If search query is empty, only filter by location
        if (!searchQuery.value) {
          return matchesLocation;
        }
        
        // If search query exists, filter by name match and location
        const nameMatch = instructor.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        return matchesLocation && nameMatch;
      });
    });
    
    const selectProvince = (province: string) => {
      selectedProvince.value = province;
      selectedDistrict.value = districts[province][0];
    };
    
    const selectDistrict = (district: string) => {
      selectedDistrict.value = district;
    };

    const clearSearch = () => {
      searchQuery.value = '';
    };
    
    return {
      provinces,
      selectedProvince,
      availableDistricts,
      selectedDistrict,
      filteredInstructors,
      searchQuery,
      selectProvince,
      selectDistrict,
      clearSearch
    };
  },
  
  head() {
    return {
      title: 'Diskusi Penyuluh - JuruTani',
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Diskusikan masalah pertanian Anda dengan penyuluh berpengalaman'
        }
      ]
    }
  }
})
</script>

<template>
  <div class="instructor-discussions">
    <div class="container mx-auto py-10 px-4">
      <div class="flex items-center mb-8">
        <NuxtLink to="/discussions" class="mr-4 text-green-600 hover:text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-green-700">Diskusi Penyuluh</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-lg text-gray-700 mb-6">
          Diskusikan permasalahan pertanian Anda dengan penyuluh berpengalaman dan dapatkan saran profesional untuk meningkatkan hasil panen Anda.
        </p>
        
        <!-- Search input -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Cari Penyuluh</h2>
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari nama penyuluh..."
              class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
            <button 
              v-if="searchQuery" 
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="clearSearch"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Responsif layout: Kiri-kanan pada layar besar, dan vertikal pada mobile -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 class="text-xl font-semibold mb-4">Pilih Provinsi</h2>
            <UInputMenu
              v-model="selectedProvince"
              :options="provinces"
              placeholder="Pilih provinsi"
              class="w-full"
            />
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Pilih Kabupaten/Kota</h2>
            <UInputMenu
              v-model="selectedDistrict"
              :options="availableDistricts"
              placeholder="Pilih kabupaten/kota"
              class="w-full"
            />
          </div>
        </div>

        <!-- Penyuluh based on selected location and search -->
        <div>
          <h2 class="text-xl font-semibold mb-4">
            Penyuluh di {{ selectedDistrict }}, {{ selectedProvince }}
            <span v-if="searchQuery" class="text-green-600"> - "{{ searchQuery }}"</span>
          </h2>
          <div v-if="filteredInstructors.length > 0" class="space-y-4">
            <div 
              v-for="instructor in filteredInstructors" 
              :key="instructor.id"
              class="flex items-start p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <img :src="instructor.image" :alt="instructor.name" class="w-16 h-16 rounded-full mr-4" >
              <div>
                <h3 class="font-medium text-gray-900">{{ instructor.name }}</h3>
                <p class="text-sm text-gray-600">{{ instructor.province }}, {{ instructor.district }}</p>
                <p class="text-sm text-gray-500 mt-1 mb-3">
                  {{ instructor.note }}
                </p>
                <button class="text-sm py-1.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                  Mulai Diskusi
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <p v-if="searchQuery">
              Tidak ada penyuluh dengan nama "{{ searchQuery }}" di lokasi ini.
            </p>
            <p v-else>
              Tidak ada penyuluh tersedia untuk lokasi ini saat ini.
            </p>
          </div>
        </div>       
      </div>
    </div>
  </div>
</template>

<style scoped>
.instructor-discussions {
  min-height: 100vh;
  background-color: #f0fdf4;
}
</style>