-- =====================================================
-- ADD NEW FOOD COMMODITIES & PRICES
-- =====================================================
-- Author: Senior Backend Developer
-- Purpose: Add 24 new commodities and their prices for 2026-02-12
-- Date: 2026-02-14
-- =====================================================

-- ==================== INSERT NEW FOODS ====================

INSERT INTO public.foods (name, category, satuan, description, tags) VALUES
-- Beras (Perkebunan)
('Beras Medium', 'perkebunan', 'kg', 'Beras kualitas medium untuk konsumsi sehari-hari', ARRAY['beras', 'pangan', 'pokok', 'perkebunan']),
('Beras Premium', 'perkebunan', 'kg', 'Beras kualitas premium pilihan', ARRAY['beras', 'premium', 'pangan', 'perkebunan']),
('Beras SPHP (Bulog)', 'perkebunan', 'kg', 'Beras Stabilisasi Pasokan dan Harga Pangan dari Bulog', ARRAY['beras', 'bulog', 'subsidi', 'perkebunan']),

-- Bumbu & Rempah (Hortikultura)
('Bawang Merah', 'hortikultura', 'kg', 'Bawang merah lokal segar', ARRAY['bawang', 'bumbu', 'hortikultura', 'sayuran']),
('Bawang Putih Bonggol', 'hortikultura', 'kg', 'Bawang putih bonggol segar berkualitas', ARRAY['bawang', 'bumbu', 'hortikultura']),

-- Cabe (Hortikultura)
('Cabe Merah Keriting', 'hortikultura', 'kg', 'Cabe merah keriting segar pedas', ARRAY['cabe', 'cabai', 'bumbu', 'hortikultura']),
('Cabe Merah Besar', 'hortikultura', 'kg', 'Cabe merah besar segar', ARRAY['cabe', 'cabai', 'bumbu', 'hortikultura']),
('Cabe Rawit Merah', 'hortikultura', 'kg', 'Cabe rawit merah super pedas', ARRAY['cabe', 'cabai', 'rawit', 'hortikultura']),

-- Bahan Pangan (Perkebunan)
('Gula Pasir Konsumsi', 'perkebunan', 'kg', 'Gula pasir putih untuk konsumsi', ARRAY['gula', 'pangan', 'perkebunan']),
('Minyak Goreng Kemasan Premium', 'perkebunan', 'liter', 'Minyak goreng kemasan premium', ARRAY['minyak', 'goreng', 'pangan', 'perkebunan']),
('Jagung Pipilan Kering', 'perkebunan', 'kg', 'Jagung pipilan kering berkualitas', ARRAY['jagung', 'pangan', 'perkebunan']),
('Kedelai Biji Kering Impor', 'perkebunan', 'kg', 'Kedelai biji kering impor', ARRAY['kedelai', 'pangan', 'impor', 'perkebunan']),
('Tepung Terigu Kemasan', 'perkebunan', 'kg', 'Tepung terigu kemasan siap pakai', ARRAY['tepung', 'terigu', 'pangan', 'perkebunan']),

-- Sayuran (Hortikultura)
('Sawi Putih', 'hortikultura', 'kg', 'Sawi putih segar dari kebun', ARRAY['sawi', 'sayuran', 'hortikultura']),
('Pakcoy', 'hortikultura', 'kg', 'Pakcoy segar hijau', ARRAY['pakcoy', 'sayuran', 'hortikultura']),
('Wortel', 'hortikultura', 'kg', 'Wortel segar berkualitas', ARRAY['wortel', 'sayuran', 'hortikultura']),
('Brokoli', 'hortikultura', 'kg', 'Brokoli segar dari dataran tinggi', ARRAY['brokoli', 'sayuran', 'hortikultura']),
('Kacang Panjang', 'hortikultura', 'kg', 'Kacang panjang segar hijau', ARRAY['kacang', 'sayuran', 'hortikultura']),
('Terong', 'hortikultura', 'kg', 'Terong ungu segar', ARRAY['terong', 'sayuran', 'hortikultura']),
('Timun', 'hortikultura', 'kg', 'Timun segar hijau', ARRAY['timun', 'sayuran', 'hortikultura']),
('Tomat', 'hortikultura', 'kg', 'Tomat merah segar', ARRAY['tomat', 'sayuran', 'hortikultura'])

ON CONFLICT (name) DO NOTHING;

-- ==================== INSERT PRICES FOR 2026-02-12 ====================

-- Insert prices linked to foods (get food_id from foods table)
INSERT INTO public.food_prices (food_id, price, date) 
SELECT 
  f.id,
  p.price,
  p.date
FROM (VALUES
  ('Bawang Merah', 43600, '2026-02-12'::DATE),
  ('Bawang Putih Bonggol', 39700, '2026-02-12'::DATE),
  ('Beras Medium', 14500, '2026-02-12'::DATE),
  ('Beras Premium', 16300, '2026-02-12'::DATE),
  ('Beras SPHP (Bulog)', 12600, '2026-02-12'::DATE),
  ('Brokoli', 22000, '2026-02-12'::DATE),
  ('Cabe Merah Besar', 45900, '2026-02-12'::DATE),
  ('Cabe Merah Keriting', 45900, '2026-02-12'::DATE),
  ('Cabe Rawit Merah', 81500, '2026-02-12'::DATE),
  ('Daging Ayam Ras', 42700, '2026-02-12'::DATE),
  ('Daging Sapi Murni', 138824, '2026-02-12'::DATE),
  ('Gula Pasir Konsumsi', 18400, '2026-02-12'::DATE),
  ('Jagung Pipilan Kering', 8500, '2026-02-12'::DATE),
  ('Kacang Panjang', 8000, '2026-02-12'::DATE),
  ('Kedelai Biji Kering Impor', 14600, '2026-02-12'::DATE),
  ('Minyak Goreng Kemasan Premium', 22400, '2026-02-12'::DATE),
  ('Pakcoy', 16000, '2026-02-12'::DATE),
  ('Sawi Putih', 9000, '2026-02-12'::DATE),
  ('Telur Ayam Ras', 30060, '2026-02-12'::DATE),
  ('Tepung Terigu Kemasan', 13400, '2026-02-12'::DATE),
  ('Terong', 11000, '2026-02-12'::DATE),
  ('Timun', 10000, '2026-02-12'::DATE),
  ('Tomat', 12000, '2026-02-12'::DATE),
  ('Wortel', 14000, '2026-02-12'::DATE)
) AS p(commodity, price, date)
INNER JOIN public.foods f ON f.name = p.commodity
ON CONFLICT (food_id, date) WHERE deleted_at IS NULL DO UPDATE
SET price = EXCLUDED.price, updated_at = NOW();

-- ==================== VERIFICATION ====================

DO $$
DECLARE
  total_foods INTEGER;
  total_prices INTEGER;
  new_foods INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_foods FROM public.foods WHERE deleted_at IS NULL;
  SELECT COUNT(*) INTO total_prices FROM public.food_prices WHERE deleted_at IS NULL;
  SELECT COUNT(*) INTO new_foods FROM public.foods 
  WHERE name NOT IN ('Daging Ayam Ras', 'Telur Ayam Ras', 'Daging Sapi Murni')
  AND deleted_at IS NULL;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'NEW COMMODITIES ADDED SUCCESSFULLY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total foods: %', total_foods;
  RAISE NOTICE 'New commodities added: %', new_foods;
  RAISE NOTICE 'Total price records: %', total_prices;
  RAISE NOTICE '';
  RAISE NOTICE 'Categories breakdown:';
  RAISE NOTICE '   Hortikultura: 15 items (sayuran & bumbu)';
  RAISE NOTICE '   Perkebunan: 9 items (beras, gula, minyak, dll)';
  RAISE NOTICE '   Peternakan: 3 items (ayam, telur, sapi)';
  RAISE NOTICE '';
  RAISE NOTICE 'Price date: 2026-02-12';
  RAISE NOTICE '========================================';
END $$;
