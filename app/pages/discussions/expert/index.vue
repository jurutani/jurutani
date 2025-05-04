<script lang="ts">
import { defineComponent, ref } from 'vue'

interface Expert {
  id: number;
  name: string;
  specialization: string;
  category: string;
  image: string;
}

export default defineComponent({
  name: 'ExpertDiscussions',
  
  setup() {
    const selectedCategory = ref<string>('Budidaya');
    
    const categories = [
      'Budidaya',
      'Pasca Panen',
      'Pemasaran',
      'Agroteknologi',
      'Peternakan'
    ];
    
    const experts: Expert[] = [
      {
        id: 1,
        name: 'Ir. Bambang Suryanto',
        specialization: 'Spesialis Tanaman Pangan',
        category: 'Budidaya',
        image: '/placeholder.png'
      },
      {
        id: 2,
        name: 'Dr. Siti Nurhasanah',
        specialization: 'Ahli Pengolahan Hasil Pertanian',
        category: 'Pasca Panen',
        image: '/placeholder.png'
      },
      {
        id: 3,
        name: 'Muh. Rizki Pratama, M.Sc',
        specialization: 'Konsultan Pemasaran Produk Pertanian',
        category: 'Pemasaran',
        image: '/placeholder.png'
      },
      {
        id: 4,
        name: 'Prof. Dr. Widodo Haryanto',
        specialization: 'Pakar Teknologi Pertanian',
        category: 'Agroteknologi',
        image: '/placeholder.png'
      },
      {
        id: 5,
        name: 'Drh. Sinta Wijaya',
        specialization: 'Spesialis Kesehatan Hewan',
        category: 'Peternakan',
        image: '/placeholder.png'
      }
    ];
    
    const filteredExperts = ref(experts.filter(expert => expert.category === selectedCategory.value));
    
    const selectCategory = (category: string) => {
      selectedCategory.value = category;
      filteredExperts.value = experts.filter(expert => expert.category === category);
    };
    
    return {
      categories,
      selectedCategory,
      filteredExperts,
      selectCategory
    };
  },
  
  head() {
    return {
      title: 'Diskusi Pakar - JuruTani',
      meta: [
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Diskusikan masalah pertanian Anda dengan Pakar berpengalaman'
        }
      ]
    }
  }
})
</script>

<template>
  <div class="expert-discussions">
    <div class="container mx-auto py-10 px-4">
      <div class="flex items-center mb-8">
        <NuxtLink to="/discussions" class="mr-4 text-green-600 hover:text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold text-green-700">Diskusi Pakar</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-lg text-gray-700 mb-6">
          Diskusikan permasalahan pertanian Anda dengan Pakar berpengalaman dan dapatkan saran profesional untuk meningkatkan hasil panen Anda.
        </p>
        
        <!-- Category selection -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Pilih Kategori</h2>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button 
              v-for="category in categories" 
              :key="category"
              :class="[
                'py-3 px-4 rounded-md transition-all text-center',
                selectedCategory === category 
                  ? 'bg-green-600 text-white font-medium shadow-md' 
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              ]"
              @click="selectCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>
        
        <!-- Pakar based on selected category -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Pakar {{ selectedCategory }}</h2>
          <div v-if="filteredExperts.length > 0" class="space-y-4">
            <div 
              v-for="expert in filteredExperts" 
              :key="expert.id"
              class="flex items-start p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <img :src="expert.image" :alt="expert.name" class="w-16 h-16 rounded-full mr-4" >
              <div>
                <h3 class="font-medium text-gray-900">{{ expert.name }}</h3>
                <p class="text-sm text-gray-600">{{ expert.specialization }}</p>
                <p class="text-sm text-gray-500 mt-1 mb-3">
                  Ahli dalam bidang {{ expert.category.toLowerCase() }} yang telah berpengalaman lebih dari 10 tahun membantu petani menyelesaikan masalah pertanian.
                </p>
                <button class="text-sm py-1.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                  Mulai Diskusi
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            Tidak ada Pakar tersedia untuk kategori ini saat ini.
          </div>
        </div>

        <!-- Popular topics -->
        <div class="mt-8 pt-6 border-t">
          <h2 class="text-xl font-semibold mb-4">Topik Diskusi Populer - {{ selectedCategory }}</h2>
          <ul class="space-y-3">
            <li class="flex items-center">
              <div class="bg-green-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span v-if="selectedCategory === 'Budidaya'" class="text-gray-800">Teknik pengendalian hama pada tanaman padi organik</span>
              <span v-else-if="selectedCategory === 'Pasca Panen'" class="text-gray-800">Metode penyimpanan hasil panen agar tahan lama</span>
              <span v-else-if="selectedCategory === 'Pemasaran'" class="text-gray-800">Strategi pemasaran digital untuk produk pertanian</span>
              <span v-else-if="selectedCategory === 'Agroteknologi'" class="text-gray-800">Implementasi IoT untuk monitoring tanaman</span>
              <span v-else class="text-gray-800">Manajemen kesehatan ternak sapi perah</span>
            </li>
            <li class="flex items-center">
              <div class="bg-green-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span v-if="selectedCategory === 'Budidaya'" class="text-gray-800">Strategi irigasi hemat air untuk musim kemarau</span>
              <span v-else-if="selectedCategory === 'Pasca Panen'" class="text-gray-800">Teknologi pengeringan gabah yang efisien</span>
              <span v-else-if="selectedCategory === 'Pemasaran'" class="text-gray-800">Cara mendapatkan sertifikasi organik untuk produk pertanian</span>
              <span v-else-if="selectedCategory === 'Agroteknologi'" class="text-gray-800">Sistem hidroponik otomatis berbasis mikrokontroler</span>
              <span v-else class="text-gray-800">Formulasi pakan ternak berkualitas dengan bahan lokal</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expert-discussions {
  min-height: 100vh;
  background-color: #f0fdf4;
}
</style>