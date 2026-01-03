import type { FaqCategory, FaqData } from './types'

/**
 * FAQ Data - Help & Support
 * Centralized FAQ content for help-faqs.vue
 */

export const faqCategories: FaqCategory[] = [
    { id: 'general', name: 'Umum', icon: 'i-lucide-info' },
    { id: 'account', name: 'Akun & Pendaftaran', icon: 'i-lucide-user-circle' },
    { id: 'farming', name: 'Kajian Pertanian', icon: 'i-lucide-sparkles' },
    { id: 'marketplace', name: 'Pemasaran', icon: 'i-lucide-shopping-bag' },
    { id: 'technical', name: 'Bantuan Teknis', icon: 'i-lucide-settings' }
]

export const faqData: FaqData = {
    general: [
        {
            question: 'Apa itu Juru Tani?',
            answer: 'Juru Tani adalah platform komprehensif yang dirancang untuk mendukung petani dengan saran pertanian ahli, solusi teknologi, koneksi pasar, dan sumber daya edukatif. Misi kami adalah memberdayakan komunitas pertanian melalui praktik berkelanjutan dan metode pertanian inovatif.'
        },
        {
            question: 'Bagaimana Juru Tani dapat membantu usaha pertanian saya?',
            answer: 'Juru Tani menyediakan panduan pengelolaan tanaman yang dipersonalisasi, menghubungkan Anda dengan pembeli hasil pertanian, menyediakan akses ke pakar pertanian, informasi cuaca dan pasar, serta membagikan praktik terbaik untuk pertanian berkelanjutan. Layanan kami dirancang untuk meningkatkan produktivitas dan keuntungan sambil mempromosikan pendekatan ramah lingkungan.'
        },
        {
            question: 'Apakah Juru Tani tersedia di seluruh Indonesia?',
            answer: 'Saat ini, Juru Tani beroperasi di wilayah pertanian utama di Indonesia, termasuk Jawa, Sumatera, Kalimantan, Sulawesi, dan Bali. Kami terus memperluas cakupan kami untuk menjangkau lebih banyak komunitas petani. Hubungi tim kami untuk mengecek ketersediaan di lokasi Anda.'
        },
        {
            question: 'Apa yang membedakan Juru Tani dari layanan pertanian lainnya?',
            answer: 'Juru Tani menggabungkan kearifan lokal pertanian tradisional dengan teknologi modern dan wawasan berbasis data. Platform kami menawarkan dukungan menyeluruh termasuk perencanaan tanaman, manajemen hama, optimalisasi panen, dan akses pasar — semua dalam satu ekosistem terintegrasi. Kami juga fokus pada pembangunan komunitas, menghubungkan petani untuk berbagi pengetahuan dan sumber daya.'
        }
    ],
    account: [
        {
            question: 'Bagaimana cara membuat akun Juru Tani?',
            answer: 'Untuk membuat akun, unduh aplikasi Juru Tani dari Google Play Store atau Apple App Store, atau kunjungi situs web kami. Klik "Daftar", isi informasi dasar Anda termasuk nama, kontak, dan lokasi. Verifikasi nomor telepon atau email Anda, lalu lengkapi profil pertanian untuk mendapatkan rekomendasi yang dipersonalisasi.'
        },
        {
            question: 'Apakah ada biaya untuk menggunakan layanan Juru Tani?',
            answer: 'Juru Tani menyediakan layanan gratis dan berbayar. Fitur dasar seperti pembaruan cuaca, akses forum komunitas, dan tips pertanian umum tersedia secara gratis. Layanan premium seperti rencana pengelolaan tanaman personal, konsultasi prioritas dengan ahli, dan analisis pasar lanjutan memerlukan langganan. Kunjungi halaman harga kami untuk informasi lebih lanjut.'
        },
        {
            question: 'Bagaimana cara mereset kata sandi saya?',
            answer: 'Jika Anda lupa kata sandi, klik "Lupa Kata Sandi" di layar login. Masukkan email atau nomor telepon yang terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda. Ikuti petunjuk dalam email atau SMS. Demi keamanan, tautan hanya berlaku selama 24 jam.'
        },
        {
            question: 'Apakah saya bisa memiliki beberapa lokasi pertanian dalam satu akun?',
            answer: 'Ya, Anda dapat mengelola beberapa lokasi pertanian dalam satu akun Juru Tani. Di pengaturan profil Anda, buka bagian "Manajemen Pertanian" dan pilih "Tambah Pertanian Baru" untuk mendaftarkan lokasi tambahan. Setiap lokasi dapat memiliki rencana tanaman, informasi tanah, dan jadwal pengelolaan masing-masing.'
        }
    ],
    farming: [
        {
            question: 'Bagaimana Juru Tani membantu dalam mengidentifikasi penyakit tanaman?',
            answer: 'Aplikasi seluler kami memungkinkan Anda mengambil foto tanaman yang terkena penyakit dan mengunggahnya ke sistem identifikasi penyakit berbasis AI. Sistem ini menganalisis gejala visual dan memberikan diagnosis kemungkinan penyakit serta rekomendasi pengobatan. Untuk kasus kompleks, pakar pertanian kami akan meninjau dan memberikan saran personal dalam waktu 24 jam.'
        },
        {
            question: 'Apakah Juru Tani menyediakan layanan analisis tanah?',
            answer: 'Ya, Juru Tani bekerja sama dengan laboratorium pertanian bersertifikat untuk menyediakan layanan pengujian tanah. Anda dapat memesan kit pengujian melalui platform kami, mengumpulkan sampel sesuai panduan, dan mengirimkannya ke laboratorium mitra terdekat. Hasil akan dikirim secara digital dalam 7–10 hari, lengkap dengan rekomendasi perbaikan tanah dan pemilihan tanaman.'
        },
        {
            question: 'Informasi cuaca seperti apa yang disediakan Juru Tani?',
            answer: 'Platform kami menyediakan prakiraan cuaca hiper-lokal termasuk suhu, kelembapan, prediksi curah hujan, dan peringatan cuaca ekstrem sesuai lokasi pertanian Anda. Kami juga menyediakan prospek iklim musiman dan data cuaca historis untuk membantu perencanaan jangka panjang. Pengguna premium akan menerima notifikasi khusus sesuai kebutuhan tanaman mereka.'
        },
        {
            question: 'Bagaimana cara mengakses konsultasi dengan ahli pertanian?',
            answer: 'Pengguna dapat mengakses konsultasi melalui fitur chat dalam aplikasi, menjadwalkan video call, atau memposting pertanyaan di forum komunitas. Pakar pertanian kami tersedia untuk menjawab pertanyaan tentang manajemen tanaman, kesehatan tanah, pengendalian hama, strategi irigasi, dan topik pertanian lainnya. Pengguna premium mendapatkan akses prioritas dan waktu respons lebih cepat.'
        }
    ],
    marketplace: [
        {
            question: 'Bagaimana cara menjual hasil panen di marketplace Juru Tani?',
            answer: 'Marketplace Juru Tani menghubungkan petani langsung dengan pembeli termasuk pengecer, pengolah, dan konsumen. Petani dapat mencantumkan hasil panen mereka, perkiraan waktu panen, kuantitas, dan harga. Pembeli yang tertarik dapat melakukan pemesanan, dan platform kami menangani keamanan transaksi, pemrosesan pembayaran, dan koordinasi pengiriman untuk memastikan pengalaman yang lancar.'
        },
        {
            question: 'Bagaimana Juru Tani membantu petani mendapatkan harga yang adil?',
            answer: 'Kami menyediakan informasi harga pasar secara real-time agar petani dapat menentukan harga secara tepat. Platform kami menghilangkan banyak perantara sehingga petani dapat memperoleh nilai lebih besar. Kami juga memfasilitasi penjualan kolektif bagi petani kecil untuk meningkatkan daya tawar, dan sistem sertifikasi kualitas kami membantu petani mendapatkan harga premium untuk hasil berkualitas tinggi.'
        },
        {
            question: 'Jenis input pertanian apa saja yang tersedia di marketplace?',
            answer: 'Marketplace kami menyediakan berbagai input pertanian seperti benih berkualitas, pupuk organik dan konvensional, produk pengendalian hama, peralatan pertanian kecil, perlengkapan irigasi, dan bahan kemasan. Semua produk telah diverifikasi kualitas dan sesuai standar pertanian. Tersedia juga opsi pembelian grosir bagi kelompok tani untuk mendapatkan diskon volume.'
        },
        {
            question: 'Bagaimana sistem pembayaran dan pengiriman bekerja?',
            answer: 'Platform kami menyediakan gateway pembayaran aman yang mendukung berbagai metode termasuk transfer bank, e-wallet, dan pembayaran saat pengiriman untuk transaksi yang memenuhi syarat. Kami bermitra dengan penyedia logistik terpercaya untuk memastikan pengiriman tepat waktu. Sistem pelacakan real-time memungkinkan pembeli dan penjual memantau status pengiriman.'
        }
    ],
    technical: [
        {
            question: 'Perangkat apa saja yang kompatibel dengan Juru Tani?',
            answer: 'Aplikasi seluler Juru Tani tersedia untuk perangkat Android (versi 7.0 ke atas) dan iOS (versi 12.0 ke atas). Platform web kami dapat diakses melalui semua browser modern seperti Chrome, Safari, Firefox, dan Edge. Untuk performa terbaik, kami sarankan menggunakan versi terbaru dari sistem operasi dan browser Anda.'
        },
        {
            question: 'Apakah Juru Tani bisa digunakan secara offline?',
            answer: 'Aplikasi seluler Juru Tani memiliki fitur offline untuk kebutuhan penting. Anda dapat mengakses panduan tanaman yang tersimpan, laporan pasar yang telah diunduh, dan menginput data pertanian secara offline. Saat perangkat kembali online, aplikasi akan menyinkronkan data secara otomatis dan memperbarui informasi terbaru.'
        },
        {
            question: 'Bagaimana Juru Tani melindungi data pribadi saya?',
            answer: 'Kami menerapkan enkripsi setara perbankan dan protokol keamanan untuk melindungi data Anda. Informasi pribadi dan pertanian Anda tidak akan dibagikan ke pihak ketiga tanpa persetujuan Anda. Kami menggunakan pusat data yang aman, audit keamanan rutin, dan mengikuti standar perlindungan data internasional. Anda dapat meninjau dan mengatur pengaturan privasi kapan saja di akun Anda.'
        },
        {
            question: 'Bagaimana cara mendapatkan dukungan teknis?',
            answer: 'Untuk dukungan teknis, Anda dapat menghubungi tim kami melalui chat dalam aplikasi, email di support@jurutani.id, atau telepon di +62-XXX-XXXX-XXXX (jam kerja: Senin-Jumat, 09:00-17:00 WIB). Kami juga memiliki pusat bantuan komprehensif dengan artikel, video tutorial, dan panduan pemecahan masalah untuk masalah umum.'
        }
    ]
}

export const quickHelpCategories = [
    {
        icon: 'i-lucide-info',
        title: 'Panduan Memulai',
        description: 'Pelajari cara menggunakan platform Juru Tani untuk pertama kali',
        link: '#faq-categories'
    },
    {
        icon: 'i-lucide-message-circle',
        title: 'Konsultasi Pertanian',
        description: 'Hubungi ahli pertanian kami untuk saran profesional',
        link: '/contact-us'
    },
    {
        icon: 'i-lucide-shopping-cart',
        title: 'Marketplace',
        description: 'Jual beli produk pertanian dengan mudah dan aman',
        link: '/markets'
    },
    {
        icon: 'i-lucide-headset',
        title: 'Dukungan Teknis',
        description: 'Dapatkan bantuan untuk masalah teknis atau akun',
        link: '/contact-us'
    }
]

export const supportResources = [
    {
        icon: 'i-lucide-book-open',
        title: 'Pusat Pengetahuan',
        description: 'Akses artikel mendalam, panduan, dan tutorial untuk memaksimalkan penggunaan Juru Tani',
        link: '/educations'
    },
    {
        icon: 'i-lucide-video',
        title: 'Tutorial Video',
        description: 'Tonton video tutorial langkah demi langkah untuk berbagai fitur platform',
        link: '/videos'
    },
    {
        icon: 'i-lucide-users',
        title: 'Forum Komunitas',
        description: 'Bergabunglah dengan komunitas petani untuk berbagi pengalaman dan tips',
        link: '/discussions'
    }
]
