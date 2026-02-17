<script setup lang="ts">
import { 
  footerMenuLinks as menuLinks, 
  footerContactInfo as contactInfo, 
  footerSocialMedia as socialMedia, 
  footerBottomLinks as footerLinks 
} from '@/data/menu'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer 
    class="relative py-16 overflow-hidden bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/90 dark:to-green-800/80 text-green-800 dark:text-green-200"
  >
    <!-- Backdrop blur container -->
    <div class="absolute inset-0 backdrop-blur-sm bg-white/5 dark:bg-black/5"/>
    
    <!-- Decorative elements -->
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-green-300/20 dark:bg-green-500/10 rounded-full blur-3xl"/>
    <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-green-200/30 dark:bg-green-600/10 rounded-full blur-3xl"/>
    
    <div class="container relative mx-auto px-6 z-10">
      <!-- Statistics Section -->
      <FootVisitorStatistics />
      
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
                Inovasi dari Politeknik Pembangunan Pertanian Yogyakarta Magelang
              </p>
            </div>
          </div>
          
          <!-- Menu Links -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-semibold text-lg mb-1">Tautan Cepat</h4>
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="(column, colIndex) in menuLinks" 
                :key="colIndex"
                class="flex flex-col space-y-3"
              >
                <NuxtLink 
                  v-for="item in column" 
                  :key="item.path"
                  :to="item.path" 
                  class="menu-link flex items-center"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"/>
                  {{ item.label }}
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-semibold text-lg mb-1">Kontak Kami</h4>
            <div class="space-y-3">
              <div 
                v-for="(contact, index) in contactInfo" 
                :key="index"
                class="flex items-start"
              >
                <div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <UIcon :name="contact.icon" class="text-green-600 dark:text-green-400 w-5 h-5" />
                </div>
                <div class="ml-3 flex-1">
                  <div v-if="Array.isArray(contact.text)">
                    <p v-for="(line, i) in contact.text" :key="i" class="text-sm">{{ line }}</p>
                  </div>
                  <p v-else class="text-sm">{{ contact.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Social Media Links -->
      <div class="flex flex-col items-center mb-10">
        <h4 class="text-center font-medium mb-6">Temukan Kami</h4>
        <div class="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
          <NuxtLink
            v-for="social in socialMedia"
            :key="social.name"
            :to="social.url"
            :target="social.name !== 'Email' ? '_blank' : undefined"
            rel="noopener noreferrer"
            :aria-label="social.ariaLabel"
            class="social-icon-container"
          >
            <div class="social-icon-wrapper">
              <UIcon :name="social.icon" class="text-green-600 dark:text-green-400 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Bottom Divider & Copyright -->
      <div class="pt-6 border-t border-green-200/30 dark:border-green-700/30">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-green-700/70 dark:text-green-300/70">
          <p>© {{ currentYear }} JuruTani. Semua Hak Dilindungi.</p>
          <div class="flex space-x-4 mt-3 md:mt-0">
            <NuxtLink 
              v-for="link in footerLinks"
              :key="link.path"
              :to="link.path" 
              class="hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
        
        <!-- Powered by section -->
        <div class="mt-6 pt-4 border-t border-green-200/20 dark:border-green-700/20 text-center">
          <p class="text-xs text-green-600/60 dark:text-green-400/60">
            Powered by 
            <NuxtLink
              to="https://polbangtanyoma.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium hover:text-green-600 dark:hover:text-green-400 transition-colors underline decoration-dotted"
            >
              Politeknik Pembangunan Pertanian Yogyakarta Magelang
            </NuxtLink>
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
  color: #16a34a;
}

.dark .menu-link:hover {
  color: #4ade80;
}

/* Social media icons */
.social-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, rgba(240, 253, 244, 0.8) 0%, rgba(220, 252, 231, 0.8) 100%);
}

.dark .social-icon-wrapper {
  background: linear-gradient(135deg, rgba(20, 83, 45, 0.5) 0%, rgba(22, 101, 52, 0.5) 100%);
}

.social-icon-wrapper:hover {
  border-color: rgba(34, 197, 94, 0.4);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 253, 244, 0.9) 100%);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.15);
}

.dark .social-icon-wrapper:hover {
  background: linear-gradient(135deg, rgba(22, 101, 52, 0.6) 0%, rgba(34, 197, 94, 0.4) 100%);
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .social-icon-wrapper {
    width: 52px;
    height: 52px;
  }
}

@media (min-width: 768px) {
  .social-icon-wrapper {
    width: 56px;
    height: 56px;
  }
}

@media (prefers-reduced-motion) {
  .menu-link, .social-icon {
    transition: none;
  }
}
</style>