# 📊 Food Prices History - SQL Insert Scripts

## 📋 Overview

SQL scripts untuk menambahkan data historis harga pangan dari **29 Januari 2026** sampai **12 Februari 2026**.

**Total Data:** 100 record harga
- 24 komoditas × 4 tanggal (Feb 2, 5, 9, 12) = 96 records
- 4 komoditas × 1 tanggal (Jan 29) = 4 records

---

## 📁 Files Created

### 1. `food_prices_insert_feb_2026.sql`
- **Lokasi:** Root project
- **Tujuan:** Standalone SQL file untuk insert manual
- **Fitur:** 
  - Insert data ke tabel `food_prices`
  - ON CONFLICT untuk update jika data sudah ada
  - Verification queries
  - Summary report

### 2. `supabase/migrations/008_add_food_prices_history_february.sql`
- **Lokasi:** `supabase/migrations/`
- **Tujuan:** Migration file untuk Supabase
- **Fitur:**
  - Mengikuti naming convention project (008)
  - Auto-run saat migration
  - Comprehensive logging

---

## 🏗️ Database Structure

### Table: `foods`
```sql
- id (UUID)
- name (VARCHAR) - Nama komoditas
- category (VARCHAR) - Kategori: 'hortikultura', 'perkebunan', 'peternakan'
- satuan (VARCHAR) - Unit: 'kg', 'liter'
- description (TEXT)
- tags (ARRAY)
```

### Table: `food_prices`
```sql
- id (UUID)
- food_id (UUID FK) - Foreign key ke foods.id
- price (INTEGER) - Harga dalam rupiah
- date (DATE) - Tanggal harga
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- deleted_at (TIMESTAMP) - Soft delete

CONSTRAINT: UNIQUE (food_id, date) WHERE deleted_at IS NULL
```

---

## 🎯 Commodity Mapping

### Hortikultura (Sayuran & Bumbu) - 13 items
- Bawang Merah
- Bawang Putih Bonggol
- Cabe Merah Keriting
- Cabe Merah Besar
- Cabe Rawit Merah
- Sawi Putih
- Pakcoy
- Wortel
- Brokoli
- Kacang Panjang
- Terong
- Timun
- Tomat

### Perkebunan (Tanaman Pangan) - 8 items
- Beras Medium
- Beras Premium
- Beras SPHP (Bulog)
- Gula Pasir Konsumsi
- Minyak Goreng Kemasan Premium
- Jagung Pipilan Kering
- Kedelai Biji Kering Impor
- Tepung Terigu Kemasan

### Peternakan (Protein Hewani) - 3 items
- Daging Ayam Ras
- Telur Ayam Ras
- Daging Sapi Murni

---

## 🚀 How to Use

### Option 1: Manual Insert (Standalone SQL)

```bash
# Connect to your database and run:
psql -U your_user -d your_database -f food_prices_insert_feb_2026.sql
```

**Atau via Supabase SQL Editor:**
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Menu: SQL Editor
4. Copy-paste isi file `food_prices_insert_feb_2026.sql`
5. Run query

### Option 2: Migration (Recommended)

```bash
# Via Supabase CLI
supabase db push

# Atau jika sudah ada Supabase Link
supabase migration up
```

---

## ✅ Features

### 1. **Smart Conflict Handling**
```sql
ON CONFLICT (food_id, date) WHERE deleted_at IS NULL DO UPDATE
SET price = EXCLUDED.price, updated_at = NOW();
```
- Jika data `(komoditas, tanggal)` sudah ada → **UPDATE** harga
- Jika belum ada → **INSERT** data baru
- Otomatis update `updated_at` timestamp

### 2. **Automatic Food ID Resolution**
```sql
INNER JOIN public.foods f ON f.name = p.commodity
```
- Tidak perlu tahu `food_id` manual
- Script otomatis cari ID berdasarkan nama komoditas
- Jika komoditas belum ada di tabel `foods`, insert akan diabaikan

### 3. **Verification & Summary**
Setiap script include:
- Count total records
- Count per tanggal
- Summary report di console
- Sample query untuk cek hasil

---

## 📊 Data Breakdown

### 2026-02-12 (24 commodities)
- **Produk Termahal:** Daging Sapi Murni (Rp 138.824/kg)
- **Produk Termurah:** Terong (Rp 6.000/kg)
- **Cabe Rawit Merah:** Rp 84.000/kg (naik dari 78.652)

### 2026-02-09 (24 commodities)
- Cabe Rawit Merah: Rp 78.652/kg
- Daging Sapi Murni: Rp 138.824/kg

### 2026-02-05 (24 commodities)
- Cabe Rawit Merah: Rp 75.478/kg
- Daging Ayam Ras turun: Rp 37.000/kg

### 2026-02-02 (24 commodities)
- Cabe Rawit Merah: Rp 62.158/kg
- Daging Ayam Ras: Rp 35.722/kg

### 2026-01-29 (4 commodities)
- Data partial untuk 4 komoditas utama

---

## 🔍 Verification Queries

### Check inserted data:
```sql
-- Total harga per tanggal
SELECT 
  date, 
  COUNT(*) as total_items,
  AVG(price) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM public.food_prices
WHERE date BETWEEN '2026-01-29' AND '2026-02-12'
  AND deleted_at IS NULL
GROUP BY date
ORDER BY date DESC;
```

### Check specific commodity trend:
```sql
SELECT 
  f.name,
  fp.price,
  fp.date
FROM public.food_prices fp
INNER JOIN public.foods f ON f.id = fp.food_id
WHERE f.name = 'Cabe Rawit Merah'
  AND fp.deleted_at IS NULL
ORDER BY fp.date DESC;
```

### Price change analysis:
```sql
WITH price_history AS (
  SELECT 
    f.name,
    fp.price,
    fp.date,
    LAG(fp.price) OVER (PARTITION BY f.id ORDER BY fp.date) as prev_price
  FROM public.food_prices fp
  INNER JOIN public.foods f ON f.id = fp.food_id
  WHERE fp.deleted_at IS NULL
    AND fp.date BETWEEN '2026-01-29' AND '2026-02-12'
)
SELECT 
  name,
  date,
  price,
  prev_price,
  price - prev_price as price_change,
  ROUND(((price - prev_price)::NUMERIC / prev_price * 100), 2) as change_percent
FROM price_history
WHERE prev_price IS NOT NULL
ORDER BY ABS(price - prev_price) DESC
LIMIT 10;
```

---

## ⚠️ Important Notes

1. **Prerequisites:**
   - Tabel `foods` harus sudah ada dan terisi dengan komoditas yang sesuai
   - Jika ada komoditas yang belum ada di tabel `foods`, insert akan **gagal** untuk item tersebut
   - Run migration `007_add_new_commodities_and_prices.sql` terlebih dahulu jika belum

2. **Commodity Names Must Match Exactly:**
   ```
   ✅ "Minyak Goreng Kemasan Premium" (match)
   ❌ "Minyak Goreng Kemasan" (tidak match)
   
   ✅ "Kedelai Biji Kering Impor" (match)
   ❌ "Kedelai Biji Kering (Impor)" (tidak match - ada tanda kurung)
   ```

3. **Soft Delete Handling:**
   - Script hanya update/insert data yang `deleted_at IS NULL`
   - Data yang sudah di-soft delete tidak akan terpengaruh

4. **Timezone:**
   - Semua timestamp menggunakan `TIMESTAMP WITH TIME ZONE`
   - Default timezone: UTC

---

## 🔄 Update Process

Jika ada komoditas yang **nama-nya tidak match**:

### Check existing commodity names:
```sql
SELECT id, name, category 
FROM public.foods 
WHERE deleted_at IS NULL
ORDER BY name;
```

### Update commodity name if needed:
```sql
-- Contoh: Jika nama di database berbeda
UPDATE public.foods 
SET name = 'Kedelai Biji Kering Impor'
WHERE name = 'Kedelai Biji Kering (Impor)'
  AND deleted_at IS NULL;
```

---

## 📈 Next Steps

Setelah insert data, Anda dapat:

1. **View di Frontend:**
   - Halaman Food Prices akan otomatis show data terbaru
   - Chart akan update dengan price trends

2. **Use RPC Functions:**
   ```sql
   -- Get latest price
   SELECT * FROM get_latest_food_price('Cabe Rawit Merah');
   
   -- Get price trend
   SELECT * FROM get_food_price_trend('Cabe Rawit Merah', 30);
   ```

3. **API Endpoint:**
   ```typescript
   // In your Nuxt app
   const { data } = await $fetch('/api/food-prices', {
     query: {
       date: '2026-02-12',
       category: 'hortikultura'
     }
   })
   ```

---

## 📚 Related Documentation

- [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) - Complete database schema
- [FOOD_PRICES_REFERENCE.md](./docs/FOOD_PRICES_REFERENCE.md) - Food prices API reference
- [Migration 007](./supabase/migrations/007_add_new_commodities_and_prices.sql) - Previous migration

---

## ✨ Summary

**Created:** 2 SQL files
- `food_prices_insert_feb_2026.sql` - Standalone insert script
- `supabase/migrations/008_add_food_prices_history_february.sql` - Migration file

**Total Records:** 100 price entries
**Date Range:** 2026-01-29 to 2026-02-12
**Commodities:** 24 items

**Key Features:**
✅ Auto-resolve food IDs
✅ Smart conflict handling (update if exists)
✅ Comprehensive verification
✅ Detailed logging

---

**Ready to run!** 🚀
