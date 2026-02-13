// https://nuxt.com/docs/api/configuration/nuxt-config
import siteMeta from './app/site'
const {
  title,
  description,
  url,
  defaultLocale,
  identity,
  twitter,
  trailingSlash,
  titleSeparator,
} = siteMeta

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL ?? 'https://jurutani.com',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  app: {
    baseURL: '/',
    head: {
      titleTemplate: `%s ${titleSeparator} ${title}`,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      meta: [
        { name: 'description', content: description },
      ],
    },
  },

  nitro: {
    preset: 'netlify-static',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about-us',
        '/contact-us',
        '/news',
        '/tools',
        '/videos',
        '/courses',
        '/help-faqs',
        '/privacy-policy',
        '/food-prices',
        '/markets',
        '/educations',
        '/terms',
      ],
      ignore: [
        '/room-chat',
      ]
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-og-image',
    'nuxt-schema-org',
    '@nuxt/eslint',
    '@nuxt/ui',
  ],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  css: [
    '@/assets/css/tailwind.css',
  ],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  image: {
    format: ['webp', 'png', 'jpg'],
    provider: 'none',
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 80,
          height: 80,
        },
      },
    },

    domains: [
      'images.unsplash.com',
      'fakestoreapi.com',
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'gravatar.com',
    ],

    alias: {
      unsplash: 'https://images.unsplash.com',
    },
  },

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  imports: {
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'supabase': ['@supabase/supabase-js'],
          },
        },
      },
    },
  },

  sourcemap: {
    client: false,
    server: false,
  },

  routeRules: {
    '/hidden': { robots: false },
  },

  site: {
    url,
    name: title,
    description,
    defaultLocale,
    identity,
    twitter,
    trailingSlash,
    titleSeparator,
  },

  robots: {
    blockNonSeoBots: true,
  },

  sitemap: {
    xsl: false,
    strictNuxtContentPaths: true,
  },

  eslint: {
  },

  compatibilityDate: '2026-01-14',

  devtools: {
    enabled: true,
  },
})
