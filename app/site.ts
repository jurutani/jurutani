// since `.js, .ts` files are not included by default,
// the following comment tells UnoCSS to force scan this file (to pick the logo icon).
// @unocss-include

export default {
  title: 'JuruTani',
  description:
    'JuruTani adalah platform yang membantu petani dalam berkebun melalui fitur-fitur yang membantu petani dalam mengatur kebunnya seperti pengingat jadwal, log aktivitas, dan prediksi cuaca.',
  author: 'Pinegrow',
  url: 'https://pg-nuxtui.netlify.app',
  github: 'https://github.com/IlhamKurniawanBlora',
  ogImageUrl: 'jurutani.png', // absolute url (or) from public folder
  generator: 'https://jurutani.com',
  defaultLocale: 'en', // default
  identity: {
    type: 'StartUp',
  } as any,
  twitter: 'jurutani',
  trailingSlash: false, // default
  titleSeparator: '|', // default

  navs: {
    primary: [
      { title: 'Home', to: '/', icon: 'i-ic-baseline-home' },
      { title: 'Layanan', to: '/discussions', icon: 'i-ic-baseline-forum' },
      { title: 'Berita', to: '/news', icon: 'i-ic-baseline-newspaper' },
      { title: 'Marketplace', to: '/markets', icon: 'i-ic-baseline-storefront' },
      { title: 'Edukasi', to: '/educations', icon: 'i-ic-baseline-book' },
      { title: 'Course', to: '/courses', icon: 'i-ic-baseline-school' },
      { title: 'Alat', to: '/tools', icon: 'i-ic-baseline-construction' },
    ],
    secondary: [
      {
        title: 'Profil',
        to: '/profile',
        icon: 'i-ic-round-person', // lebih cocok untuk profil user
      },
      {
        title: 'Keamanan',
        to: '/security',
        icon: 'i-material-symbols-lock-outline', // icon kunci untuk security
      },
      {
        title: 'Pengaturan',
        to: '/setting',
        icon: 'i-material-symbols-settings-outline', // gear settings
      },
      {
        title: 'History',
        to: '/history',
        icon: 'i-ic-round-history', // ikon jam history
      },
      {
        title: 'Contact Us',
        to: '/contact-us',
        icon: 'i-material-symbols-call-outline', // telpon/contact
      },
      {
        title: 'Help & FAQs',
        to: '/help-faqs',
        icon: 'i-material-symbols-help-outline', // ikon tanda tanya untuk help
      },
    ],
   
  },
}
