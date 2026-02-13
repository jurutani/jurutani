-- =====================================================
-- ADD FOOD PRICES HISTORY - FEBRUARY 2026
-- =====================================================
-- Author: Senior Backend Developer  
-- Purpose: Add historical price data for commodities (Jan 29 - Feb 12, 2026)
-- Date: 2026-02-14
-- Migration: 008
-- =====================================================

-- This migration adds price history for existing food commodities
-- Total: 100 price records across 5 dates
-- Date range: 2026-01-29 to 2026-02-12

-- ==================== 2026-02-12 (24 commodities) ====================

INSERT INTO public.food_prices (food_id, price, date) 
SELECT 
  f.id,
  p.price,
  p.date
FROM (VALUES
  ('Beras Medium', 13290, '2026-02-12'::DATE),
  ('Gula Pasir Konsumsi', 17407, '2026-02-12'::DATE),
  ('Minyak Goreng Kemasan Premium', 20333, '2026-02-12'::DATE),
  ('Daging Ayam Ras', 40857, '2026-02-12'::DATE),
  ('Telur Ayam Ras', 30060, '2026-02-12'::DATE),
  ('Daging Sapi Murni', 138824, '2026-02-12'::DATE),
  ('Bawang Merah', 39967, '2026-02-12'::DATE),
  ('Cabe Merah Keriting', 40739, '2026-02-12'::DATE),
  ('Cabe Merah Besar', 43611, '2026-02-12'::DATE),
  ('Jagung Pipilan Kering', 6025, '2026-02-12'::DATE),
  ('Kedelai Biji Kering Impor', 9842, '2026-02-12'::DATE),
  ('Bawang Putih Bonggol', 32333, '2026-02-12'::DATE),
  ('Cabe Rawit Merah', 84000, '2026-02-12'::DATE),
  ('Beras Premium', 14667, '2026-02-12'::DATE),
  ('Beras SPHP (Bulog)', 12484, '2026-02-12'::DATE),
  ('Tepung Terigu Kemasan', 11358, '2026-02-12'::DATE),
  ('Sawi Putih', 8000, '2026-02-12'::DATE),
  ('Pakcoy', 7000, '2026-02-12'::DATE),
  ('Wortel', 14000, '2026-02-12'::DATE),
  ('Brokoli', 24000, '2026-02-12'::DATE),
  ('Kacang Panjang', 8000, '2026-02-12'::DATE),
  ('Terong', 6000, '2026-02-12'::DATE),
  ('Timun', 7000, '2026-02-12'::DATE),
  ('Tomat', 14000, '2026-02-12'::DATE)
) AS p(commodity, price, date)
INNER JOIN public.foods f ON f.name = p.commodity
ON CONFLICT (food_id, date) WHERE deleted_at IS NULL DO UPDATE
SET price = EXCLUDED.price, updated_at = NOW();

-- ==================== 2026-02-09 (24 commodities) ====================

INSERT INTO public.food_prices (food_id, price, date) 
SELECT 
  f.id,
  p.price,
  p.date
FROM (VALUES
  ('Beras Medium', 13282, '2026-02-09'::DATE),
  ('Gula Pasir Konsumsi', 17444, '2026-02-09'::DATE),
  ('Minyak Goreng Kemasan Premium', 20188, '2026-02-09'::DATE),
  ('Daging Ayam Ras', 40238, '2026-02-09'::DATE),
  ('Telur Ayam Ras', 30080, '2026-02-09'::DATE),
  ('Daging Sapi Murni', 138824, '2026-02-09'::DATE),
  ('Bawang Merah', 38733, '2026-02-09'::DATE),
  ('Cabe Merah Keriting', 37391, '2026-02-09'::DATE),
  ('Cabe Merah Besar', 42111, '2026-02-09'::DATE),
  ('Jagung Pipilan Kering', 6050, '2026-02-09'::DATE),
  ('Kedelai Biji Kering Impor', 9792, '2026-02-09'::DATE),
  ('Bawang Putih Bonggol', 32481, '2026-02-09'::DATE),
  ('Cabe Rawit Merah', 78652, '2026-02-09'::DATE),
  ('Beras Premium', 14652, '2026-02-09'::DATE),
  ('Beras SPHP (Bulog)', 12484, '2026-02-09'::DATE),
  ('Tepung Terigu Kemasan', 11583, '2026-02-09'::DATE),
  ('Sawi Putih', 9000, '2026-02-09'::DATE),
  ('Pakcoy', 7000, '2026-02-09'::DATE),
  ('Wortel', 13000, '2026-02-09'::DATE),
  ('Brokoli', 22000, '2026-02-09'::DATE),
  ('Kacang Panjang', 7000, '2026-02-09'::DATE),
  ('Terong', 7000, '2026-02-09'::DATE),
  ('Timun', 8000, '2026-02-09'::DATE),
  ('Tomat', 14000, '2026-02-09'::DATE)
) AS p(commodity, price, date)
INNER JOIN public.foods f ON f.name = p.commodity
ON CONFLICT (food_id, date) WHERE deleted_at IS NULL DO UPDATE
SET price = EXCLUDED.price, updated_at = NOW();

-- ==================== 2026-02-05 (24 commodities) ====================

INSERT INTO public.food_prices (food_id, price, date) 
SELECT 
  f.id,
  p.price,
  p.date
FROM (VALUES
  ('Beras Medium', 13030, '2026-02-05'::DATE),
  ('Gula Pasir Konsumsi', 17481, '2026-02-05'::DATE),
  ('Minyak Goreng Kemasan Premium', 20271, '2026-02-05'::DATE),
  ('Daging Ayam Ras', 37000, '2026-02-05'::DATE),
  ('Telur Ayam Ras', 27440, '2026-02-05'::DATE),
  ('Daging Sapi Murni', 138438, '2026-02-05'::DATE),
  ('Bawang Merah', 39300, '2026-02-05'::DATE),
  ('Cabe Merah Keriting', 34957, '2026-02-05'::DATE),
  ('Cabe Merah Besar', 40833, '2026-02-05'::DATE),
  ('Jagung Pipilan Kering', 6100, '2026-02-05'::DATE),
  ('Kedelai Biji Kering Impor', 9792, '2026-02-05'::DATE),
  ('Bawang Putih Bonggol', 32407, '2026-02-05'::DATE),
  ('Cabe Rawit Merah', 75478, '2026-02-05'::DATE),
  ('Beras Premium', 14644, '2026-02-05'::DATE),
  ('Beras SPHP (Bulog)', 12484, '2026-02-05'::DATE),
  ('Tepung Terigu Kemasan', 11521, '2026-02-05'::DATE),
  ('Sawi Putih', 8000, '2026-02-05'::DATE),
  ('Pakcoy', 8000, '2026-02-05'::DATE),
  ('Wortel', 14000, '2026-02-05'::DATE),
  ('Brokoli', 23000, '2026-02-05'::DATE),
  ('Kacang Panjang', 7000, '2026-02-05'::DATE),
  ('Terong', 8000, '2026-02-05'::DATE),
  ('Timun', 7000, '2026-02-05'::DATE),
  ('Tomat', 13000, '2026-02-05'::DATE)
) AS p(commodity, price, date)
INNER JOIN public.foods f ON f.name = p.commodity
ON CONFLICT (food_id, date) WHERE deleted_at IS NULL DO UPDATE
SET price = EXCLUDED.price, updated_at = NOW();

-- ==================== 2026-02-02 (24 commodities) ====================

INSERT INTO public.food_prices (food_id, price, date) 
SELECT 
  f.id,
  p.price,
  p.date
FROM (VALUES
  ('Beras Medium', 13289, '2026-02-02'::DATE),
  ('Gula Pasir Konsumsi', 17497, '2026-02-02'::DATE),
  ('Minyak Goreng Kemasan Premium', 20071, '2026-02-02'::DATE),
  ('Daging Ayam Ras', 35722, '2026-02-02'::DATE),
  ('Telur Ayam Ras', 27409, '2026-02-02'::DATE),
  ('Daging Sapi Murni', 138529, '2026-02-02'::DATE),
  ('Bawang Merah', 38000, '2026-02-02'::DATE),
  ('Cabe Merah Keriting', 32368, '2026-02-02'::DATE),
  ('Cabe Merah Besar', 39250, '2026-02-02'::DATE),
  ('Jagung Pipilan Kering', 6100, '2026-02-02'::DATE),
  ('Kedelai Biji Kering Impor', 9792, '2026-02-02'::DATE),
  ('Bawang Putih Bonggol', 32792, '2026-02-02'::DATE),
  ('Cabe Rawit Merah', 62158, '2026-02-02'::DATE),
  ('Beras Premium', 14633, '2026-02-02'::DATE),
  ('Beras SPHP (Bulog)', 12456, '2026-02-02'::DATE),
  ('Tepung Terigu Kemasan', 11500, '2026-02-02'::DATE),
  ('Sawi Putih', 7000, '2026-02-02'::DATE),
  ('Pakcoy', 8000, '2026-02-02'::DATE),
  ('Wortel', 14000, '2026-02-02'::DATE),
  ('Brokoli', 22000, '2026-02-02'::DATE),
  ('Kacang Panjang', 7000, '2026-02-02'::DATE),
  ('Terong', 7000, '2026-02-02'::DATE),
  ('Timun', 7000, '2026-02-02'::DATE),
  ('Tomat', 14000, '2026-02-02'::DATE)
) AS p(commodity, price, date)
INNER JOIN public.foods f ON f.name = p.commodity
ON CONFLICT (food_id, date) WHERE deleted_at IS NULL DO UPDATE
SET price = EXCLUDED.price, updated_at = NOW();

-- ==================== 2026-01-29 (4 commodities) ====================

INSERT INTO public.food_prices (food_id, price, date) 
SELECT 
  f.id,
  p.price,
  p.date
FROM (VALUES
  ('Beras Medium', 12974, '2026-01-29'::DATE),
  ('Gula Pasir Konsumsi', 17444, '2026-01-29'::DATE),
  ('Minyak Goreng Kemasan Premium', 20146, '2026-01-29'::DATE),
  ('Daging Ayam Ras', 35429, '2026-01-29'::DATE)
) AS p(commodity, price, date)
INNER JOIN public.foods f ON f.name = p.commodity
ON CONFLICT (food_id, date) WHERE deleted_at IS NULL DO UPDATE
SET price = EXCLUDED.price, updated_at = NOW();

-- ==================== VERIFICATION & SUMMARY ====================

DO $$
DECLARE
  total_prices INTEGER;
  dates_count INTEGER;
  price_2026_02_12 INTEGER;
  price_2026_02_09 INTEGER;
  price_2026_02_05 INTEGER;
  price_2026_02_02 INTEGER;
  price_2026_01_29 INTEGER;
BEGIN
  -- Count total prices in date range
  SELECT COUNT(*) INTO total_prices 
  FROM public.food_prices 
  WHERE deleted_at IS NULL 
  AND date BETWEEN '2026-01-29' AND '2026-02-12';
  
  -- Count unique dates
  SELECT COUNT(DISTINCT date) INTO dates_count
  FROM public.food_prices 
  WHERE deleted_at IS NULL 
  AND date BETWEEN '2026-01-29' AND '2026-02-12';
  
  -- Count per date
  SELECT COUNT(*) INTO price_2026_02_12
  FROM public.food_prices 
  WHERE deleted_at IS NULL AND date = '2026-02-12';
  
  SELECT COUNT(*) INTO price_2026_02_09
  FROM public.food_prices 
  WHERE deleted_at IS NULL AND date = '2026-02-09';
  
  SELECT COUNT(*) INTO price_2026_02_05
  FROM public.food_prices 
  WHERE deleted_at IS NULL AND date = '2026-02-05';
  
  SELECT COUNT(*) INTO price_2026_02_02
  FROM public.food_prices 
  WHERE deleted_at IS NULL AND date = '2026-02-02';
  
  SELECT COUNT(*) INTO price_2026_01_29
  FROM public.food_prices 
  WHERE deleted_at IS NULL AND date = '2026-01-29';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '   PRICE HISTORY MIGRATION COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Summary Statistics:';
  RAISE NOTICE '  Total price records: %', total_prices;
  RAISE NOTICE '  Unique dates: %', dates_count;
  RAISE NOTICE '';
  RAISE NOTICE '📅 Breakdown by date:';
  RAISE NOTICE '  2026-02-12: % items', price_2026_02_12;
  RAISE NOTICE '  2026-02-09: % items', price_2026_02_09;
  RAISE NOTICE '  2026-02-05: % items', price_2026_02_05;
  RAISE NOTICE '  2026-02-02: % items', price_2026_02_02;
  RAISE NOTICE '  2026-01-29: % items', price_2026_01_29;
  RAISE NOTICE '';
  RAISE NOTICE '✅ All price history records inserted successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: Duplicate commodity+date combinations were updated.';
  RAISE NOTICE '========================================';
END $$;
