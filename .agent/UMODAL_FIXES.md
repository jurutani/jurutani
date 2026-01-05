# Perbaikan UModal Nuxt UI 4 - Juru Tani

## Ringkasan Perbaikan

Telah dilakukan perbaikan pada seluruh penggunaan komponen `UModal` di aplikasi Juru Tani untuk memastikan kompatibilitas penuh dengan Nuxt UI 4.

## Komponen yang Diperbaiki

### 1. ✅ FirstVisitModal.vue
**Lokasi:** `app/components/FirstVisitModal/FirstVisitModal.vue`

**Perubahan:**
- Menggunakan struktur slot yang tepat: `#header`, `#body`, `#footer`
- Memindahkan logo ke header slot
- Memindahkan konten utama ke body slot
- Memindahkan tombol aksi ke footer slot
- Menghapus tombol close absolut (sudah ditangani oleh UModal secara otomatis)

**Struktur Baru:**
```vue
<UModal v-model:open="isOpen" :close="false">
  <template #header>
    <!-- Logo -->
  </template>
  
  <template #body>
    <!-- Konten welcome message, sponsor, dll -->
  </template>
  
  <template #footer>
    <!-- Tombol "Masuk ke Beranda" -->
  </template>
</UModal>
```

### 2. ✅ News/Modal/Form.vue
**Lokasi:** `app/components/News/Modal/Form.vue`

**Perubahan:**
- Menambahkan `id="news-form"` pada UForm
- Memindahkan UForm ke dalam `#body` slot
- Menghubungkan tombol submit dengan form menggunakan atribut `form="news-form"`
- Menghapus padding `p-6` dari UForm (sudah ditangani oleh UModal)

**Struktur Baru:**
```vue
<UModal :close="{ onClick: () => emit('close') }" title="..." description="...">
  <template #body>
    <UForm id="news-form" :schema="schema" :state="state" @submit="onSubmit">
      <!-- Form fields -->
    </UForm>
  </template>
  
  <template #footer>
    <UButton type="submit" form="news-form">Simpan</UButton>
  </template>
</UModal>
```

### 3. ✅ Product/Modal/Form.vue
**Lokasi:** `app/components/Product/Modal/Form.vue`

**Perubahan:**
- Sama seperti News/Modal/Form.vue
- Menambahkan `id="product-form"` pada UForm
- Memindahkan UForm ke dalam `#body` slot
- Menghubungkan tombol submit dengan form menggunakan atribut `form="product-form"`

### 4. ✅ Chat/NewChatModal.vue
**Lokasi:** `app/components/Chat/NewChatModal.vue`

**Status:** Sudah benar ✓
- Menggunakan `:close="{ onClick: () => emit('close') }"`
- Tidak menggunakan v-model:open (karena controlled dari parent)
- Struktur slot sudah tepat

### 5. ✅ Chat/DeleteConfirmModal.vue
**Lokasi:** `app/components/Chat/DeleteConfirmModal.vue`

**Status:** Sudah benar ✓
- Menggunakan `v-model:open` dengan computed property
- Struktur slot `#header`, `#body`, `#footer` sudah tepat
- Props dan emits sudah sesuai

### 6. ✅ Chat/ConversationItem.vue
**Lokasi:** `app/components/Chat/ConversationItem.vue`

**Status:** Sudah benar ✓
- Menggunakan `v-model:open="showDeleteConfirm"`
- Struktur slot sudah tepat
- Modal konfirmasi delete sudah sesuai

### 7. ✅ room-chat/[id].vue
**Lokasi:** `app/pages/room-chat/[id].vue`

**Status:** Sudah benar ✓
- Image Preview Modal: menggunakan `v-model:open` dengan struktur slot yang tepat
- Delete Confirmation Modal: menggunakan komponen `ChatDeleteConfirmModal`
- Clear Confirmation Modal: menggunakan komponen `ChatDeleteConfirmModal`

### 8. ✅ room-chat/admin/[id].vue
**Lokasi:** `app/pages/room-chat/admin/[id].vue`

**Status:** Sudah benar ✓
- Semua modal menggunakan `v-model:open` dengan struktur slot yang tepat
- Image Preview Modal, Delete Message Modal, Clear Conversation Modal sudah sesuai

## Best Practices Nuxt UI 4 Modal

### 1. Penggunaan v-model:open
```vue
<script setup>
const isOpen = ref(false)
</script>

<template>
  <UModal v-model:open="isOpen">
    <!-- content -->
  </UModal>
</template>
```

### 2. Penggunaan :close prop
```vue
<UModal :close="{ onClick: () => emit('close') }">
  <!-- content -->
</UModal>
```

### 3. Struktur Slot yang Benar
```vue
<UModal v-model:open="isOpen">
  <template #header>
    <!-- Header content -->
  </template>
  
  <template #body>
    <!-- Main content -->
  </template>
  
  <template #footer>
    <!-- Footer actions -->
  </template>
</UModal>
```

### 4. Form dalam Modal
```vue
<UModal>
  <template #body>
    <UForm id="my-form" @submit="onSubmit">
      <!-- fields -->
    </UForm>
  </template>
  
  <template #footer>
    <UButton type="submit" form="my-form">Submit</UButton>
  </template>
</UModal>
```

## Catatan Penting

1. **Padding**: UModal secara otomatis menambahkan padding pada body, jadi tidak perlu menambahkan class `p-6` pada konten di dalam body slot.

2. **Form Submission**: Untuk form yang berada di dalam modal dengan footer terpisah, gunakan atribut `id` pada UForm dan `form` pada button submit.

3. **Close Button**: UModal secara otomatis menambahkan tombol close di pojok kanan atas, kecuali jika `:close="false"` diset.

4. **Controlled vs Uncontrolled**: 
   - Gunakan `v-model:open` untuk modal yang dikelola oleh komponen itu sendiri
   - Gunakan `:close` prop dengan emit untuk modal yang dikelola oleh parent

## Hasil

Semua modal di aplikasi Juru Tani sekarang mengikuti best practices Nuxt UI 4 dan berfungsi dengan baik.

## Perbaikan Tambahan

### app.vue
**Masalah:** Error `Failed to load url /components/App/Modal.vue`

**Solusi:** Menghapus referensi `<AppModal />` dari `app.vue` karena:
- Komponen tersebut tidak ada
- Nuxt UI 4 menggunakan `useOverlay` yang tidak memerlukan komponen modal global
- Modal sekarang dibuat secara programmatic menggunakan `useJuruTaniModal` composable

**File yang diubah:**
```vue
<!-- app.vue - SEBELUM -->
<template>
  <NuxtLoadingIndicator />
  <FirstVisitModal />
  <AppModal />  <!-- ❌ Tidak ada -->
  <AppToast />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<!-- app.vue - SESUDAH -->
<template>
  <NuxtLoadingIndicator />
  <FirstVisitModal />
  <AppToast />  <!-- ✅ AppModal dihapus -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### useJuruTaniModal.ts
**Masalah:** Error `Importing directly from module entry-points is not allowed`

**Solusi:** Menghapus explicit import `useOverlay` dari `@nuxt/ui` karena:
- Nuxt UI 4 auto-imports semua composables termasuk `useOverlay`
- Import langsung dari module entry-points tidak diperbolehkan di Nuxt
- Auto-import adalah cara yang benar di Nuxt 3/4

**File yang diubah:**
```typescript
// useJuruTaniModal.ts - SEBELUM (❌ Error)
import { useOverlay } from '@nuxt/ui'  // ❌ Tidak diperbolehkan

export const useJuruTaniModal = () => {
  const overlay = useOverlay()
  // ...
}

// useJuruTaniModal.ts - SESUDAH (✅ Fixed)
// No import needed - auto-imported by Nuxt UI 4 ✅

export const useJuruTaniModal = () => {
  const overlay = useOverlay()  // ✅ Auto-imported
  // ...
}
```

### useFileUpload.ts (Duplicated Import)
**Masalah:** Warning `Duplicated imports "useFileUpload"`

**Penyebab:** Konflik nama antara local composable `app/composables/useFileUpload.ts` dengan composable bawaan/internal dari `@nuxt/ui` (Nuxt UI 4).

**Solusi:**
1. Merename file `useFileUpload.ts` menjadi `useAppFileUpload.ts`
2. Merename exported composable menjadi `useAppFileUpload`
3. Mengupdate component yang menggunakannya (`News/Modal/Form.vue` dan `Product/Modal/Form.vue`)

**File yang diubah:**
- `app/composables/useAppFileUpload.ts` (Renamed & Updated)
- `app/components/News/Modal/Form.vue` (Updated import)
- `app/components/Product/Modal/Form.vue` (Updated import)

## Catatan TypeScript Errors

Ada beberapa TypeScript errors terkait Supabase insert operations di:
- `News/Modal/Form.vue` (line 159)
- `Product/Modal/Form.vue` (line 157)

Errors ini terkait dengan type inference Supabase dan bukan masalah dengan UModal. Ini adalah issue terpisah yang mungkin perlu diperbaiki dengan:
1. Menambahkan type definitions untuk Supabase tables
2. Menggunakan type assertion jika diperlukan
3. Update Supabase client types
