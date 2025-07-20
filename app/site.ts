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
      { title: 'Beranda', to: '/', icon: 'i-ic-baseline-home' },
      { title: 'Layanan', to: '/discussions', icon: 'i-ic-baseline-forum' },
      { title: 'Berita', to: '/news', icon: 'i-ic-baseline-newspaper' },
      { title: 'Marketplace', to: '/markets', icon: 'i-ic-baseline-storefront' },
      { title: 'Edukasi', to: '/educations', icon: 'i-ic-baseline-book' },
      { title: 'Course', to: '/courses', icon: 'i-ic-baseline-school' },
      { title: 'Alat', to: '/tools', icon: 'i-ic-baseline-construction' },
    ],
    secondary: [
      { title: 'Profil', to: '/profile', icon: 'i-ic-round-person' },
      { title: 'Keamanan', to: '/security', icon: 'i-material-symbols-lock-outline' },
      { title: 'Pengaturan', to: '/setting', icon: 'i-material-symbols-settings-outline' },
      { title: 'Riwayat', to: '/history', icon: 'i-ic-round-history' },
      { title: 'Kontak', to: '/contact-us', icon: 'i-material-symbols-call-outline' },
      { title: 'Bantuan', to: '/help-faqs', icon: 'i-material-symbols-help-outline' },
    ],
  },
}
