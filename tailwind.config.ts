
export default {
  darkMode: 'class',
  plugins: [],

  content: {
    files: [
      // App directory - comprehensive coverage
      './app/**/*.{vue,js,ts,jsx,tsx,mjs,cjs}',
      './app.vue',
      './error.vue',

      // Config files
      './nuxt.config.{js,ts,mjs}',
      './app.config.{js,ts}',
      './tailwind.config.{js,ts}',

      // Root level directories (fallback jika ada)
      './components/**/*.{vue,js,ts,jsx,tsx}',
      './layouts/**/*.{vue,js,ts}',
      './pages/**/*.{vue,js,ts}',
      './plugins/**/*.{js,ts,mjs}',
      './composables/**/*.{js,ts}',
      './utils/**/*.{js,ts}',
      './data/**/*.{js,ts,json}',

      // Site metadata
      './site.{js,ts,json}',
    ],
  },
}
