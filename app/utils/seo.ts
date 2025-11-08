/**
 * SEO Utility Functions untuk Juru Tani
 * Membantu optimasi meta tags, canonical URL, dan OG images di semua halaman
 */

import siteMeta from '@/site'

export type OgType = 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_status' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other'
export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

export interface SEOMetaOptions {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
    ogUrl?: string
    ogType?: OgType
    canonicalUrl?: string
    author?: string
    robots?: string
    locale?: string
}

/**
 * Generate SEO meta tags dengan default dari siteMeta
 */
export const generateSeoMeta = (options: SEOMetaOptions) => {
    const {
        title: pageTitle,
        description: pageDescription,
        keywords: pageKeywords,
        ogImage,
        ogUrl,
        ogType = 'website',
        canonicalUrl,
        author = siteMeta.author,
        robots = 'index, follow',
        locale = 'id_ID',
    } = options

    const { titleSeparator, title: siteTitle, description: siteDescription } = siteMeta

    // Generate full title
    const fullTitle = pageTitle
        ? `${pageTitle} ${titleSeparator} ${siteTitle}`
        : siteTitle

    // Generate description
    const fullDescription = pageDescription || siteDescription

    // Generate keywords
    const defaultKeywords = ['juru tani', 'pertanian', 'penyuluhan', 'digital', 'petani indonesia', 'teknologi pertanian']
    const combinedKeywords = pageKeywords
        ? [...pageKeywords, ...defaultKeywords]
        : defaultKeywords

    // Generate OG Image
    const finalOgImage = ogImage || siteMeta.ogImageUrl

    // Generate OG URL
    const route = useRoute()
    const finalOgUrl = ogUrl || `${siteMeta.url}${route.path}`

    // Generate Canonical URL
    const finalCanonicalUrl = canonicalUrl || finalOgUrl

    return {
        title: fullTitle,
        description: fullDescription,
        keywords: combinedKeywords.join(', '),
        author,
        robots,
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1',
        ogTitle: fullTitle,
        ogDescription: fullDescription,
        ogImage: finalOgImage,
        ogUrl: finalOgUrl,
        ogType: ogType as OgType,
        ogLocale: locale,
        ogSiteName: siteTitle,
        twitterCard: 'summary_large_image' as TwitterCardType,
        twitterSite: siteMeta.twitter,
        twitterCreator: siteMeta.twitter,
        twitterTitle: fullTitle,
        twitterDescription: fullDescription,
        twitterImage: finalOgImage,
        twitterImageAlt: fullTitle,
        canonicalUrl: finalCanonicalUrl,
    }
}

/**
 * Generate SEO meta dengan keyword yang sudah dioptimasi per halaman
 * Membuat struktur yang konsisten dan SEO-friendly
 */
export const getPageSeoMeta = (pageType: 'home' | 'news' | 'courses' | 'discussions' | 'educations' | 'markets' | 'tools' | 'about' | 'contact' | 'help' | 'terms' | 'privacy' | 'security' | 'profile' | 'history' | 'setting') => {
    const pageMetaConfig: Record<string, SEOMetaOptions> = {
        home: {
            title: 'Juru Tani Reborn | Solusi Pertanian Modern & Digital',
            description: 'Platform inovatif dari Politeknik Pembangunan Pertanian Yogyakarta Magelang yang mendukung petani lokal dengan teknologi digital untuk pertanian berkelanjutan di Indonesia.',
            keywords: ['juru tani', 'pertanian digital', 'inovasi pertanian', 'polbangtan yogyakarta', 'petani indonesia', 'teknologi pertanian', 'penyuluhan digital'],
            ogType: 'website',
        },
        news: {
            title: 'Berita Terbaru',
            description: 'Baca berita pertanian terkini dari Juru Tani. Inovasi, kegiatan petani, dan informasi dari Politeknik Pembangunan Pertanian (Polbangtan) Yogyakarta Magelang.',
            keywords: ['berita pertanian', 'berita tani', 'inovasi pertanian terbaru', 'kabar tani', 'berita agribisnis'],
            ogType: 'website',
        },
        courses: {
            title: 'Kursus dan Pelatihan',
            description: 'Temukan kursus dan pelatihan terbaru untuk meningkatkan keterampilan pertanian Anda. Belajar dari para ahli dan praktisi pertanian bersama Juru Tani.',
            keywords: ['kursus pertanian', 'pelatihan pertanian', 'belajar pertanian', 'course pertanian', 'edukasi petani', 'pelatihan digital'],
            ogType: 'website',
        },
        discussions: {
            title: 'Forum Diskusi',
            description: 'Bergabung dengan komunitas petani di forum diskusi Juru Tani. Tanya jawab, berbagi pengalaman, dan dapatkan solusi untuk tantangan pertanian Anda.',
            keywords: ['forum diskusi pertanian', 'diskusi tani', 'komunitas petani', 'tanya jawab pertanian', 'forum petani', 'forum agribisnis'],
            ogType: 'website',
        },
        educations: {
            title: 'Edukasi dan Artikel',
            description: 'Kumpulan materi edukasi dan panduan pertanian praktis dari Juru Tani. Temukan artikel, tutorial, dan tips terbaru untuk membantu kegiatan pertanian Anda.',
            keywords: ['edukasi pertanian', 'artikel pertanian', 'panduan pertanian', 'tutorial pertanian', 'tips bertani', 'materi edukasi pertanian'],
            ogType: 'website',
        },
        markets: {
            title: 'Pasar Tani',
            description: 'Platform marketplace pertanian Juru Tani untuk jual beli produk pertanian secara langsung. Temukan supplier pupuk, bibit, dan produk pertanian lainnya.',
            keywords: ['pasar tani', 'marketplace pertanian', 'jual beli pertanian', 'toko online pertanian', 'supplier pertanian', 'produk pertanian'],
            ogType: 'website',
        },
        tools: {
            title: 'Alat Pertanian',
            description: 'Temukan rekomendasi alat pertanian, cara pemakaian, dan tips perawatan untuk petani modern. Gunakan kalkulator dan tools berguna untuk pertanian Anda.',
            keywords: ['alat pertanian', 'tools pertanian', 'kalkulator pertanian', 'alat bantu tani', 'peralatan pertanian', 'aplikasi pertanian'],
            ogType: 'website',
        },
        about: {
            title: 'Tentang Kami',
            description: 'Mengenal Juru Tani Reborn, inovasi digital dari Politeknik Pembangunan Pertanian Yogyakarta Magelang untuk memajukan pertanian Indonesia menuju era digital.',
            keywords: ['tentang juru tani', 'visi misi juru tani', 'polbangtan yogyakarta', 'polbangtan magelang', 'tentang pertanian digital'],
            ogType: 'website',
        },
        contact: {
            title: 'Hubungi Kami',
            description: 'Hubungi tim Juru Tani untuk informasi lebih lanjut atau pertanyaan seputar platform pertanian digital kami. Kami siap membantu komunitas pertanian Indonesia.',
            keywords: ['hubungi juru tani', 'kontak juru tani', 'layanan pelanggan', 'customer service', 'dukungan juru tani'],
            ogType: 'website',
        },
        help: {
            title: 'Bantuan dan FAQ',
            description: 'Temukan jawaban atas pertanyaan umum tentang Juru Tani. Panduan lengkap dan bantuan teknis untuk menggunakan platform dengan optimal.',
            keywords: ['faq juru tani', 'bantuan juru tani', 'pertanyaan umum', 'cara menggunakan', 'panduan pengguna', 'tips juru tani'],
            ogType: 'website',
        },
        terms: {
            title: 'Syarat dan Ketentuan',
            description: 'Baca syarat dan ketentuan penggunaan platform Juru Tani. Perjanjian pengguna dan kebijakan layanan untuk semua pengguna.',
            keywords: ['syarat ketentuan', 'terms of service', 'kebijakan juru tani', 'perjanjian pengguna'],
            ogType: 'website',
        },
        privacy: {
            title: 'Kebijakan Privasi',
            description: 'Pelajari bagaimana Juru Tani melindungi data pribadi Anda. Kebijakan privasi lengkap dan komitmen kami terhadap keamanan data pengguna.',
            keywords: ['kebijakan privasi', 'privacy policy', 'keamanan data', 'perlindungan data pribadi'],
            ogType: 'website',
        },
        security: {
            title: 'Keamanan Akun',
            description: 'Kelola keamanan akun Juru Tani Anda dengan mudah. Fitur keamanan lengkap untuk melindungi data pribadi dan transaksi Anda.',
            keywords: ['keamanan akun', 'keamanan data', 'proteksi akun', 'keamanan login', 'verifikasi identitas'],
            ogType: 'website',
        },
        profile: {
            title: 'Profil Saya',
            description: 'Kelola profil pribadi Anda di Juru Tani. Edit informasi, preferensi, dan pengaturan akun dengan mudah.',
            keywords: ['profil pengguna', 'akun saya', 'pengaturan profil', 'data pribadi'],
            ogType: 'website',
            robots: 'noindex, follow', // Private page
        },
        history: {
            title: 'Riwayat Aktivitas',
            description: 'Lihat riwayat lengkap aktivitas Anda di Juru Tani. Pantau transaksi, diskusi, dan interaksi Anda di platform.',
            keywords: ['riwayat aktivitas', 'riwayat transaksi', 'history', 'log aktivitas'],
            ogType: 'website',
            robots: 'noindex, follow', // Private page
        },
        setting: {
            title: 'Pengaturan',
            description: 'Atur preferensi dan pengaturan akun Anda di Juru Tani. Kustomisasi pengalaman pengguna sesuai kebutuhan.',
            keywords: ['pengaturan akun', 'preferences', 'settings', 'konfigurasi'],
            ogType: 'website',
            robots: 'noindex, follow', // Private page
        },
    }

    return generateSeoMeta(pageMetaConfig[pageType] || pageMetaConfig.home)
}

/**
 * Generate canonical URL untuk halaman spesifik
 */
export const getCanonicalUrl = (path: string) => {
    return new URL(path, siteMeta.url).href
}

/**
 * Generate OG image URL dengan fallback
 */
export const getOgImageUrl = (customImage?: string) => {
    return customImage || siteMeta.ogImageUrl
}

/**
 * Hook untuk mengoptimalkan SEO meta di halaman
 * Usage: const seoMeta = useSeoOptimized('news')
 */
export const useSeoOptimized = (pageType: 'home' | 'news' | 'courses' | 'discussions' | 'educations' | 'markets' | 'tools' | 'about' | 'contact' | 'help' | 'terms' | 'privacy' | 'security' | 'profile' | 'history' | 'setting') => {
    const seoMeta = getPageSeoMeta(pageType)

    // Auto-apply useSeoMeta
    useSeoMeta({
        title: seoMeta.title,
        description: seoMeta.description,
        keywords: seoMeta.keywords,
        author: seoMeta.author,
        robots: seoMeta.robots,
        ogTitle: seoMeta.ogTitle,
        ogDescription: seoMeta.ogDescription,
        ogImage: seoMeta.ogImage,
        ogUrl: seoMeta.ogUrl,
        ogType: seoMeta.ogType as OgType,
        ogLocale: seoMeta.ogLocale,
        ogSiteName: seoMeta.ogSiteName,
        twitterCard: 'summary_large_image' as TwitterCardType,
        twitterSite: seoMeta.twitterSite,
        twitterCreator: seoMeta.twitterCreator,
        twitterTitle: seoMeta.twitterTitle,
        twitterDescription: seoMeta.twitterDescription,
        twitterImage: seoMeta.twitterImage,
        twitterImageAlt: seoMeta.twitterImageAlt,
    })

    return seoMeta
}

/**
 * Gunakan untuk halaman detail/dinamis (news, courses, dll)
 * Membuat SEO meta yang lebih spesifik dengan title dan description custom
 */
export const useSeoDetail = (options: {
    title: string
    description: string
    keywords?: string[]
    image?: string
    url?: string
    type?: OgType
}) => {
    const {
        title: pageTitle,
        description: pageDescription,
        keywords: pageKeywords,
        image,
        url,
        type = 'article',
    } = options

    const { titleSeparator, title: siteTitle } = siteMeta

    // Generate full title
    const fullTitle = `${pageTitle} ${titleSeparator} ${siteTitle}`

    // Generate description
    const fullDescription = pageDescription || siteMeta.description

    // Generate keywords
    const defaultKeywords = ['juru tani', 'pertanian', 'penyuluhan', 'digital', 'petani indonesia']
    const combinedKeywords = pageKeywords
        ? [...pageKeywords, ...defaultKeywords]
        : defaultKeywords

    // Generate OG Image
    const finalOgImage = image || siteMeta.ogImageUrl

    // Generate OG URL
    const route = useRoute()
    const finalOgUrl = url || `${siteMeta.url}${route.path}`

    useSeoMeta({
        title: fullTitle,
        description: fullDescription,
        keywords: combinedKeywords.join(', '),
        author: siteMeta.author,
        robots: 'index, follow',
        ogTitle: fullTitle,
        ogDescription: fullDescription,
        ogImage: finalOgImage,
        ogUrl: finalOgUrl,
        ogType: type as OgType,
        ogLocale: 'id_ID',
        ogSiteName: siteTitle,
        twitterCard: 'summary_large_image' as TwitterCardType,
        twitterSite: siteMeta.twitter,
        twitterCreator: siteMeta.twitter,
        twitterTitle: fullTitle,
        twitterDescription: fullDescription,
        twitterImage: finalOgImage,
        twitterImageAlt: fullTitle,
    })

    return {
        title: fullTitle,
        description: fullDescription,
        keywords: combinedKeywords.join(', '),
    }
}

/**
 * Get SEO untuk halaman autentikasi
 */
export const getAuthPageSeoMeta = (pageType: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'confirm-email' | 'callback') => {
    const pageMetaConfig: Record<string, SEOMetaOptions> = {
        login: {
            title: 'Masuk',
            description: 'Masuk ke akun Juru Tani Anda untuk mengakses semua fitur pertanian digital yang kami sediakan.',
            keywords: ['login juru tani', 'masuk akun', 'autentikasi'],
            robots: 'noindex, follow',
        },
        register: {
            title: 'Daftar',
            description: 'Daftar akun baru di Juru Tani dan mulai bergabung dengan komunitas petani modern di Indonesia.',
            keywords: ['daftar juru tani', 'registrasi', 'buat akun'],
            robots: 'noindex, follow',
        },
        'forgot-password': {
            title: 'Lupa Kata Sandi',
            description: 'Pulihkan akses akun Juru Tani Anda dengan mereset kata sandi dengan mudah dan aman.',
            keywords: ['lupa password', 'reset password', 'recover account'],
            robots: 'noindex, follow',
        },
        'reset-password': {
            title: 'Atur Ulang Kata Sandi',
            description: 'Atur ulang kata sandi Juru Tani Anda untuk keamanan akun yang lebih baik.',
            keywords: ['atur password', 'ubah password', 'reset password'],
            robots: 'noindex, follow',
        },
        'confirm-email': {
            title: 'Konfirmasi Email',
            description: 'Konfirmasi email Anda untuk menyelesaikan proses registrasi di Juru Tani.',
            keywords: ['konfirmasi email', 'verifikasi email'],
            robots: 'noindex, follow',
        },
        callback: {
            title: 'Memproses',
            description: 'Memproses autentikasi Anda...',
            keywords: ['callback', 'verifikasi'],
            robots: 'noindex, nofollow',
        },
    }

    return generateSeoMeta(pageMetaConfig[pageType] || pageMetaConfig.login)
}

/**
 * Hook untuk auth pages
 */
export const useSeoAuth = (pageType: 'login' | 'register' | 'forgot-password' | 'reset-password' | 'confirm-email' | 'callback') => {
    const seoMeta = getAuthPageSeoMeta(pageType)

    useSeoMeta({
        title: seoMeta.title,
        description: seoMeta.description,
        keywords: seoMeta.keywords,
        author: seoMeta.author,
        robots: seoMeta.robots,
        ogTitle: seoMeta.ogTitle,
        ogDescription: seoMeta.ogDescription,
        ogImage: seoMeta.ogImage,
    })

    return seoMeta
}
