// @unocss-include

export const navs = {
    primary: [
        { title: 'Beranda', to: '/', icon: 'lucide:home' },
        {
            title: 'Layanan',
            icon: 'lucide:headset',
            children: [
                { title: 'Diskusi', to: '/discussions', icon: 'lucide:messages-square' },
                { title: 'Marketplace', to: '/markets', icon: 'lucide:shopping-bag' }
            ]
        },
        { title: 'Berita', to: '/news', icon: 'lucide:newspaper' },
        {
            title: 'Edukasi',
            icon: 'lucide:graduation-cap',
            children: [
                { title: 'Materi', to: '/educations', icon: 'lucide:book' },
                { title: 'Course', to: '/courses', icon: 'lucide:book-open' },
                { title: 'Alat', to: '/tools', icon: 'lucide:wrench' }
            ]
        }
    ],
    secondary: [
        { title: 'Profil', to: '/profile', icon: 'lucide:user' },
        { title: 'Keamanan', to: '/security', icon: 'lucide:lock' },
        { title: 'Pengaturan', to: '/setting', icon: 'lucide:settings' },
        { title: 'Riwayat', to: '/history', icon: 'lucide:history' },
        { title: 'Kontak', to: '/contact-us', icon: 'lucide:phone' },
        { title: 'Bantuan', to: '/help-faqs', icon: 'lucide:help-circle' },
    ],
}

export const footerMenuLinks = [
    [
        { label: 'Beranda', path: '/' },
        { label: 'Tentang Kami', path: '/about-us' },
        { label: 'Berita', path: '/news' }
    ],
    [
        { label: 'Produk', path: '/markets' },
        { label: 'Komunitas', path: '/discussions/group' },
        { label: 'Kontak', path: '/contact-us' }
    ]
]

export const footerContactInfo = [
    {
        icon: 'mdi:map-marker',
        text: ['Jl. Kusumanegara No.2, Tahunan, Kec. Umbulharjo,', 'Kota Yogyakarta, Daerah Istimewa Yogyakarta 55161']
    },
    { icon: 'mdi:phone', text: '+62 856-6900-0010' },
    { icon: 'mdi:email', text: 'si.jurutani@gmail.com' },
    { icon: 'mdi:clock-outline', text: 'Senin - Jumat: 08.00 - 16.00 WIB' }
]

export const footerSocialMedia = [
    { name: 'WhatsApp', icon: 'mdi:whatsapp', url: 'https://api.whatsapp.com/send/?phone=625669000010', ariaLabel: 'WhatsApp' },
    { name: 'TikTok', icon: 'ic:baseline-tiktok', url: 'https://www.tiktok.com/@juru_tani', ariaLabel: 'TikTok' },
    { name: 'Email', icon: 'mdi:gmail', url: 'mailto:si.jurutani@gmail.com', ariaLabel: 'Email' },
    { name: 'Instagram', icon: 'mdi:instagram', url: 'https://www.instagram.com/jurutani_', ariaLabel: 'Instagram' },
    { name: 'YouTube', icon: 'mdi:youtube', url: 'https://www.youtube.com/@Juru_Tani', ariaLabel: 'YouTube' }
]

export const footerBottomLinks = [
    { label: 'Kebijakan Privasi', path: '/privacy-policy' },
    { label: 'Syarat & Ketentuan', path: '/terms' }
]
