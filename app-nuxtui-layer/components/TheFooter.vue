<script setup lang="ts">
// Kosong, tidak ada animasi yang dibutuhkan
</script>

<template>
  <footer 
    class="relative py-16 overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/90 dark:to-green-800/80 text-green-800 dark:text-green-200"
  >
    <!-- Backdrop blur container -->
    <div class="absolute inset-0 backdrop-blur-sm bg-white/5 dark:bg-black/5"/>
    
    <!-- Decorative elements -->
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-green-300/20 dark:bg-green-500/10 rounded-full blur-3xl"/>
    <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-green-200/30 dark:bg-green-600/10 rounded-full blur-3xl"/>
    
    <div class="container relative mx-auto px-6 z-10">
      <!-- Top section with main content -->
      <div class="glass-panel mb-12 p-8 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-green-900/30 shadow-lg border border-white/20 dark:border-green-800/30">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <!-- Brand Identity -->
          <div class="flex flex-col space-y-4">
              <TheLogo />
            <p class="text-sm text-green-700/80 dark:text-green-300/90 max-w-xs">
              Memberdayakan petani Indonesia dengan teknologi modern dan solusi berkelanjutan untuk pertanian yang lebih baik.
            </p>
            <div class="mt-4 p-4 bg-green-100/50 dark:bg-green-800/20 rounded-lg border border-green-200/30 dark:border-green-700/30">
              <p class="text-xs text-green-700/70 dark:text-green-300/70 font-medium">
                Inovasi dari Politeknik Pembangunan dan Pertanian Yogyakarta
              </p>
            </div>
          </div>
          
          <!-- Menu Links -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-semibold text-lg mb-1">Tautan Cepat</h4>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col space-y-3">
                <NuxtLink to="/" class="menu-link flex items-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>
                  Beranda
                </NuxtLink>
                <NuxtLink to="/about-us" class="menu-link flex items-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>
                  Tentang Kami
                </NuxtLink>
                <NuxtLink to="/news" class="menu-link flex items-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>
                  Berita
                </NuxtLink>
              </div>
              <div class="flex flex-col space-y-3">
                <NuxtLink to="/markets" class="menu-link flex items-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>
                  Produk
                </NuxtLink>
                <NuxtLink to="/discussions/group" class="menu-link flex items-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>
                  Komunitas
                </NuxtLink>
                <NuxtLink to="/contact-us" class="menu-link flex items-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>
                  Kontak
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-semibold text-lg mb-1">Kontak Kami</h4>
            <div class="space-y-3">
              <div class="flex items-center">
                <UIcon name="i-mdi-map-marker" class="text-green-600 dark:text-green-400 mr-2" />
                <div>
                <p class="text-sm">Jl. Kusumanegara No.2, Tahunan, Kec. Umbulharjo, </p>
                <p class="text-sm">Kota Yogyakarta, Daerah Istimewa Yogyakarta 55161</p>
                </div>
              </div>
              <div class="flex items-center">
                <UIcon name="i-mdi-phone" class="text-green-600 dark:text-green-400 mr-2" />
                <p class="text-sm">+62 815-7552-5260</p>
              </div>
              <div class="flex items-center">
                <UIcon name="i-mdi-email" class="text-green-600 dark:text-green-400 mr-2" />
                <p class="text-sm">jurutani2@gmail.com</p>
              </div>
              <div class="flex items-center">
                <UIcon name="i-mdi-clock-outline" class="text-green-600 dark:text-green-400 mr-2" />
                <p class="text-sm">Senin - Jumat: 08.00 - 16.00 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Social Media Links -->
      <div class="flex flex-col items-center mb-10">
        <h4 class="text-center font-medium mb-6">Temukan Kami</h4>
        <div class="flex flex-wrap justify-center gap-4">
          <!-- WhatsApp -->
          <a 
            href="https://api.whatsapp.com/send/?phone=6281575525260&text=Halo%2C+saya+ingin+bertanya...&type=phone_number&app_absent=0" 
            target="_blank"
            aria-label="WhatsApp"
            class="social-icon-container"
          >
            <div class="social-icon bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
              <UIcon name="i-mdi-whatsapp" class="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </a>
          
          <!-- TikTok -->
          <a 
            href="https://www.tiktok.com/@juru_tani" 
            target="_blank"
            aria-label="TikTok"
            class="social-icon-container"
          >
            <div class="social-icon bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
              <UIcon name="i-ic-baseline-tiktok" class="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </a>
          
          <!-- Email/Gmail -->
          <a 
            href="mailto:jurutani2@gmail.com" 
            aria-label="Email"
            class="social-icon-container"
          >
            <div class="social-icon bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
              <UIcon name="i-mdi-gmail" class="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </a>
          
          <!-- Instagram -->
          <a 
            href="https://www.instagram.com/jurutani_" 
            target="_blank"
            aria-label="Instagram"
            class="social-icon-container"
          >
            <div class="social-icon bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
              <UIcon name="i-mdi-instagram" class="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </a>
          
          <!-- YouTube -->
          <a 
            href="https://www.youtube.com/@Juru_Tani" 
            target="_blank"
            aria-label="YouTube"
            class="social-icon-container"
          >
            <div class="social-icon bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
              <UIcon name="i-mdi-youtube" class="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </a>
        </div>
      </div>
      
      <!-- Bottom Divider & Copyright -->
      <div class="pt-6 border-t border-green-200/30 dark:border-green-700/30">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-green-700/70 dark:text-green-300/70">
          <p>© {{ new Date().getFullYear() }} Juru Tani. Semua Hak Dilindungi.</p>
          <div class="flex space-x-4 mt-3 md:mt-0">
            <NuxtLink to="/privacy-policy" class="hover:text-green-600 dark:hover:text-green-400 transition-colors">Kebijakan Privasi</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-green-600 dark:hover:text-green-400 transition-colors">Syarat & Ketentuan</NuxtLink>
          </div>
        </div>
        
        <!-- Powered by section -->
        <div class="mt-6 pt-4 border-t border-green-200/20 dark:border-green-700/20 text-center">
          <p class="text-xs text-green-600/60 dark:text-green-400/60">
            Powered by 
            <a 
              href="https://kairav-portfolio.vercel.app/" 
              target="_blank"
              class="font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors underline decoration-dotted"
            >
              Politeknik Pembangunan dan Pertanian Yogyakarta
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Glassmorphism effect */
.glass-panel {
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Menu link */
.menu-link {
  transition: color 0.3s ease;
}

.menu-link:hover {
  color: theme('colors.green.600');
}

/* Social media icons */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  transition: background-color 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.social-icon:hover {
  border-color: rgba(34, 197, 94, 0.3);
  background-color: rgba(255, 255, 255, 0.8);
}
.dark .social-icon:hover {
  background-color: rgba(22, 101, 52, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .social-icon {
    width: 45px;
    height: 45px;
  }
}

@media (prefers-reduced-motion) {
  .menu-link, .social-icon {
    transition: none;
  }
}
</style>