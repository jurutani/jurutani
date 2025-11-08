# 🎯 SEO Optimization - Quick Reference

**File:** `app/utils/seo.ts` - Central SEO configuration

---

## 🚀 Quick Start

### Untuk Main Pages
```typescript
// pages/[page-name].vue
useSeoOptimized('page_type')  // e.g., 'home', 'news', 'about'
```

### Untuk Detail Pages  
```typescript
// pages/news/[id].vue
useSeoDetail({
  title: 'Article Title',
  description: 'Short description',
  keywords: ['keyword1', 'keyword2'],
  image: 'article_image_url'
})
```

### Untuk Auth Pages
```typescript
// pages/auth/login.vue
useSeoAuth('login')  // or 'register', 'forgot-password'
```

---

## 📋 Page Types Available

### Main Pages (useSeoOptimized)
```
'home' | 'news' | 'courses' | 'discussions' | 'educations' 
'markets' | 'tools' | 'about' | 'contact' | 'help'
'terms' | 'privacy' | 'security' | 'profile' | 'history' | 'setting'
```

### Auth Pages (useSeoAuth)
```
'login' | 'register' | 'forgot-password' | 'reset-password' 
'confirm-email' | 'callback'
```

---

## ✅ Already Optimized Pages

### Main Pages
- ✅ `pages/index.vue`
- ✅ `pages/news.vue`
- ✅ `pages/courses.vue`
- ✅ `pages/discussions.vue`
- ✅ `pages/educations.vue`
- ✅ `pages/markets.vue`
- ✅ `pages/tools.vue`
- ✅ `pages/about-us.vue`
- ✅ `pages/contact-us.vue`
- ✅ `pages/help-faqs.vue`
- ✅ `pages/privacy-policy.vue`
- ✅ `pages/terms.vue`
- ✅ `pages/security.vue`
- ✅ `pages/profile.vue`
- ✅ `pages/setting.vue`
- ✅ `pages/history.vue`

### Auth Pages
- ✅ `pages/auth/login.vue`
- ✅ `pages/auth/register.vue`
- ✅ `pages/auth/forgot-password.vue`

---

## 🔧 Each Page Includes

- ✅ Title with separator (title | Juru Tani)
- ✅ Meta description (160 chars optimal)
- ✅ Keywords (3-5 relevant keywords)
- ✅ Open Graph tags (Facebook, LinkedIn, WhatsApp)
- ✅ Twitter Card tags (Twitter/X)
- ✅ Author & Robots meta
- ✅ Canonical URL
- ✅ OG Image for social sharing
- ✅ Locale (id_ID for Indonesia)

---

## 📝 Example: Adding SEO to New Page

### Before (Manual/Verbose)
```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Page Title - Juru Tani Reborn',
  description: 'Description here...',
  keywords: 'kw1, kw2, kw3',
  ogTitle: 'Page Title - Juru Tani Reborn',
  ogDescription: 'Description here...',
  ogImage: 'https://jurutani.com/image.png',
  twitterCard: 'summary_large_image',
  // ... 10 more lines
})
</script>
```

### After (Clean & Reusable)
```vue
<script setup lang="ts">
useSeoOptimized('about')
</script>
```

---

## 🎓 For Dynamic/Detail Pages

```vue
<script setup lang="ts">
const article = ref(null)

onMounted(async () => {
  article.value = await fetchArticle(id)
  
  useSeoDetail({
    title: article.value.title,
    description: article.value.summary,
    keywords: article.value.tags,
    image: article.value.featured_image,
    type: 'article'
  })
})
</script>
```

**Note:** Implement this untuk `pages/news/[id].vue`, `pages/courses/[id].vue`, dll

---

## 📊 SEO Keywords by Page

| Page | Main Keywords |
|------|---------------|
| Home | juru tani, pertanian digital, inovasi pertanian, polbangtan |
| News | berita pertanian, inovasi tani, kabar tani, agribisnis |
| Courses | kursus pertanian, pelatihan, edukasi petani |
| Discussions | forum pertanian, diskusi tani, komunitas petani |
| Educations | edukasi pertanian, panduan pertanian, tips bertani |
| Markets | marketplace pertanian, jual beli, supplier |
| Tools | alat pertanian, kalkulator, aplikasi pertanian |
| About | visi misi, tentang juru tani, polbangtan yogyakarta |
| Contact | hubungi, kontak, customer service |
| Help | FAQ, bantuan, panduan penggunaan |

---

## 🔐 Protected Pages (noindex)
Pages yang tidak boleh diindex oleh search engine:
- `pages/security.vue` → `robots: 'noindex, follow'`
- `pages/profile.vue` → `robots: 'noindex, follow'`
- `pages/setting.vue` → `robots: 'noindex, follow'`
- `pages/history.vue` → `robots: 'noindex, follow'`

---

## 🧪 Quick Test

Open Chrome DevTools:
1. **Elements** tab → Check `<head>` for meta tags
2. **Network** tab → Search for `og:title`, `twitter:card`
3. Or right-click → **View Page Source** → Search `<meta`

Expected to see:
```html
<title>Page Title | Juru Tani Reborn</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta property="og:title" content="...">
<meta name="twitter:card" content="summary_large_image">
```

---

## 💡 Tips

1. **Don't repeat keywords** - Already included in default SEO
2. **Use Indonesian text** - All descriptions in Bahasa Indonesia
3. **Keep titles < 60 chars** - Better for search results
4. **Descriptions < 160 chars** - Full preview in search results
5. **Add 3-5 keywords** - For detail/dynamic pages

---

## 📚 Full Documentation

See `SEO_OPTIMIZATION_GUIDE.md` for detailed information.

