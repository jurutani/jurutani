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
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  experimental: {
    componentIslands: true,
  },

  nitro: {
    preset: 'netlify-static',
    prerender: {
      crawlLinks: true,
      ignore: [
        '/room-chat',
        '/markets',
      ]
    }
  },

  app: {
    baseURL: '/',
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-og-image',
    'nuxt-schema-org',
    '@nuxtjs/critters',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/ui',
  ],

  colorMode: {
    preference: 'light',
  },

  ui: {
  },

  critters: {
    config: {
      preload: 'swap',
    },
  },

  css: [
    '@/assets/css/tailwind.css',
  ],

  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  image: {
    format: ['webp, png, jpg'],
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

  pinia: {
  },

  imports: {
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
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '12.5%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      {
        label: 'Change Frequency',
        select: 'sitemap:changefreq',
        width: '12.5%',
      },
      { label: 'Hreflangs', select: 'count(xhtml:link)', width: '12.5%' },
    ],
    strictNuxtContentPaths: true,
  },

  linkChecker: {
    enabled: false,
    excludeLinks: ['https://twitter.com/vuedesigner'],
    report: {
      html: true,
      markdown: true,
    },
  },

  eslint: {
  },

  compatibilityDate: '2025-01-14',

  devtools: {
    enabled: true,
  },
})
