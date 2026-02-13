-- =====================================================
-- FOOD PRICES TABLE CREATION & DATA
-- =====================================================
-- Author: Senior Backend Developer
-- Purpose: Store commodity food prices with historical data
-- =====================================================

-- ==================== CREATE TABLE ====================

CREATE TABLE IF NOT EXISTS public.food_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==================== ADD COMMENTS ====================

COMMENT ON TABLE public.food_prices IS 'Historical food commodity prices';
COMMENT ON COLUMN public.food_prices.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN public.food_prices.commodity IS 'Name of the commodity (e.g., Daging Ayam Ras)';
COMMENT ON COLUMN public.food_prices.category IS 'Category: Hortikultura, Perkebunan, Perikanan, Peternakan';
COMMENT ON COLUMN public.food_prices.price IS 'Price in IDR (Rupiah)';
COMMENT ON COLUMN public.food_prices.date IS 'Date when price was recorded';
COMMENT ON COLUMN public.food_prices.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN public.food_prices.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN public.food_prices.deleted_at IS 'Soft delete timestamp';

-- ==================== ADD CONSTRAINTS ====================

-- Add check constraint for valid categories
ALTER TABLE public.food_prices 
ADD CONSTRAINT chk_food_prices_category 
CHECK (category IN ('hortikultura', 'perkebunan', 'perikanan', 'peternakan'));

-- Add unique constraint for commodity + date (prevent duplicates)
CREATE UNIQUE INDEX idx_food_prices_commodity_date 
ON public.food_prices(commodity, date) 
WHERE deleted_at IS NULL;

-- ==================== CREATE INDEXES ====================

-- Index for commodity search
CREATE INDEX idx_food_prices_commodity 
ON public.food_prices(commodity) 
WHERE deleted_at IS NULL;

-- Index for category filtering
CREATE INDEX idx_food_prices_category 
ON public.food_prices(category) 
WHERE deleted_at IS NULL;

-- Index for date range queries (most important for time series)
CREATE INDEX idx_food_prices_date_desc 
ON public.food_prices(date DESC) 
WHERE deleted_at IS NULL;

-- Composite index for category + date queries
CREATE INDEX idx_food_prices_category_date 
ON public.food_prices(category, date DESC) 
WHERE deleted_at IS NULL;

-- Composite index for commodity + date queries
CREATE INDEX idx_food_prices_commodity_date_desc 
ON public.food_prices(commodity, date DESC) 
WHERE deleted_at IS NULL;

-- ==================== CREATE TRIGGER ====================

-- Auto-update updated_at timestamp
CREATE TRIGGER trigger_food_prices_updated_at
  BEFORE UPDATE ON public.food_prices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== INSERT INITIAL DATA ====================

INSERT INTO public.food_prices (commodity, category, price, date) VALUES
-- February 2026
('Daging Ayam Ras', 'peternakan', 40857, '2026-02-12'),
('Telur Ayam Ras', 'peternakan', 30060, '2026-02-12'),
('Daging Sapi Murni', 'peternakan', 138824, '2026-02-12'),
('Daging Ayam Ras', 'peternakan', 40238, '2026-02-09'),
('Telur Ayam Ras', 'peternakan', 30080, '2026-02-09'),
('Daging Sapi Murni', 'peternakan', 138824, '2026-02-09'),
('Daging Ayam Ras', 'peternakan', 37000, '2026-02-05'),
('Telur Ayam Ras', 'peternakan', 27440, '2026-02-05'),
('Daging Sapi Murni', 'peternakan', 138438, '2026-02-05'),
('Daging Ayam Ras', 'peternakan', 35722, '2026-02-02'),
('Telur Ayam Ras', 'peternakan', 27409, '2026-02-02'),
('Daging Sapi Murni', 'peternakan', 138529, '2026-02-02'),

-- January 2026
('Daging Ayam Ras', 'peternakan', 35429, '2026-01-29'),
('Telur Ayam Ras', 'peternakan', 27280, '2026-01-29'),
('Daging Sapi Murni', 'peternakan', 139118, '2026-01-29'),
('Daging Ayam Ras', 'peternakan', 35100, '2026-01-26'),
('Telur Ayam Ras', 'peternakan', 27571, '2026-01-26'),
('Daging Sapi Murni', 'peternakan', 140000, '2026-01-26'),
('Daging Ayam Ras', 'peternakan', 35000, '2026-01-22'),
('Telur Ayam Ras', 'peternakan', 27848, '2026-01-22'),
('Daging Sapi Murni', 'peternakan', 138706, '2026-01-22'),
('Daging Ayam Ras', 'peternakan', 34700, '2026-01-19'),
('Telur Ayam Ras', 'peternakan', 27804, '2026-01-19'),
('Daging Sapi Murni', 'peternakan', 139063, '2026-01-19'),
('Daging Ayam Ras', 'peternakan', 34450, '2026-01-15'),
('Telur Ayam Ras', 'peternakan', 28568, '2026-01-15'),
('Daging Sapi Murni', 'peternakan', 139333, '2026-01-15'),
('Daging Ayam Ras', 'peternakan', 35053, '2026-01-12'),
('Telur Ayam Ras', 'peternakan', 28500, '2026-01-12'),
('Daging Sapi Murni', 'peternakan', 139643, '2026-01-12'),
('Daging Ayam Ras', 'peternakan', 35867, '2026-01-08'),
('Telur Ayam Ras', 'peternakan', 29395, '2026-01-08'),
('Daging Sapi Murni', 'peternakan', 139000, '2026-01-08'),
('Daging Ayam Ras', 'peternakan', 34667, '2026-01-05'),
('Telur Ayam Ras', 'peternakan', 30333, '2026-01-05'),
('Daging Sapi Murni', 'peternakan', 135000, '2026-01-05')
ON CONFLICT (commodity, date) WHERE deleted_at IS NULL DO NOTHING;

-- ==================== ENABLE RLS ====================

ALTER TABLE public.food_prices ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES ====================

-- Public can view all non-deleted food prices
CREATE POLICY "food_prices_select_public"
ON public.food_prices FOR SELECT
USING (deleted_at IS NULL);

-- Admins can insert new food prices
CREATE POLICY "food_prices_insert_admin"
ON public.food_prices FOR INSERT
WITH CHECK (is_admin());

-- Admins can update food prices
CREATE POLICY "food_prices_update_admin"
ON public.food_prices FOR UPDATE
USING (is_admin());

-- Admins can soft delete food prices
CREATE POLICY "food_prices_delete_admin"
ON public.food_prices FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- ==================== HELPER FUNCTIONS ====================

-- Get latest price for a commodity
CREATE OR REPLACE FUNCTION public.get_latest_food_price(p_commodity TEXT)
RETURNS TABLE (
  id UUID,
  commodity VARCHAR,
  category VARCHAR,
  price INTEGER,
  date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fp.id,
    fp.commodity,
    fp.category,
    fp.price,
    fp.date
  FROM public.food_prices fp
  WHERE fp.commodity = p_commodity
  AND fp.deleted_at IS NULL
  ORDER BY fp.date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_latest_food_price(TEXT) IS 'Get the latest price for a specific commodity';

-- Get price trend for a commodity (last N days)
CREATE OR REPLACE FUNCTION public.get_food_price_trend(
  p_commodity TEXT,
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
      fp.date,
      fp.price,
      LAG(fp.price) OVER (ORDER BY fp.date) AS prev_price
    FROM public.food_prices fp
    WHERE fp.commodity = p_commodity
    AND fp.deleted_at IS NULL
    AND fp.date >= CURRENT_DATE - p_days
    ORDER BY fp.date DESC
  )
  SELECT 
    pd.date,
    pd.price,
    (pd.price - COALESCE(pd.prev_price, pd.price))::INTEGER AS price_change,
    CASE 
      WHEN pd.prev_price IS NULL OR pd.prev_price = 0 THEN 0
      ELSE ROUND(((pd.price - pd.prev_price)::NUMERIC / pd.prev_price * 100), 2)
    END AS price_change_percent
  FROM price_data pd
  ORDER BY pd.date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_food_price_trend(TEXT, INTEGER) IS 'Get price trend with change calculations for a commodity';

-- Get all commodities by category
CREATE OR REPLACE FUNCTION public.get_food_prices_by_category(
  p_category TEXT,
  p_latest_only BOOLEAN DEFAULT true
)
RETURNS TABLE (
  commodity VARCHAR,
  price INTEGER,
  date DATE,
  category VARCHAR
) AS $$
BEGIN
  IF p_latest_only THEN
    -- Get only latest price for each commodity
    RETURN QUERY
    SELECT DISTINCT ON (fp.commodity)
      fp.commodity,
      fp.price,
      fp.date,
      fp.category
    FROM public.food_prices fp
    WHERE fp.category = p_category
    AND fp.deleted_at IS NULL
    ORDER BY fp.commodity, fp.date DESC;
  ELSE
    -- Get all prices
    RETURN QUERY
    SELECT 
      fp.commodity,
      fp.price,
      fp.date,
      fp.category
    FROM public.food_prices fp
    WHERE fp.category = p_category
    AND fp.deleted_at IS NULL
    ORDER BY fp.commodity, fp.date DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_food_prices_by_category(TEXT, BOOLEAN) IS 'Get food prices by category, optionally only latest prices';

-- Get price statistics for a commodity
CREATE OR REPLACE FUNCTION public.get_food_price_stats(
  p_commodity TEXT,
  p_days INTEGER DEFAULT 30
)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'commodity', p_commodity,
    'period_days', p_days,
    'latest_price', (
      SELECT price FROM public.food_prices 
      WHERE commodity = p_commodity AND deleted_at IS NULL 
      ORDER BY date DESC LIMIT 1
    ),
    'latest_date', (
      SELECT date FROM public.food_prices 
      WHERE commodity = p_commodity AND deleted_at IS NULL 
      ORDER BY date DESC LIMIT 1
    ),
    'avg_price', (
      SELECT ROUND(AVG(price))::INTEGER 
      FROM public.food_prices 
      WHERE commodity = p_commodity 
      AND deleted_at IS NULL 
      AND date >= CURRENT_DATE - p_days
    ),
    'min_price', (
      SELECT MIN(price) 
      FROM public.food_prices 
      WHERE commodity = p_commodity 
      AND deleted_at IS NULL 
      AND date >= CURRENT_DATE - p_days
    ),
    'max_price', (
      SELECT MAX(price) 
      FROM public.food_prices 
      WHERE commodity = p_commodity 
      AND deleted_at IS NULL 
      AND date >= CURRENT_DATE - p_days
    ),
    'data_points', (
      SELECT COUNT(*) 
      FROM public.food_prices 
      WHERE commodity = p_commodity 
      AND deleted_at IS NULL 
      AND date >= CURRENT_DATE - p_days
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_food_price_stats(TEXT, INTEGER) IS 'Get comprehensive statistics for a commodity price';

-- Search commodities by name
CREATE OR REPLACE FUNCTION public.search_food_commodities(
  p_search_term TEXT,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  commodity VARCHAR,
  category VARCHAR,
  latest_price INTEGER,
  latest_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (fp.commodity)
    fp.commodity,
    fp.category,
    fp.price AS latest_price,
    fp.date AS latest_date
  FROM public.food_prices fp
  WHERE fp.deleted_at IS NULL
  AND fp.commodity ILIKE '%' || p_search_term || '%'
  ORDER BY fp.commodity, fp.date DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.search_food_commodities(TEXT, INTEGER) IS 'Search commodities by name with latest prices';

-- ==================== GRANT PERMISSIONS ====================

-- Grant select to anon (public read with RLS)
GRANT SELECT ON public.food_prices TO anon;

-- Grant all to authenticated (with RLS)
GRANT ALL ON public.food_prices TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.get_latest_food_price(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_food_price_trend(TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_food_prices_by_category(TEXT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_food_price_stats(TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_food_commodities(TEXT, INTEGER) TO anon, authenticated;

-- ==================== SUCCESS MESSAGE ====================

DO $$
BEGIN
  RAISE NOTICE 'Food prices table created successfully with % initial records', 
    (SELECT COUNT(*) FROM public.food_prices);
  RAISE NOTICE 'RLS policies applied';
  RAISE NOTICE 'Helper functions created: get_latest_food_price, get_food_price_trend, get_food_prices_by_category, get_food_price_stats, search_food_commodities';
  RAISE NOTICE 'Indexes created for optimal query performance';
END $$;
