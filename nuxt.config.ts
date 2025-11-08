import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'pathe'
import { addComponent } from 'nuxt/kit'
import presetIcons from '@unocss/preset-icons'
import { bundledLanguages } from 'shiki'
import ogImage from 'nuxt-og-image'

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
  extends: [
    './app-nuxtui-layer',
  ],
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  future: {
    compatibilityVersion: 4,
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
        /^\/__og-image__\//,
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
    '@pinegrow/nuxt-module',
    '@unocss/nuxt',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    '@vee-validate/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/critters',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/ui',
    function () {
      addComponent({
        name: 'UIcon',
        filePath: '@/components/BaseIcon.vue',
        priority: 100,
      })
    },
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

  icon: {
    componentName: 'NuxtIcon',
    cdn: true,
    serverBundle: {
      collections: ['heroicons', 'ic', 'logos', 'ri', 'mdi', 'ph'],
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

  content: {
    sources: {
      content: {
        driver: 'fs',
        base: resolve(__dirname, 'app/content'),
      },
    },
    markdown: {
      anchorLinks: false,
      rehypePlugins: [
        [
          'rehype-external-links',
          {
            target: '_blank',
            rel: ['noopener'],
            test: (node: any) => /^https?:\/\//.test(node.properties.href),
          },
        ],
      ],
    },
    highlight: {
      //@ts-ignore
      langs: Object.keys(bundledLanguages),
      theme: 'dracula-soft',
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

  ogImage: {
    provider: 'satori',
    static: false,
    fonts: [
      {
        name: 'Inter',
        weight: 400,
        style: 'normal',
        src: 'https://rsms.me/inter/font-files/Inter-Regular.woff2',
      }
    ]
  },

  linkChecker: {
    enabled: false,
    excludeLinks: ['https://twitter.com/vuedesigner'],
    report: {
      html: true,
      markdown: true,
    },
  },

  unocss: {
    safelist: ['i-mdi-home', 'i-mdi-account', 'iconify'],
    presets: [
      presetIcons({
        prefix: 'i-',
      }),
    ],
  },

  eslint: {
  },

  pinegrow: {
    liveDesigner: {
      iconPreferredCase: 'unocss',
      tailwindcss: {
        configPath: 'tailwind.config.ts',
        cssPath: '@/assets/css/tailwind.css',
        restartOnThemeUpdate: true,
      },
    },
  },
  compatibilityDate: '2025-01-14',
})
