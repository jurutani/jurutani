# 🌾 Juru Tani - Platform Penyuluhan Digital Pertanian

<div align="center">

![Juru Tani Logo](public/jurutani.png)

**Platform komprehensif untuk memberdayakan petani Indonesia melalui teknologi digital**

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.2.2-00DC82?style=flat&logo=nuxt.js)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat&logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)

[Demo](https://jurutani.com) • [Dokumentasi](#dokumentasi) • [Fitur](#fitur-utama) • [Instalasi](#instalasi)

</div>

---

## 📖 Tentang Juru Tani

**Juru Tani** adalah inovasi platform penyuluhan digital pertanian yang dikembangkan oleh mahasiswa dan dosen **Politeknik Pembangunan Pertanian (Polbangtan) Yogyakarta Magelang** di bawah naungan Kementerian Pertanian Republik Indonesia.

Platform ini menggabungkan kearifan pertanian tradisional dengan teknologi modern untuk menciptakan ekosistem digital yang memberdayakan petani Indonesia melalui:

- 🤖 **AI Chatbot Pertanian** - Asisten pintar untuk konsultasi pertanian 24/7
- 🌤️ **Prakiraan Cuaca** - Data cuaca real-time untuk perencanaan pertanian
- 🛒 **Marketplace Petani** - Jual-beli produk pertanian langsung tanpa perantara
- 📚 **Edukasi Digital** - Materi pembelajaran, video tutorial, dan kursus online
- 💬 **Forum Komunitas** - Diskusi dengan penyuluh, pakar, dan sesama petani
- 🧮 **Alat Bantu Pertanian** - Kalkulator pupuk, benih, dan tools analisis
- 📰 **Portal Berita** - Informasi terkini seputar pertanian Indonesia

---

## ✨ Fitur Utama

### 🌱 Layanan Pertanian

<table>
<tr>
<td width="50%">

#### 🤖 AI Chatbot (JuruTani Assistant)
- Konsultasi pertanian otomatis
- Jawaban real-time untuk pertanyaan pertanian
- Database pengetahuan pertanian lengkap
- Interface chatbot yang user-friendly

</td>
<td width="50%">

#### 🌤️ Integrasi Cuaca (OpenWeather API)
- Prakiraan cuaca 5 hari
- Prediksi per jam
- Rekomendasi kondisi pertanian
- Data berbasis lokasi pengguna

</td>
</tr>
<tr>
<td>

#### 💬 Sistem Diskusi & Chat
- **Chat Real-time** dengan penyuluh & pakar
- **Forum Komunitas** untuk diskusi grup
- **Tanya Pakar** - akses ke ahli pertanian
- **Ruang Chat Tematik** berdasarkan topik
- **Support Center** dengan admin

</td>
<td>

#### 🛒 Marketplace Pertanian
- Katalog produk pertanian lengkap
- Filter berdasarkan kategori & lokasi
- Pencarian produk canggih
- Integrasi WhatsApp untuk kontak seller
- Galeri foto produk

</td>
</tr>
<tr>
<td>

#### 📚 Platform Edukasi
- **Materi Pembelajaran** terstruktur
- **Video Tutorial** dari ahli
- **Kursus Online** dengan jadwal pertemuan
- **Profil Expert & Instructor**
- Konten edukatif berkualitas tinggi

</td>
<td>

#### 🧮 Kalkulator Pertanian
- **Kalkulator Benih** - hitung kebutuhan benih
- **Kalkulator Pupuk** - optimasi pemupukan
- Tools analisis pertanian lainnya
- Rekomendasi berbasis data

</td>
</tr>
</table>

### 📰 Konten & Informasi

- **Portal Berita Pertanian** - Berita terkini dengan sistem kategori
- **Artikel Edukatif** - Panduan dan tips pertanian
- **Video Library** - Koleksi video tutorial
- **Search & Filter** - Pencarian konten yang powerful

### 👤 Manajemen Pengguna

- **Autentikasi Lengkap** - Register, login, reset password, verifikasi email
- **Profil Pengguna** - Kelola profil dengan avatar upload
- **Role-Based Access** - Admin, Expert, Instructor, Farmer, User
- **Riwayat Aktivitas** - Tracking aktivitas pengguna
- **Pengaturan Akun** - Keamanan dan preferensi

### 🎨 UI/UX Modern

- **Dark Mode** - Mode gelap untuk kenyamanan mata
- **Responsive Design** - Optimal di semua perangkat (mobile, tablet, desktop)
- **Loading States** - Skeleton screens untuk UX yang smooth
- **Toast Notifications** - Feedback interaktif untuk aksi pengguna
- **Modal & Animations** - Transisi yang halus dan modern
- **Accessibility** - Support untuk screen readers dan keyboard navigation

---

## 🛠️ Teknologi Stack

### Frontend Framework
```
Nuxt 4.2.2 (Vue 3) + TypeScript 5.7.3
```

### UI & Styling
- **Nuxt UI 2.22.3** - Component library yang powerful
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Lucide Icons** - Icon library modern
- **@nuxt/image** - Image optimization otomatis

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication & Authorization
  - Real-time Subscriptions
  - Storage untuk file/image upload
  - Row-Level Security

### State Management
- **Pinia 3.0.4** - Vue state management
- **VueUse 14.1.0** - Composition utilities
- **21 Custom Composables** - Reusable logic

### Form & Validation
- **VeeValidate 4.15.0** - Form validation
- **Zod 3.25.56** - Schema validation

### SEO & Performance
- **nuxt-schema-org** - Structured data (JSON-LD)
- **nuxt-og-image** - Social media preview images
- **@nuxtjs/sitemap** - XML sitemap generation
- **@nuxtjs/robots** - Robots.txt management
- **@nuxtjs/critters** - Critical CSS inlining
- **@nuxtjs/fontaine** - Font optimization

### External APIs
- **OpenWeather API** - Weather data
- **WhatsApp API** - Direct messaging
- **Supabase API** - Backend operations

### Development Tools
- **ESLint & Prettier** - Code quality
- **TypeScript** - Type safety
- **@nuxtjs/html-validator** - HTML validation

### Deployment
- **Netlify** - Static site hosting
- **Domain**: [jurutani.com](https://jurutani.com)

---

## 📁 Struktur Proyek

```
jurutani/
├── app/
│   ├── assets/                 # CSS & images
│   ├── components/             # Vue components
│   │   ├── common/            # ✨ Reusable components (NEW)
│   │   │   ├── PageHeroSection.vue
│   │   │   ├── SectionHeader.vue
│   │   │   ├── IconInfoCard.vue
│   │   │   ├── FeatureCardGrid.vue
│   │   │   ├── FaqAccordion.vue
│   │   │   └── LegalPageLayout.vue
│   │   ├── Announcement/      # Announcement components
│   │   ├── App/               # App-wide components
│   │   ├── Carousel/          # Carousel components
│   │   ├── Chat/              # Chat system components (40+ files)
│   │   ├── Chatbot/           # AI Chatbot (18 files)
│   │   ├── Discussions/       # Forum & discussion (14 files)
│   │   ├── Educations/        # Educational content
│   │   ├── History/           # User history
│   │   ├── Kalkulator/        # Calculator tools
│   │   ├── Markets/           # Marketplace components
│   │   ├── Nav/               # Navigation (9 files)
│   │   ├── News/              # News components
│   │   ├── Product/           # Product display
│   │   ├── Profile/           # User profile
│   │   ├── Video/             # Video player
│   │   └── Weather/           # Weather widgets
│   ├── composables/           # Reusable logic (21 files)
│   │   ├── useSupabase.ts    # Supabase client (409 lines)
│   │   ├── useChat.ts        # Chat functionality (703 lines)
│   │   ├── useContentList.ts # Content management (187 lines)
│   │   ├── useProfile.ts     # User profiles
│   │   ├── useSocialShare.ts # Social sharing (150 lines)
│   │   └── useJsonLdSchema.ts# SEO schemas (331 lines)
│   ├── data/                  # ✨ Centralized data (NEW)
│   │   ├── types.ts          # TypeScript interfaces
│   │   ├── about.ts          # About page data
│   │   ├── faq.ts            # FAQ data (5 categories)
│   │   ├── contact.ts        # Contact information
│   │   └── legal.ts          # Legal documents
│   ├── layouts/               # Layout wrappers
│   │   ├── default.vue       # Default layout
│   │   └── blank.vue         # Minimal layout
│   ├── middleware/            # Route guards
│   │   ├── auth.ts           # Protected routes
│   │   ├── guest.ts          # Guest-only routes
│   │   ├── first-visit.global.ts
│   │   └── visit.global.ts
│   ├── pages/                 # File-based routing (50+ pages)
│   │   ├── index.vue         # Homepage
│   │   ├── about-us.vue      # ✨ Refactored (517→200 lines)
│   │   ├── contact-us.vue    # ✨ Refactored + validation
│   │   ├── help-faqs.vue     # ✨ Refactored (368→150 lines)
│   │   ├── privacy-policy.vue# ✨ Refactored (130→15 lines)
│   │   ├── terms.vue         # ✨ Refactored (125→15 lines)
│   │   ├── auth/             # Authentication pages
│   │   ├── discussions/      # Discussion forums
│   │   ├── educations/       # Educational content
│   │   ├── markets/          # Marketplace
│   │   ├── news/             # News portal
│   │   ├── profile/          # User profile
│   │   ├── room-chat/        # Chat rooms
│   │   └── tools/            # Agricultural tools
│   ├── plugins/               # Nuxt plugins
│   │   └── seo.client.ts     # SEO plugin
│   ├── stores/                # Pinia stores
│   │   ├── auth.ts           # Authentication state
│   │   └── counter.ts        # Example store
│   └── utils/                 # Utility functions
│       ├── dateFormatter.ts  # Date formatting
│       ├── icon.ts           # Icon utilities
│       ├── seo.ts            # SEO helpers
│       └── index.ts          # General utilities
├── public/                    # Static assets
│   ├── jurutani.png          # Logo
│   ├── site.webmanifest      # PWA manifest
│   ├── about/                # About page images
│   ├── feature/              # Feature images
│   ├── gallery/              # Gallery images
│   ├── logo/                 # Logo variants
│   └── services/             # Service images
├── server/                    # Server-side code
├── types/                     # TypeScript types
│   ├── chat.ts               # Chat types
│   ├── global.d.ts           # Global types
│   └── image.ts              # Image types
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # This file
```

**Component Count**: 100+ Vue components  
**Composables**: 21 reusable logic functions  
**Pages**: 50+ routes with file-based routing  
**Total Lines**: 15,000+ lines of code

---

## 🚀 Instalasi

### Prerequisites

- **Node.js** 18.x atau lebih tinggi
- **pnpm** 8.x (recommended) atau npm/yarn
- **Git** untuk version control
- **Supabase Account** untuk backend

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/jurutani.git
cd jurutani
```

### Step 2: Install Dependencies

```bash
# Menggunakan pnpm (recommended)
pnpm install

# Atau menggunakan npm
npm install

# Atau menggunakan yarn
yarn install
```

### Step 3: Environment Variables

Buat file `.env` di root project:

```env
# Supabase Configuration
NUXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NUXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key

# OpenWeather API (optional, untuk weather feature)
NUXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key

# Site Configuration
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_SITE_NAME=Juru Tani

# Analytics (optional)
# NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Step 4: Setup Supabase Database

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru atau gunakan existing project
3. Jalankan SQL migrations (lihat `/server/database/schema.sql`)
4. Setup authentication providers (Email, OAuth, dll)
5. Configure storage buckets untuk upload images

### Step 5: Run Development Server

```bash
pnpm dev
```

Buka browser dan akses: `http://localhost:3000`

---

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start dev server dengan hot reload
pnpm build            # Build untuk production
pnpm generate         # Generate static site
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Lint dan format code dengan ESLint & Prettier
pnpm lint:fix         # Auto-fix linting issues

# Testing & Analysis
pnpm analyze          # Analyze bundle size
pnpm lighthouse       # Run Lighthouse performance test

# Deployment
pnpm deploy           # Deploy ke Netlify (configured in netlify.toml)
```

---

## 🔑 Fitur-Fitur Kunci

### 1. **AI Chatbot Pertanian**
```vue
<!-- Integrasi chatbot di halaman -->
<ChatbotJurutani />
```
- Konsultasi otomatis 24/7
- Database pengetahuan pertanian
- Splash screen dengan animasi
- Riwayat percakapan

### 2. **Real-time Chat System**
```typescript
// Menggunakan composable useChat
const { conversations, messages, sendMessage } = useChat()
```
- Chat one-on-one dengan penyuluh
- Group chat untuk komunitas
- Upload image dalam chat
- Read receipts
- Search conversations

### 3. **Weather Integration**
```vue
<WeatherSection />
```
- Current weather conditions
- 5-day forecast
- Hourly predictions
- Farming recommendations

### 4. **Marketplace**
```typescript
// Fetch products dengan filter
const { data: products } = await useContentList('products', {
  category: 'pupuk',
  search: 'organik'
})
```
- Product listing dengan pagination
- Advanced search & filter
- WhatsApp integration
- Image galleries

### 5. **Educational Platform**
```vue
<!-- Display educational materials -->
<EducationCard 
  v-for="material in materials" 
  :key="material.id"
  :data="material"
/>
```
- Materi pembelajaran terstruktur
- Video tutorials
- Kursus dengan jadwal
- Profil instructor & expert

### 6. **SEO Optimization**
```typescript
// Automatic SEO per page
useSeoOptimized('about') // Auto-generates meta tags, OG, JSON-LD
```
- Structured data (JSON-LD)
- Open Graph tags
- Twitter Cards
- Sitemap generation
- Robots.txt

---

## 🎨 Customization

### Theme Customization

Edit `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          // Green palette untuk pertanian
          50: '#f0fdf4',
          100: '#dcfce7',
          // ... customize colors
        }
      }
    }
  }
}
```

### Component Customization

Semua reusable components ada di `app/components/common/`:

```vue
<!-- Customize PageHeroSection -->
<PageHeroSection
  title="Custom Title"
  subtitle="Custom Subtitle"
  decorative="gradient"
  :cta="{ text: 'Click Me', link: '/target' }"
/>
```

### Data Management

Edit data di `app/data/`:

```typescript
// app/data/about.ts
export const aboutHero = {
  title: 'Your Custom Title',
  subtitle: 'Your Custom Subtitle',
  // ... customize data
}
```

---

## 🔐 Authentication & Authorization

### User Roles

```typescript
enum UserRole {
  ADMIN = 'admin',       // Full access
  EXPERT = 'expert',     // Agricultural expert
  INSTRUCTOR = 'instructor', // Course instructor
  FARMER = 'farmer',     // Registered farmer
  USER = 'user'          // Regular user
}
```

### Protected Routes

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
```

### Role-Based Access

```vue
<template>
  <div v-if="isAdmin">
    <!-- Admin-only content -->
  </div>
</template>

<script setup>
const { profile } = useProfile()
const isAdmin = computed(() => profile.value?.role === 'admin')
</script>
```

---

## 📱 API Integration

### Supabase API

```typescript
// Fetch data from Supabase
const { data, error } = await supabase
  .from('news')
  .select('*')
  .eq('status', 'approved')
  .order('created_at', { ascending: false })
```

### OpenWeather API

```typescript
// Get weather data
const weather = await $fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=Yogyakarta&appid=${apiKey}`
)
```

### WhatsApp Integration

```typescript
// Redirect to WhatsApp
const contactSeller = (phone: string, message: string) => {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}
```

---

## 🧪 Testing

### Unit Testing (Coming Soon)
```bash
pnpm test
```

### E2E Testing (Coming Soon)
```bash
pnpm test:e2e
```

### Performance Testing
```bash
pnpm lighthouse
```

---

## 📊 Performance

### Lighthouse Scores (Target)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

### Optimization Techniques
- ✅ Image optimization dengan @nuxt/image
- ✅ Code splitting & lazy loading
- ✅ Critical CSS inlining
- ✅ Font optimization
- ✅ Static site generation
- ✅ CDN deployment (Netlify)

---

## 🤝 Contributing

Kami welcome contributions! Ikuti langkah berikut:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Contribution Guidelines
- Follow existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests untuk new features (jika applicable)
- Update documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

### Development Team

**Politeknik Pembangunan Pertanian Yogyakarta Magelang**

- 🎓 **Mahasiswa**: Tim developer berprestasi
- 👨‍🏫 **Dosen Pembimbing**: Mentor berpengalaman
- 🌾 **Kementerian Pertanian**: Institusi pembina

---

## 📞 Contact & Support

### Official Channels
- 🌐 **Website**: [jurutani.com](https://jurutani.com)
- 📧 **Email**: si.jurutani@gmail.com
- 📱 **WhatsApp**: +62 815 7552 5260
- 📍 **Alamat**: Jl. Kusumanegara No.2, Tahunan, Kec. Umbulharjo, Yogyakarta 55167

### Social Media
- **Instagram**: [@jurutani](https://instagram.com/jurutani)
- **Facebook**: [Juru Tani](https://facebook.com/jurutani)
- **Twitter**: [@jurutani](https://twitter.com/jurutani)

### Support
- 📖 [Dokumentasi Lengkap](https://jurutani.com/help-faqs)
- 💬 [Forum Komunitas](https://jurutani.com/discussions)
- 🐛 [Report Issues](https://github.com/your-repo/issues)

---

## 🙏 Acknowledgments

Terima kasih kepada:

- **Politeknik Pembangunan Pertanian Yogyakarta Magelang** - Institusi pengembang
- **Kementerian Pertanian RI** - Dukungan dan pembinaan
- **Komunitas Petani Indonesia** - Feedback dan testing
- **Open Source Community** - Framework dan tools yang digunakan

---

## 🗺️ Roadmap

### Version 2.0 (Q1 2026)
- [ ] Mobile app (Flutter/React Native)
- [ ] Offline mode support
- [ ] Machine learning recommendations
- [ ] Marketplace payment integration
- [ ] Video call consultation

### Version 2.1 (Q2 2026)
- [ ] Multi-language support (EN, ID)
- [ ] Advanced analytics dashboard
- [ ] IoT sensor integration
- [ ] Automated pest detection (AI)
- [ ] Blockchain traceability

### Future Enhancements
- [ ] Government subsidy integration
- [ ] Cooperative management system
- [ ] Supply chain tracking
- [ ] Crop insurance platform
- [ ] Farm management tools

---

<div align="center">

**Made with ❤️ by Politeknik Pembangunan Pertanian Yogyakarta Magelang**

**Empowering Indonesian Farmers Through Digital Innovation**

⭐ Star us on GitHub — it motivates us a lot!

[🌾 Visit Juru Tani](https://jurutani.com) | [📖 Documentation](https://jurutani.com/help-faqs) | [💬 Community](https://jurutani.com/discussions)

</div>
