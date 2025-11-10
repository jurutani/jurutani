const pg_colors = {
  primary: {
    DEFAULT: '#2E7D32',
    50: '#f4eceb',
    100: '#eecec3',
    200: '#e5b09c',
    300: '#da9276',
    400: '#cc7552',
    500: '#bc572e',
    600: '#aa3805',
    700: '#9c3305',
    800: '#8d2f06',
    900: '#7f2a05',
    950: '#722605'
  },
}

export default {
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      colors: {
        ...pg_colors,
        pp: pg_colors.primary,
      },
    },
  },
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './nuxt.config.{js,ts}'
  ],
}
