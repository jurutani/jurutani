<script lang="ts" setup>
import { ref } from 'vue';

// Reactive variable for email input
const email = ref('');

// Function to handle form submission
const submitForm = () => {
  // Simulating form submission for forgot password
  console.log('Forgot Password request submitted for:', email.value);

  // TODO: Implement API call to send reset password email.
  alert(`Instruksi reset kata sandi telah dikirim ke email: ${email.value}`);
};
</script>
<template>
    <div class="max-w-md mx-auto p-4">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-semibold text-green-700">Lupa Kata Sandi</h1>
        <p class="text-gray-600">Masukkan email Anda untuk menerima instruksi reset kata sandi.</p>
      </div>
  
      <form class="space-y-4" @submit.prevent="submitForm">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-lg text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Masukkan email Anda"
            required
          >
        </div>
  
        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            class="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Kirim Instruksi Reset
          </button>
        </div>
      </form>
  
      <!-- Link to Login -->
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Sudah ingat kata sandi? 
          <NuxtLink to="/auth/login" class="text-green-500 hover:underline">Masuk di sini</NuxtLink>
        </p>
      </div>
    </div>
  </template>
  
 
  
  <style scoped>
  /* Styling if necessary */
  </style>
  