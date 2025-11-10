// @unocss-include

export default {
  title: 'Juru Tani',
  description: 'Juru Tani merupakan inovasi terbaru yang digagas oleh Politeknik Pembangunan Pertanian Yogyakarta Magelang, bertujuan membantu petani setempat dan mendukung pertanian Indonesia.',
  author: 'Politeknik Pembangunan Pertanian Yogyakarta Magelang',
  publisher: 'Politeknik Pembangunan Pertanian Yogyakarta Magelang',
  publisherShort: 'Polbangtan Yogyakarta Magelang',
  organization: {
    name: 'Politeknik Pembangunan Pertanian Yogyakarta Magelang',
    shortName: 'Polbangtan',
    url: 'https://jurutani.com',
    logo: 'https://jurutani.com/logo/jurutani.png',
    image: 'https://jurutani.com/logo/og-image.jpg',
    description: 'Platform digital untuk inovasi pertanian dan penyuluhan petani Indonesia',
    address: 'Yogyakarta Magelang, Indonesia',
    email: 'si.jurutani@gmail.com',
    phone: '62 856-6900-0010',
    areaServed: 'Indonesia',
    foundingDate: '2024',
    sameAs: [
      'https://github.com/jurutani',
      'https://twitter.com/jurutani',
    ],
  },
  url: 'https://jurutani.com',
  github: 'https://github.com/jurutani',
  ogImageUrl: '/og-image.jpg',
  generator: 'Nuxt 3, Vercel, TailwindCSS',
  defaultLocale: 'id',
  identity: {
    type: 'website',
  } as any,
  twitter: '@jurutani',
  trailingSlash: false,
  titleSeparator: '|',

  navs: {
    primary: [
      { title: 'Beranda', to: '/', icon: 'i-lucide-home' },
      { title: 'Layanan', to: '/discussions', icon: 'i-lucide-headset' }, // ikon layanan / kolaborasi
      { title: 'Berita', to: '/news', icon: 'i-lucide-newspaper' },
      { title: 'Marketplace', to: '/markets', icon: 'i-lucide-shopping-bag' },
      { title: 'Edukasi', to: '/educations', icon: 'i-lucide-graduation-cap' },
      { title: 'Course', to: '/courses', icon: 'i-lucide-book-open' },
      { title: 'Alat', to: '/tools', icon: 'i-lucide-wrench' },
    ],
    secondary: [
      { title: 'Profil', to: '/profile', icon: 'i-lucide-user' },
      { title: 'Keamanan', to: '/security', icon: 'i-lucide-lock' },
      { title: 'Pengaturan', to: '/setting', icon: 'i-lucide-settings' },
      { title: 'Riwayat', to: '/history', icon: 'i-lucide-history' },
      { title: 'Kontak', to: '/contact-us', icon: 'i-lucide-phone' },
      { title: 'Bantuan', to: '/help-faqs', icon: 'i-lucide-help-circle' },
    ],
  },
}
