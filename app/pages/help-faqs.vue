<script setup lang="ts">
// SEO Optimization
useSeoOptimized('help')

// Category tabs
  const categories = [
    { id: 'general', name: 'Umum', icon: 'i-heroicons-information-circle' },
    { id: 'account', name: 'Akun & Pendafataran', icon: 'i-heroicons-user-circle' },
    { id: 'farming', name: 'Kajian Pertanian', icon: 'i-heroicons-sparkles' },
    { id: 'marketplace', name: 'Pemasaran', icon: 'i-heroicons-shopping-bag' },
    { id: 'technical', name: 'Bantuan Teknis', icon: 'i-heroicons-computer-desktop' }
  ]
  
  const activeCategory = ref('general')
  
  // FAQs data
 const faqs = {
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
      question: 'Apakah Juru Tani bisa membantu transisi ke pertanian organik?',
      answer: 'Tentu! Kami menyediakan panduan lengkap untuk transisi ke pertanian organik atau berkelanjutan. Platform kami menyediakan rencana konversi langkah demi langkah, teknik pengendalian hama alami, resep pupuk organik, dan koneksi dengan penasihat pertanian organik. Kami juga membantu proses sertifikasi organik dan menemukan pasar untuk hasil pertanian organik Anda.'
    }
  ],
  marketplace: [
    {
      question: 'Bagaimana cara kerja marketplace Juru Tani?',
      answer: 'Marketplace Juru Tani menghubungkan petani langsung dengan pembeli termasuk pengecer, pengolah, dan konsumen. Petani dapat mencantumkan hasil panen mereka, perkiraan waktu panen, kuantitas, dan harga. Pembeli yang tertarik dapat melakukan pemesanan, dan platform kami menangani keamanan transaksi, pemrosesan pembayaran, dan koordinasi pengiriman untuk memastikan pengalaman yang lancar.'
    },
    {
      question: 'Bagaimana Juru Tani memastikan harga yang adil untuk petani?',
      answer: 'Kami menyediakan informasi harga pasar secara real-time agar petani dapat menentukan harga secara tepat. Platform kami menghilangkan banyak perantara sehingga petani dapat memperoleh nilai lebih besar. Kami juga memfasilitasi penjualan kolektif bagi petani kecil untuk meningkatkan daya tawar, dan sistem sertifikasi kualitas kami membantu petani mendapatkan harga premium untuk hasil berkualitas tinggi.'
    },
    {
      question: 'Produk pertanian apa yang bisa saya beli melalui Juru Tani?',
      answer: 'Marketplace kami menyediakan berbagai input pertanian seperti benih berkualitas, pupuk organik dan konvensional, produk pengendalian hama, peralatan pertanian kecil, perlengkapan irigasi, dan bahan kemasan. Semua produk telah diverifikasi kualitas dan sesuai standar pertanian. Tersedia juga opsi pembelian grosir bagi kelompok tani untuk mendapatkan diskon volume.'
    },
    {
      question: 'Bagaimana proses pengiriman dalam transaksi marketplace?',
      answer: 'Juru Tani bekerja sama dengan penyedia logistik lokal yang khusus menangani produk pertanian. Untuk penjualan hasil panen, pembeli dapat menjemput sendiri atau menggunakan jaringan logistik kami. Untuk pembelian input pertanian, biaya pengiriman dihitung berdasarkan berat dan jarak. Kami juga menyediakan pengiriman kolektif ke wilayah pertanian sekitar untuk menekan biaya transportasi.'
    }
  ],
  technical: [
    {
      question: 'Perangkat dan sistem operasi apa yang mendukung aplikasi Juru Tani?',
      answer: 'Aplikasi seluler Juru Tani tersedia untuk perangkat Android (versi 7.0 ke atas) dan iOS (versi 12.0 ke atas). Platform web kami dapat diakses melalui semua browser modern seperti Chrome, Safari, Firefox, dan Edge. Untuk performa terbaik, kami sarankan menggunakan versi terbaru dari sistem operasi dan browser Anda.'
    },
    {
      question: 'Apakah Juru Tani bisa digunakan secara offline?',
      answer: 'Aplikasi seluler Juru Tani memiliki fitur offline untuk kebutuhan penting. Anda dapat mengakses panduan tanaman yang tersimpan, laporan pasar yang telah diunduh, dan menginput data pertanian secara offline. Saat perangkat kembali online, aplikasi akan menyinkronkan data secara otomatis dan memperbarui informasi terbaru.'
    },
    {
      question: 'Seberapa aman data pribadi dan pertanian saya di Juru Tani?',
      answer: 'Kami menerapkan enkripsi setara perbankan dan protokol keamanan untuk melindungi data Anda. Informasi pribadi dan pertanian Anda tidak akan dibagikan ke pihak ketiga tanpa persetujuan Anda. Kami menggunakan pusat data yang aman, audit keamanan rutin, dan mengikuti standar perlindungan data internasional. Anda dapat meninjau dan mengatur pengaturan privasi kapan saja di akun Anda.'
    },
    {
      question: 'Bagaimana cara menghubungkan stasiun cuaca atau sensor tanah saya ke Juru Tani?',
      answer: 'Juru Tani mendukung integrasi dengan berbagai perangkat IoT pertanian. Di aplikasi, buka "Pengaturan" > "Perangkat Tersambung", lalu pilih merek dan model perangkat Anda. Ikuti petunjuk langkah demi langkah untuk menyambungkan sensor Anda. Setelah tersambung, data akan otomatis masuk ke dashboard pertanian Anda, memungkinkan rekomendasi dan peringatan yang lebih akurat berdasarkan kondisi lapangan secara real-time.'
    }
  ]
}

  // Search functionality
  const searchQuery = ref('')
  const searchResults = ref([])

  const performSearch = () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = []
      return
    }
    
    const query = searchQuery.value.toLowerCase()
    const results = []
    
    Object.keys(faqs).forEach(category => {
      faqs[category].forEach(faq => {
        if (faq.question.toLowerCase().includes(query) || 
            faq.answer.toLowerCase().includes(query)) {
          results.push({
            ...faq,
            category: categories.find(c => c.id === category).name
          })
        }
      })
    })
    
    searchResults.value = results
  }

  // Scroll to FAQ section
  const scrollToFaqs = () => {
    const element = document.getElementById('faq-categories')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900 pt-24 lg:pt-32">
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" stroke-width="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </div>
      
      <div class="container mx-auto px-6 py-16 sm:py-24 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">Pusat Bantuan</h1>
          <p class="text-lg md:text-xl text-green-100 mb-10">
            Temukan jawaban dari pertanyaan - pertanyaan paling umum dari Tim Juru tani dalam Edukasi Pertanian.
          </p>         
        </div>
      </div>
    </div>
    
    <!-- Quick Help Categories -->
    <div class="container mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        Bantuan cepat
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Help Card 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-book-open" class="text-2xl text-green-600 dark:text-green-300" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Panduan user</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Langkah - langkah untuk pengenalan penggunaan JuruTani
          </p>
          <UButton color="green" variant="ghost" @click="scrollToFaqs">
            Pelajari Lebih ...
          </UButton>
        </div>
        
        <!-- Help Card 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-video-camera" class="text-2xl text-green-600 dark:text-green-300" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Video Tutorial</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Lihat video dari tutorial pertanian dari tim JuruTani
          </p>
          <UButton color="green" variant="ghost" @click="scrollToFaqs">
            Lihat Video ...
          </UButton>
        </div>
        
        <!-- Help Card 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="text-2xl text-green-600 dark:text-green-300" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Komunitas JuruTani</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Bangun relasi antar petani di komunitas JuruTani
          </p>
          <UButton color="green" variant="ghost" @click="scrollToFaqs">
            Bergabung sekarang ...
          </UButton>
        </div>
        
        <!-- Help Card 4 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
          <div class="h-16 w-16 mx-auto mb-4 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-phone" class="text-2xl text-green-600 dark:text-green-300" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-3">Contact Support</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Butuh bantuan lebih dalam dari Tim Juru Tani untuk pertanian Anda?
          </p>
          <UButton color="green" variant="ghost" to="/contact-us">
            Hubungi kami ...
          </UButton>
        </div>
      </div>
    </div>
    
    <!-- FAQ Categories -->
    <div id="faq-categories" class="container mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        Pertanyaan Umum
      </h2>
      
      <!-- Category Tabs -->
      <div class="flex flex-wrap justify-center mb-10 gap-2">
        <UButton
          v-for="category in categories"
          :key="category.id"
          variant="soft"
          color="green"
          :class="activeCategory === category.id ? 'bg-green-600 text-white dark:bg-green-700' : ''"
          class="px-4 py-2 rounded-full"
          @click="activeCategory = category.id"
        >
          <UIcon :name="category.icon" class="mr-2" />
          {{ category.name }}
        </UButton>
      </div>
      
      <!-- FAQ Accordion -->
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <UAccordion :items="faqs[activeCategory]" :ui="{ wrapper: 'divide-y divide-gray-100 dark:divide-gray-700' }">
          <template #default="{ item, index, open }">
            <div class="p-5">
              <div class="flex justify-between items-center">
                <span class="font-medium text-lg text-gray-800 dark:text-white">{{ item.question }}</span>
                <UIcon 
                  :name="open ? 'i-heroicons-minus-circle' : 'i-heroicons-plus-circle'" 
                  class="text-xl text-green-600 dark:text-green-400"
                />
              </div>
            </div>
          </template>
          <template #item="{ item }">
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ item.answer }}
            </div>
          </template>
        </UAccordion>
      </div>
    </div>
    
    <!-- Can't Find Answer Section -->
    <div class="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 py-16">
      <div class="container mx-auto px-6">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            Tidak menemukan apa yang kamu cari?
          </h2>
          <p class="text-green-100 mb-8">
            Tim Juru Tani siap menjawab semua pertanyaan mu dalam bidang pertanian.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton 
              to="/contact-us" 
              color="white" 
              class="text-green-700"
            >
              <UIcon name="i-heroicons-envelope" class="mr-2" />
              Hubungi Tim JuruTani
            </UButton>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Support Resources -->
    <div class="container mx-auto px-6 py-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
        Sumber tambahan
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Resource 1 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="h-40 bg-green-200 dark:bg-green-900 flex items-center justify-center">
            <UIcon name="i-heroicons-document-text" class="text-5xl text-green-700 dark:text-green-300" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Panduan dalam Pertanian
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Download materi dan juga panduan penerapan sistem modern dalam bidang pertanian.
            </p>
            <UButton variant="ghost" color="green" class="w-full">
              Cari materi ...
            </UButton>
          </div>
        </div>
        
        <!-- Resource 2 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="h-40 bg-green-200 dark:bg-green-900 flex items-center justify-center">
            <UIcon name="i-heroicons-academic-cap" class="text-5xl text-green-700 dark:text-green-300" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Pelatihan bidang pertanian
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Akses pelatihan gratis dari tim JutuTani dalam bidang pertanian modern.
            </p>
            <UButton variant="ghost" color="green" class="w-full">
              Mulai pelajari ...
            </UButton>
          </div>
        </div>
        
        <!-- Resource 3 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="h-40 bg-green-200 dark:bg-green-900 flex items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="text-5xl text-green-700 dark:text-green-300" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Webinar dan Pertemuan
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Gabung dengan webinar dan kursus online dari para expert dari bidang pertanian.
            </p>
            <UButton variant="ghost" color="green" class="w-full">
              Lihat Jadwal ...
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the FAQ page */
:deep(.u-button.bg-green-600),
:deep(.u-button.dark\:bg-green-700) {
  border: none;
}

/* Custom animation for accordion */
:deep(.u-accordion-item) {
  transition: all 0.3s ease;
}

:deep(.u-accordion-item:hover) {
  background-color: rgba(0, 128, 0, 0.05);
}
</style>