# Migration Guide - News Updated

## Persiapan

**Bucket Storage sudah ada:**
- ✅ `news-images` (sudah dibuat sebelumnya)
- ✅ `news-attachments` (sudah dibuat sebelumnya)

**Tidak perlu membuat bucket lagi!** Kita akan reuse bucket yang sudah ada.

## Cara Running Migration

### Via Supabase Dashboard (Recommended):

1. Buka Supabase Dashboard → SQL Editor
2. Copy paste SQL dari file `supabase/migrations/003_create_news_updated.sql`
3. Klik "Run"

### Via Supabase CLI:

```bash
# Pastikan sudah di root project
cd C:\KAIRAV\project\jurutanibackup

# Jalankan migration
supabase db push
```

## Verifikasi Setelah Migration

Jalankan query ini untuk verify:

```sql
-- 1. Cek table news_updated sudah ada
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'news_updated';

-- 2. Cek struktur table
\d news_updated

-- 3. Cek policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'news_updated';

-- 4. Cek indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'news_updated';

-- 5. Verify buckets sudah ada (tidak perlu create)
SELECT id, name, public 
FROM storage.buckets 
WHERE id IN ('news-images', 'news-attachments');
```

Expected output untuk bucket:
```
id                | name             | public
------------------+------------------+--------
news-images       | news-images      | true
news-attachments  | news-attachments | true
```

## Jika Ada Error

### Error: "duplicate key value violates unique constraint"

**Penyebab:** Table atau constraint sudah ada.

**Solusi:** 

```sql
-- Cek apakah table sudah ada
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'news_updated'
);

-- Jika TRUE (sudah ada), drop dulu kalau mau recreate
-- HATI-HATI: Ini akan hapus data!
DROP TABLE IF EXISTS public.news_updated CASCADE;

-- Lalu run migration lagi
```

### Error: "bucket already exists"

**Penyebab:** Mencoba create bucket yang sudah ada.

**Solusi:** Tidak perlu create bucket! Migration file sudah benar, bucket sudah ada dan siap dipakai.

## Struktur Table news_updated

```sql
- id: uuid (PK)
- title: text (NOT NULL)
- sub_title: text
- content: jsonb (TipTap JSON format)
- category: text (NOT NULL)
- link: text
- status_news: text ('pending' | 'approved' | 'rejected')
- cover_image: text (path ke gambar utama)
- images: jsonb array (paths ke galeri foto)
- attachments: jsonb array (objects dengan name, url, size, type)
- slug: text (UNIQUE)
- user_id: uuid (FK ke profiles)
- created_at: timestamptz
- updated_at: timestamptz
- published_at: timestamptz
- deleted_at: timestamptz
```

## Testing After Migration

1. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

2. Buka `/update` - List page
3. Buka `/update/create` - Create form (harus login)
4. Test create news dengan:
   - Rich text editor
   - Upload cover image
   - Upload galeri (multiple images)
   - Upload attachments (PDF/DOC)

## Rollback (jika diperlukan)

```sql
-- Drop table news_updated
DROP TABLE IF EXISTS public.news_updated CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_news_updated_timestamp();

-- Note: Bucket tetap dipertahankan karena digunakan bersama dengan table news lama
```
