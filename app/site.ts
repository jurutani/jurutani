// @unocss-include

export default {
  title: 'Juru Tani Reborn | Solusi Penyuluhan Pertanian Modern',
  description: 'Juru Tani Reborn merupakan inovasi terbaru dari Jurutani yang digagas oleh Politeknik Pembangunan Pertanian Yogyakarta Magelang, bertujuan membantu petani setempat dan mendukung pertanian Indonesia.',
  author: 'Politeknik Pembangunan Pertanian Yogyakarta Magelang',
  url: 'https://jurutani.com',
  github: 'https://github.com/jurutani',
  ogImageUrl: 'https://jurutani.com/jurutani.png',
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
