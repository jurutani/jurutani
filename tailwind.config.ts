import {
  pg_colors,
  pg_fonts,
  pg_backgrounds,
} from './themes/pg-tailwindcss/tokens.cjs'

import { getFontsWithFallback } from './app/utils/font'
import { safelist } from './app/utils/colors'

import tailwindTypography from '@tailwindcss/typography'
import tailwindForms from '@tailwindcss/forms'
import tailwindCssPluginPinegrow from '@pinegrow/tailwindcss-plugin'

export default {
  darkMode: 'class',
  plugins: [
    tailwindTypography,
    tailwindForms,
    tailwindCssPluginPinegrow({
      // colors: { ...pg_colors, pp: pg_colors.primary }, // pp, primary, secondary etc
      fonts: getFontsWithFallback(pg_fonts),
      backgrounds: pg_backgrounds, // bg-design-image, bg-design-image-large
    }),
  ],

 theme: {
    extend: {
      colors: {
        primary: '#16a34a',     // hijau utama (green-600)
        secondary: '#65a30d',   // hijau keemasan (lime-600)
        accent: '#4ade80',      // hijau terang (green-400)
        neutral: '#f3f4f6',     // abu muda
        base: '#ffffff',        // putih dasar
        info: '#22d3ee',        // biru muda
        success: '#16a34a',     // sama dengan primary
        warning: '#facc15',     // kuning terang
        error: '#dc2626',       // merah
      },
    },
  },


  get content() {
    const _content = [
      '{.,app,*-layer}/components/**/*.{js,vue,ts}',
      '{.,app,*-layer}/layouts/**/*.vue',
      '{.,app,*-layer}/pages/**/*.vue',
      '{.,app,*-layer}/plugins/**/*.{js,ts}',
      '{.,app,*-layer}/app.vue',
      '{.,app,*-layer}/*.{mjs,js,ts}',
      '{.,*-layer}/nuxt.config.{js,ts}',
    ]
    return process.env.NODE_ENV === 'production'
      ? _content
      : [..._content, './_pginfo/**/*.{html,js}'] // used by Vue Desginer for live-designing during development
  },
}
