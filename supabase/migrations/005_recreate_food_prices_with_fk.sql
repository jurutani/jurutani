-- =====================================================
-- RECREATE FOOD_PRICES WITH FK TO FOODS
-- =====================================================
-- Author: Senior Backend Developer
-- Purpose: Create food_prices table linked to foods master
-- Date: 2026-02-14
-- =====================================================

-- ==================== CREATE TABLE ====================

CREATE TABLE IF NOT EXISTS public.food_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  price INTEGER NOT NULL CHECK (price >= 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==================== ADD COMMENTS ====================

COMMENT ON TABLE public.food_prices IS 'Historical food commodity prices';
COMMENT ON COLUMN public.food_prices.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN public.food_prices.food_id IS 'Foreign key to foods table';
COMMENT ON COLUMN public.food_prices.price IS 'Price in IDR (Rupiah)';
COMMENT ON COLUMN public.food_prices.date IS 'Date when price was recorded';

-- ==================== ADD CONSTRAINTS ====================

-- Unique constraint for food_id + date (prevent duplicates)
CREATE UNIQUE INDEX idx_food_prices_food_date 
ON public.food_prices(food_id, date) 
WHERE deleted_at IS NULL;

-- ==================== CREATE INDEXES ====================

-- Index for food_id lookups
CREATE INDEX idx_food_prices_food_id 
ON public.food_prices(food_id) 
WHERE deleted_at IS NULL;

-- Index for date range queries
CREATE INDEX idx_food_prices_date_desc 
ON public.food_prices(date DESC) 
WHERE deleted_at IS NULL;

-- Composite index for food_id + date queries
CREATE INDEX idx_food_prices_food_date_desc 
ON public.food_prices(food_id, date DESC) 
WHERE deleted_at IS NULL;

-- ==================== CREATE TRIGGER ====================

CREATE TRIGGER trigger_food_prices_updated_at
  BEFORE UPDATE ON public.food_prices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== INSERT HISTORICAL DATA ====================

-- Insert prices linked to foods (get food_id from foods table)
INSERT INTO public.food_prices (food_id, price, date) 
SELECT 
  f.id,
  p.price,
  p.date
FROM (VALUES
  -- February 2026
  ('Daging Ayam Ras', 40857, '2026-02-12'::DATE),
  ('Telur Ayam Ras', 30060, '2026-02-12'::DATE),
  ('Daging Sapi Murni', 138824, '2026-02-12'::DATE),
  ('Daging Ayam Ras', 40238, '2026-02-09'::DATE),
  ('Telur Ayam Ras', 30080, '2026-02-09'::DATE),
  ('Daging Sapi Murni', 138824, '2026-02-09'::DATE),
  ('Daging Ayam Ras', 37000, '2026-02-05'::DATE),
  ('Telur Ayam Ras', 27440, '2026-02-05'::DATE),
  ('Daging Sapi Murni', 138438, '2026-02-05'::DATE),
  ('Daging Ayam Ras', 35722, '2026-02-02'::DATE),
  ('Telur Ayam Ras', 27409, '2026-02-02'::DATE),
  ('Daging Sapi Murni', 138529, '2026-02-02'::DATE),
  -- January 2026
  ('Daging Ayam Ras', 35429, '2026-01-29'::DATE),
  ('Telur Ayam Ras', 27280, '2026-01-29'::DATE),
  ('Daging Sapi Murni', 139118, '2026-01-29'::DATE),
  ('Daging Ayam Ras', 35100, '2026-01-26'::DATE),
  ('Telur Ayam Ras', 27571, '2026-01-26'::DATE),
  ('Daging Sapi Murni', 140000, '2026-01-26'::DATE),
  ('Daging Ayam Ras', 35000, '2026-01-22'::DATE),
  ('Telur Ayam Ras', 27848, '2026-01-22'::DATE),
  ('Daging Sapi Murni', 138706, '2026-01-22'::DATE),
  ('Daging Ayam Ras', 34700, '2026-01-19'::DATE),
  ('Telur Ayam Ras', 27804, '2026-01-19'::DATE),
  ('Daging Sapi Murni', 139063, '2026-01-19'::DATE),
  ('Daging Ayam Ras', 34450, '2026-01-15'::DATE),
  ('Telur Ayam Ras', 28568, '2026-01-15'::DATE),
  ('Daging Sapi Murni', 139333, '2026-01-15'::DATE),
  ('Daging Ayam Ras', 35053, '2026-01-12'::DATE),
  ('Telur Ayam Ras', 28500, '2026-01-12'::DATE),
  ('Daging Sapi Murni', 139643, '2026-01-12'::DATE),
  ('Daging Ayam Ras', 35867, '2026-01-08'::DATE),
  ('Telur Ayam Ras', 29395, '2026-01-08'::DATE),
  ('Daging Sapi Murni', 139000, '2026-01-08'::DATE),
  ('Daging Ayam Ras', 34667, '2026-01-05'::DATE),
  ('Telur Ayam Ras', 30333, '2026-01-05'::DATE),
  ('Daging Sapi Murni', 135000, '2026-01-05'::DATE)
) AS p(commodity, price, date)
INNER JOIN public.foods f ON f.name = p.commodity
ON CONFLICT (food_id, date) WHERE deleted_at IS NULL DO NOTHING;

-- ==================== ENABLE RLS ====================

ALTER TABLE public.food_prices ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES ====================

CREATE POLICY "food_prices_select_public"
ON public.food_prices FOR SELECT
USING (deleted_at IS NULL);

CREATE POLICY "food_prices_insert_admin"
ON public.food_prices FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "food_prices_update_admin"
ON public.food_prices FOR UPDATE
USING (is_admin());

CREATE POLICY "food_prices_delete_admin"
ON public.food_prices FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- ==================== HELPER FUNCTIONS ====================

-- Get latest price by food slug
CREATE OR REPLACE FUNCTION public.get_latest_price_by_slug(p_slug TEXT)
RETURNS TABLE (
  food_id UUID,
  food_name VARCHAR,
  category VARCHAR,
  satuan VARCHAR,
  image_url TEXT,
  price INTEGER,
  date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id, f.name, f.category, f.satuan, f.image_url,
    fp.price, fp.date
  FROM public.foods f
  INNER JOIN public.food_prices fp ON fp.food_id = f.id
  WHERE f.slug = p_slug
  AND f.deleted_at IS NULL AND fp.deleted_at IS NULL
  ORDER BY fp.date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_latest_price_by_slug(TEXT) IS 'Get latest price by food slug';

-- Get price trend by slug
CREATE OR REPLACE FUNCTION public.get_price_trend_by_slug(
  p_slug TEXT,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  price INTEGER,
  price_change INTEGER,
  price_change_percent NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH price_data AS (
    SELECT 
      fp.date, fp.price,
      LAG(fp.price) OVER (ORDER BY fp.date) AS prev_price
    FROM public.food_prices fp
    INNER JOIN public.foods f ON f.id = fp.food_id
    WHERE f.slug = p_slug
    AND f.deleted_at IS NULL AND fp.deleted_at IS NULL
    AND fp.date >= CURRENT_DATE - p_days
    ORDER BY fp.date DESC
  )
  SELECT 
    pd.date, pd.price,
    (pd.price - COALESCE(pd.prev_price, pd.price))::INTEGER,
    CASE 
      WHEN pd.prev_price IS NULL OR pd.prev_price = 0 THEN 0
      ELSE ROUND(((pd.price - pd.prev_price)::NUMERIC / pd.prev_price * 100), 2)
    END
  FROM price_data pd
  ORDER BY pd.date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_price_trend_by_slug(TEXT, INTEGER) IS 'Get price trend with change calculations by slug';

-- Get all latest prices by category
CREATE OR REPLACE FUNCTION public.get_latest_prices_by_category(
  p_category TEXT
)
RETURNS TABLE (
  food_id UUID,
  slug VARCHAR,
  name VARCHAR,
  category VARCHAR,
  satuan VARCHAR,
  image_url TEXT,
  price INTEGER,
  date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (f.id)
    f.id, f.slug, f.name, f.category, f.satuan, f.image_url,
    fp.price, fp.date
  FROM public.foods f
  LEFT JOIN public.food_prices fp ON fp.food_id = f.id AND fp.deleted_at IS NULL
  WHERE f.category = p_category AND f.deleted_at IS NULL
  ORDER BY f.id, fp.date DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_latest_prices_by_category(TEXT) IS 'Get latest prices by category';

-- Get all latest prices
CREATE OR REPLACE FUNCTION public.get_all_latest_prices()
RETURNS TABLE (
  food_id UUID,
  slug VARCHAR,
  name VARCHAR,
  category VARCHAR,
  satuan VARCHAR,
  image_url TEXT,
  description TEXT,
  price INTEGER,
  date DATE,
  price_change NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH latest_prices AS (
    SELECT DISTINCT ON (fp.food_id)
      fp.food_id, fp.price, fp.date,
      LAG(fp.price) OVER (PARTITION BY fp.food_id ORDER BY fp.date DESC) AS prev_price
    FROM public.food_prices fp
    WHERE fp.deleted_at IS NULL
    ORDER BY fp.food_id, fp.date DESC
  )
  SELECT 
    f.id, f.slug, f.name, f.category, f.satuan, f.image_url, f.description,
    lp.price, lp.date,
    CASE 
      WHEN lp.prev_price IS NULL OR lp.prev_price = 0 THEN 0
      ELSE ROUND(((lp.price - lp.prev_price)::NUMERIC / lp.prev_price * 100), 2)
    END
  FROM public.foods f
  LEFT JOIN latest_prices lp ON lp.food_id = f.id
  WHERE f.deleted_at IS NULL
  ORDER BY f.category, f.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_all_latest_prices() IS 'Get all latest prices with change percentage';

-- Get price statistics by slug
CREATE OR REPLACE FUNCTION public.get_price_stats_by_slug(
  p_slug TEXT,
  p_days INTEGER DEFAULT 30
)
RETURNS JSON AS $$
DECLARE
  stats JSON;
  v_food_id UUID;
BEGIN
  SELECT id INTO v_food_id
  FROM public.foods
  WHERE slug = p_slug AND deleted_at IS NULL;
  
  IF v_food_id IS NULL THEN
    RETURN json_build_object('error', 'Food not found');
  END IF;
  
  SELECT json_build_object(
    'slug', p_slug,
    'period_days', p_days,
    'food', (
      SELECT json_build_object(
        'id', f.id, 'name', f.name, 'category', f.category,
        'satuan', f.satuan, 'image_url', f.image_url
      )
      FROM public.foods f WHERE f.id = v_food_id
    ),
    'latest_price', (
      SELECT price FROM public.food_prices 
      WHERE food_id = v_food_id AND deleted_at IS NULL 
      ORDER BY date DESC LIMIT 1
    ),
    'latest_date', (
      SELECT date FROM public.food_prices 
      WHERE food_id = v_food_id AND deleted_at IS NULL 
      ORDER BY date DESC LIMIT 1
    ),
    'avg_price', (
      SELECT ROUND(AVG(price))::INTEGER 
      FROM public.food_prices 
      WHERE food_id = v_food_id AND deleted_at IS NULL 
      AND date >= CURRENT_DATE - p_days
    ),
    'min_price', (
      SELECT MIN(price) FROM public.food_prices 
      WHERE food_id = v_food_id AND deleted_at IS NULL 
      AND date >= CURRENT_DATE - p_days
    ),
    'max_price', (
      SELECT MAX(price) FROM public.food_prices 
      WHERE food_id = v_food_id AND deleted_at IS NULL 
      AND date >= CURRENT_DATE - p_days
    ),
    'data_points', (
      SELECT COUNT(*) FROM public.food_prices 
      WHERE food_id = v_food_id AND deleted_at IS NULL 
      AND date >= CURRENT_DATE - p_days
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_price_stats_by_slug(TEXT, INTEGER) IS 'Get comprehensive statistics by slug';

-- ==================== GRANT PERMISSIONS ====================

GRANT SELECT ON public.food_prices TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.food_prices TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_latest_price_by_slug(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_price_trend_by_slug(TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_latest_prices_by_category(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_latest_prices() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_price_stats_by_slug(TEXT, INTEGER) TO anon, authenticated;

-- ==================== VERIFICATION ====================

DO $$
DECLARE
  total_prices INTEGER;
  total_foods INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_prices FROM public.food_prices WHERE deleted_at IS NULL;
  SELECT COUNT(*) INTO total_foods FROM public.foods WHERE deleted_at IS NULL;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'MIGRATION COMPLETED SUCCESSFULLY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total foods: %', total_foods;
  RAISE NOTICE 'Total prices: %', total_prices;
  RAISE NOTICE '';
  RAISE NOTICE 'Schema:';
  RAISE NOTICE '  ✓ foods (% records)', total_foods;
  RAISE NOTICE '  ✓ food_prices (% records)', total_prices;
  RAISE NOTICE '  ✓ FK: food_prices.food_id → foods.id';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions created:';
  RAISE NOTICE '  ✓ get_latest_price_by_slug(slug)';
  RAISE NOTICE '  ✓ get_price_trend_by_slug(slug, days)';
  RAISE NOTICE '  ✓ get_latest_prices_by_category(category)';
  RAISE NOTICE '  ✓ get_all_latest_prices()';
  RAISE NOTICE '  ✓ get_price_stats_by_slug(slug, days)';
  RAISE NOTICE '========================================';
END $$;
