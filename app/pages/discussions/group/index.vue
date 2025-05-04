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
            Diskusikan masalah pertanian Anda dengan Komunitas Juru Tani
          </p>
          
          <!-- Placeholder content for discussions with instructors -->
          <ComingSoon />
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  
  export default defineComponent({
    name: 'InstructorDiscussions',
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
  
  <style scoped>
  .instructor-discussions {
    min-height: 100vh;
    background-color: #f0fdf4;
  }
  </style>