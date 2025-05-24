<script setup>
  const props = defineProps({
    error: {
      type: Object,
      default(/*rawProps*/) {
        return {
          url: '-',
          statusCode: 404,
          statusMessage: 'Not Found',
          message: '(404 Not Found)',
          stack: '',
          data: '{"error":"FetchError:  (404 Not Found)"}',
        }
      },
    },
  })

  const message = computed(() => String(props.error?.message || ''))
  const is404 = computed(
    () => props.error?.statusCode === 404 || message.value?.includes('404'),
  )
  const isDev = import.meta.dev

</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 flex items-center justify-center px-4">
      <div class="max-w-2xl mx-auto text-center">
        <!-- Plant Icon/Illustration -->
        <div class="mb-8 relative">
          <div class="w-32 h-32 mx-auto mb-6 relative">
            <!-- Pot -->
            <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-800 rounded-b-2xl rounded-t-lg"/>
            <!-- Soil -->
            <div class="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-amber-900 dark:bg-amber-950 rounded-full"/>
            <!-- Main stem -->
            <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-gradient-to-t from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 rounded-full"/>
            <!-- Leaves -->
            <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <!-- Left leaf -->
              <div class="absolute -left-6 top-4 w-8 h-12 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full transform -rotate-45 origin-bottom"/>
              <!-- Right leaf -->
              <div class="absolute -right-6 top-4 w-8 h-12 bg-gradient-to-bl from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full transform rotate-45 origin-bottom"/>
              <!-- Center leaf -->
              <div class="absolute -left-2 top-0 w-8 h-14 bg-gradient-to-t from-green-500 to-green-400 dark:from-green-600 dark:to-green-500 rounded-full"/>
            </div>
            <!-- Decorative dots -->
            <div class="absolute top-8 left-8 w-2 h-2 bg-green-300 dark:bg-green-600 rounded-full animate-pulse"/>
            <div class="absolute top-4 right-6 w-1.5 h-1.5 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-pulse delay-300"/>
            <div class="absolute top-12 right-4 w-1 h-1 bg-teal-400 dark:bg-teal-500 rounded-full animate-pulse delay-700"/>
          </div>
          
          <!-- 404 Text with plant theme -->
          <div class="text-8xl md:text-9xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent leading-none">
            4🌱4
          </div>
        </div>

        <!-- Error Message -->
        <div class="mb-8 space-y-4">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
            {{ is404 ? 'Oops! This page got lost in the garden' : 'Something went wrong in our greenhouse' }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            {{ is404 
              ? 'The page you\'re looking for seems to have wandered off the beaten path. Let\'s help you find your way back to greener pastures!' 
              : 'Don\'t worry, even the best gardeners encounter unexpected challenges. Let\'s get you back on track.'
            }}
          </p>
        </div>

        <!-- Development Error Details -->
        <div v-if="isDev" class="mb-8 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-200 dark:border-green-700">
          <details class="text-left">
            <summary class="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              🔧 Development Details
            </summary>
            <pre class="mt-3 text-xs text-gray-600 dark:text-gray-400 overflow-auto bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">{{ error }}</pre>
          </details>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink
            class="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300" to='/'
          >
            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Garden Home
          </NuxtLink>
          
          <button
            class="inline-flex items-center gap-2 px-6 py-3 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-300"
            @click="$router.go(-1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Previous Page
          </button>
        </div>

        <!-- Decorative Elements -->
        <div class="mt-12 flex justify-center gap-4 opacity-60">
          <div class="text-2xl animate-bounce delay-100">🌿</div>
          <div class="text-2xl animate-bounce delay-300">🌱</div>
          <div class="text-2xl animate-bounce delay-500">🍃</div>
          <div class="text-2xl animate-bounce delay-700">🌳</div>
        </div>
      </div>

      <!-- Background decorative elements -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-4 h-4 bg-green-300/30 dark:bg-green-600/30 rounded-full animate-float"/>
        <div class="absolute top-40 right-20 w-6 h-6 bg-emerald-300/20 dark:bg-emerald-600/20 rounded-full animate-float delay-1000"/>
        <div class="absolute bottom-40 left-20 w-3 h-3 bg-teal-300/40 dark:bg-teal-600/40 rounded-full animate-float delay-2000"/>
        <div class="absolute bottom-60 right-10 w-5 h-5 bg-green-400/25 dark:bg-green-500/25 rounded-full animate-float delay-1500"/>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>