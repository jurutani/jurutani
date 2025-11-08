# 🚀 SEO Optimization Guide - Juru Tani

Panduan lengkap optimasi SEO yang telah dilakukan pada platform Juru Tani Reborn.

---

## 📋 Daftar Isi
1. [Overview](#overview)
2. [File Utilities](#file-utilities)
3. [Halaman yang Dioptimasi](#halaman-yang-dioptimasi)
4. [Cara Menggunakan SEO Utils](#cara-menggunakan-seo-utils)
5. [Best Practices](#best-practices)
6. [Checklist Implementasi](#checklist-implementasi)

---

## Overview

SEO optimization dilakukan dengan membuat sistem yang **konsisten, reusable, dan mudah di-maintain** untuk semua halaman di Juru Tani.

### ✨ Komponen Utama:

1. **`app/utils/seo.ts`** - Utility functions untuk generate SEO meta tags
2. **`app/composables/head-and-meta.ts`** - Composable untuk head dan meta configuration
3. **Halaman-halaman yang diupdate** - Semua main pages dengan SEO optimization

### 🎯 Target Optimization:

- ✅ Meta tags lengkap (title, description, keywords, robots, viewport)
- ✅ Open Graph tags untuk social media (Facebook, WhatsApp, LinkedIn)
- ✅ Twitter Card tags untuk Twitter/X
- ✅ Canonical URLs
- ✅ Structured keywords per halaman
- ✅ Proper title formatting dengan separator
- ✅ Indonesian language support (id_ID)

---

## File Utilities

### `app/utils/seo.ts`

File utility yang berisi semua helper functions untuk SEO. **Jangan diedit langsung** - gunakan functions yang disediakan.

#### Interfaces & Types:

```typescript
export type OgType = 'website' | 'article' | 'book' | 'profile' | ...
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
```

#### Main Functions:

| Function | Deskripsi | Lokasi |
|----------|-----------|--------|
| `generateSeoMeta(options)` | Generate SEO meta dengan options custom | `lines 27-85` |
| `getPageSeoMeta(pageType)` | Get predefined SEO config per page type | `lines 87-200` |
| `getCanonicalUrl(path)` | Generate canonical URL | `lines 202-204` |
| `getOgImageUrl(customImage)` | Get OG image dengan fallback | `lines 206-208` |
| `useSeoOptimized(pageType)` | **[MAIN]** Hook untuk main pages | `lines 210-248` |
| `useSeoDetail(options)` | Hook untuk detail/dynamic pages | `lines 250-310` |
| `getAuthPageSeoMeta(pageType)` | Get SEO config untuk auth pages | `lines 312-370` |
| `useSeoAuth(pageType)` | **[MAIN]** Hook untuk auth pages | `lines 372-392` |

---

## Halaman yang Dioptimasi

### ✅ Main Pages (menggunakan `useSeoOptimized`)

```typescript
// pages/index.vue - Home
useSeoOptimized('home')

// pages/news.vue - Berita
useSeoOptimized('news')

// pages/courses.vue - Kursus
useSeoOptimized('courses')

// pages/discussions.vue - Forum
useSeoOptimized('discussions')

// pages/educations.vue - Edukasi
useSeoOptimized('educations')

// pages/markets.vue - Marketplace
useSeoOptimized('markets')

// pages/tools.vue - Alat
useSeoOptimized('tools')

// pages/about-us.vue - Tentang
useSeoOptimized('about')

// pages/contact-us.vue - Kontak
useSeoOptimized('contact')

// pages/help-faqs.vue - Bantuan
useSeoOptimized('help')

// pages/privacy-policy.vue - Privasi
useSeoOptimized('privacy')

// pages/terms.vue - Syarat
useSeoOptimized('terms')
```

### ✅ Auth Pages (menggunakan `useSeoAuth`)

```typescript
// pages/auth/login.vue
useSeoAuth('login')

// pages/auth/register.vue
useSeoAuth('register')

// pages/auth/forgot-password.vue
useSeoAuth('forgot-password')
```

### ✅ Protected Pages (untuk users yang login)

```typescript
// pages/security.vue
useSeoOptimized('security')

// pages/profile.vue
useSeoOptimized('profile')

// pages/setting.vue
useSeoOptimized('setting')

// pages/history.vue
useSeoOptimized('history')
```

---

## Cara Menggunakan SEO Utils

### 1️⃣ Untuk Main Pages

```vue
<script setup lang="ts">
// Gunakan useSeoOptimized dengan page type
useSeoOptimized('news')

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <!-- Your content here -->
</template>
```

**Supported page types:**
- `'home'` | `'news'` | `'courses'` | `'discussions'` | `'educations'` | `'markets'` | `'tools'`
- `'about'` | `'contact'` | `'help'` | `'terms'` | `'privacy'` | `'security'` | `'profile'` | `'history'` | `'setting'`

---

### 2️⃣ Untuk Detail/Dynamic Pages (News Article, Course Detail, etc.)

```vue
<script setup lang="ts">
const newsId = route.params.id
const news = ref(null)

// Saat data sudah loaded:
onMounted(async () => {
  // Fetch data
  const data = await fetchNews(newsId)
  news.value = data
  
  // Update SEO dengan data spesifik
  useSeoDetail({
    title: data.title,
    description: data.subtitle || data.content.substring(0, 160),
    keywords: ['berita pertanian', 'inovasi tani', data.category],
    image: data.image_url, // OG image untuk social share
    type: 'article'
  })
})
</script>

<template>
  <!-- Your content here -->
</template>
```

**Parameters:**
```typescript
{
  title: string          // Judul halaman
  description: string    // Deskripsi (meta + OG)
  keywords?: string[]    // Array keywords
  image?: string         // OG image URL
  url?: string          // Custom URL (default: current route)
  type?: OgType         // 'article' (default), 'website', dll
}
```

---

### 3️⃣ Untuk Auth Pages

```vue
<script setup lang="ts">
// Login page
useSeoAuth('login')

// Register page
useSeoAuth('register')

// Forgot password
useSeoAuth('forgot-password')

definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})
</script>
```

**Supported auth types:**
- `'login'` | `'register'` | `'forgot-password'` | `'reset-password'` | `'confirm-email'` | `'callback'`

---

### 4️⃣ Custom SEO (Advanced)

Jika perlu customization lebih lanjut:

```vue
<script setup lang="ts">
// Opsi 1: Extend dari existing
const seoMeta = useSeoOptimized('news')

// Kemudian update manual jika perlu
useSeoMeta({
  ...seoMeta,
  title: 'Custom Title Override'
})

// Opsi 2: Generate dari nol
useSeoMeta(generateSeoMeta({
  title: 'Custom Title',
  description: 'Custom Description',
  keywords: ['keyword1', 'keyword2'],
  ogImage: '/custom-image.jpg',
  robots: 'index, follow'
}))
</script>
```

---

## Best Practices

### ✅ DO's

1. **Gunakan `useSeoOptimized` atau `useSeoAuth`** untuk main pages
   ```vue
   useSeoOptimized('about')  ✅ BAIK
   ```

2. **Gunakan `useSeoDetail`** untuk dynamic/detail pages
   ```vue
   useSeoDetail({
     title: news.title,
     description: news.content
   })  ✅ BAIK
   ```

3. **Add meaningful keywords** di detail pages
   ```typescript
   keywords: ['berita pertanian', 'inovasi tani', 'polbangtan']  ✅ BAIK
   ```

4. **Provide OG images** untuk better social sharing
   ```typescript
   image: article.image_url  ✅ BAIK
   ```

5. **Follow naming convention**
   - Pages: `usePageNameSeo` atau gunakan page type string
   - Auth: `useSeoAuth('login')`

---

### ❌ DON'Ts

1. **JANGAN hardcode meta tags** berulang di setiap halaman
   ```vue
   useSeoMeta({...})  ❌ SALAH (kurang reusable)
   ```

2. **JANGAN lupa update robots** untuk protected pages
   ```typescript
   robots: 'noindex, follow'  ❌ untuk private pages harus ada
   ```

3. **JANGAN gunakan special characters** yang tidak di-escape di meta
   ```typescript
   description: 'Harga "Rp100.000" (diskon)' // ❌ bisa error
   description: 'Harga Rp100.000 diskon' // ✅ lebih aman
   ```

4. **JANGAN lupa canonical URLs** untuk duplicate content
   - Handled otomatis di `generateSeoMeta()` ✅

5. **JANGAN buat SEO config di file/folder berbeda**
   - Centralize di `app/utils/seo.ts` ✅

---

## Checklist Implementasi

### Phase 1: Core Setup ✅
- [x] Buat `app/utils/seo.ts` dengan semua utilities
- [x] Define types dan interfaces
- [x] Buat `getPageSeoMeta()` config
- [x] Buat hooks (`useSeoOptimized`, `useSeoAuth`, `useSeoDetail`)

### Phase 2: Main Pages ✅
- [x] `pages/index.vue` - Home
- [x] `pages/news.vue` - News
- [x] `pages/courses.vue` - Courses
- [x] `pages/discussions.vue` - Discussions
- [x] `pages/educations.vue` - Educations
- [x] `pages/markets.vue` - Markets
- [x] `pages/tools.vue` - Tools
- [x] `pages/about-us.vue` - About
- [x] `pages/contact-us.vue` - Contact
- [x] `pages/help-faqs.vue` - Help
- [x] `pages/privacy-policy.vue` - Privacy
- [x] `pages/terms.vue` - Terms

### Phase 3: Protected Pages ✅
- [x] `pages/security.vue` - Security (noindex)
- [x] `pages/profile.vue` - Profile (noindex)
- [x] `pages/setting.vue` - Settings (noindex)
- [x] `pages/history.vue` - History (noindex)

### Phase 4: Auth Pages ✅
- [x] `pages/auth/login.vue`
- [x] `pages/auth/register.vue`
- [x] `pages/auth/forgot-password.vue`
- [ ] `pages/auth/reset-password.vue` (TODO)
- [ ] `pages/auth/confirm-email.vue` (TODO)
- [ ] `pages/auth/callback.vue` (TODO)

### Phase 5: Dynamic Pages ⏳ (PENDING)
- [ ] `pages/news/[id].vue` - Gunakan `useSeoDetail` dengan data berita
- [ ] `pages/courses/[id].vue` - Gunakan `useSeoDetail` dengan data course
- [ ] `pages/educations/[id].vue` - Gunakan `useSeoDetail`
- [ ] `pages/markets/[id].vue` - Gunakan `useSeoDetail`
- [ ] `pages/discussions/*/[id].vue` - Gunakan `useSeoDetail`

---

## SEO Meta Tags Included

Setiap halaman sekarang memiliki:

### Basic Meta Tags
```html
<title>Halaman - Juru Tani Reborn | Solusi Pertanian</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta name="author" content="Politeknik Pembangunan Pertanian Yogyakarta Magelang">
<meta name="robots" content="index, follow">
```

### Open Graph (Social Media)
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Juru Tani Reborn">
<meta property="og:locale" content="id_ID">
```

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@jurutani">
<meta name="twitter:creator" content="@jurutani">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

---

## Testing SEO

### 1. Check Meta Tags
```bash
# Inspect di Chrome DevTools > Elements > <head>
# Atau view page source (Ctrl+U)
```

### 2. Test Social Preview
- **Facebook:** https://developers.facebook.com/tools/debug/
- **Twitter:** https://cards-dev.twitter.com/validator
- **LinkedIn:** https://www.linkedin.com/post-inspector/inspect/

### 3. Test Structured Data
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org Validator:** https://validator.schema.org/

### 4. SEO Tools
- **Google Search Console:** https://search.google.com/search-console
- **Google PageSpeed:** https://pagespeed.web.dev/
- **Lighthouse:** Chrome DevTools > Lighthouse
- **GTmetrix:** https://gtmetrix.com/

---

## Next Steps (Recommendations)

### 🔄 Short Term
1. ✅ Implement dynamic SEO untuk halaman detail (`pages/*/[id].vue`)
2. ⏳ Add Breadcrumb Schema.org markup
3. ⏳ Test dengan Google Search Console

### 📈 Medium Term
1. ⏳ Create XML sitemap
2. ⏳ Setup robots.txt properly
3. ⏳ Implement image optimization
4. ⏳ Add structured data untuk Article, Course, etc.

### 🚀 Long Term
1. ⏳ SEO monitoring dashboard
2. ⏳ A/B testing untuk titles/descriptions
3. ⏳ Internal linking strategy
4. ⏳ Backlink building campaign

---

## Support & Questions

Untuk pertanyaan atau issues terkait SEO:
1. Check file ini terlebih dahulu
2. Review `app/utils/seo.ts` untuk functions yang tersedia
3. Lihat contoh implementasi di halaman-halaman yang sudah diupdate

---

**Last Updated:** November 8, 2025  
**Author:** SEO Optimization Task  
**Status:** ✅ Main Implementation Complete
