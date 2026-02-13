-- =====================================================
-- DROP OLD STRUCTURE & CREATE FOODS MASTER TABLE
-- =====================================================
-- Author: Senior Backend Developer
-- Purpose: Refactor to master-detail architecture (foods + food_prices)
-- Date: 2026-02-14
-- =====================================================

-- ==================== DROP OLD FUNCTIONS & TRIGGERS ====================

-- Drop all food_prices related functions
DROP FUNCTION IF EXISTS public.get_latest_food_price(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_food_price_trend(TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.get_food_prices_by_category(TEXT, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS public.get_food_price_stats(TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.search_food_commodities(TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.get_food_price_by_slug(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.auto_generate_slug_food_prices() CASCADE;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_auto_generate_slug_food_prices ON public.food_prices;

-- Drop food_prices table (will recreate in next migration)
DROP TABLE IF EXISTS public.food_prices CASCADE;

-- ==================== CREATE FOODS MASTER TABLE ====================

CREATE TABLE IF NOT EXISTS public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(150) UNIQUE NOT NULL,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  satuan VARCHAR(20) NOT NULL,
  image_url TEXT,
  specifications TEXT,
  tags TEXT[],
  search_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==================== ADD COMMENTS ====================

COMMENT ON TABLE public.foods IS 'Master data for food commodities';
COMMENT ON COLUMN public.foods.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN public.foods.slug IS 'SEO-friendly URL slug';
COMMENT ON COLUMN public.foods.name IS 'Commodity name (unique)';
COMMENT ON COLUMN public.foods.category IS 'Category: hortikultura, perkebunan, perikanan, peternakan';
COMMENT ON COLUMN public.foods.description IS 'Product description and details';
COMMENT ON COLUMN public.foods.satuan IS 'Unit of measurement (kg, liter, butir)';
COMMENT ON COLUMN public.foods.image_url IS 'Image URL (Supabase storage or external)';
COMMENT ON COLUMN public.foods.specifications IS 'Additional specifications';
COMMENT ON COLUMN public.foods.tags IS 'Search tags array';
COMMENT ON COLUMN public.foods.search_vector IS 'Full-text search vector';

-- ==================== ADD CONSTRAINTS ====================

-- Valid categories
ALTER TABLE public.foods 
ADD CONSTRAINT chk_foods_category 
CHECK (category IN ('hortikultura', 'perkebunan', 'perikanan', 'peternakan'));

-- ==================== CREATE INDEXES ====================

-- Index for slug lookups (most common query)
CREATE INDEX idx_foods_slug 
ON public.foods(slug) 
WHERE deleted_at IS NULL;

-- Index for category filtering
CREATE INDEX idx_foods_category 
ON public.foods(category) 
WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_foods_search 
ON public.foods USING GIN(search_vector);

-- Index for tags search
CREATE INDEX idx_foods_tags 
ON public.foods USING GIN(tags);

-- ==================== SLUG GENERATION FUNCTION ====================

-- Function to generate slug from text (handle Indonesian characters)
CREATE OR REPLACE FUNCTION public.generate_slug(text_input TEXT)
RETURNS TEXT AS $$
DECLARE
  slug_output TEXT;
BEGIN
  slug_output := LOWER(TRIM(text_input));
  slug_output := REGEXP_REPLACE(slug_output, '\s+', '-', 'g');
  slug_output := REGEXP_REPLACE(slug_output, '[^a-z0-9\-_]', '', 'g');
  slug_output := REGEXP_REPLACE(slug_output, '-+', '-', 'g');
  slug_output := TRIM(BOTH '-' FROM slug_output);
  RETURN slug_output;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.generate_slug(TEXT) IS 'Generate SEO-friendly slug from text';

-- ==================== AUTO-SLUG TRIGGER ====================

CREATE OR REPLACE FUNCTION public.auto_generate_slug_foods()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := public.generate_slug(NEW.name);
    final_slug := base_slug;
    
    WHILE EXISTS (
      SELECT 1 FROM public.foods 
      WHERE slug = final_slug 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
      AND deleted_at IS NULL
    ) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_slug_foods
  BEFORE INSERT OR UPDATE ON public.foods
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_slug_foods();

-- ==================== SEARCH VECTOR UPDATE ====================

CREATE OR REPLACE FUNCTION public.update_foods_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('indonesian', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('indonesian', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('indonesian', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_foods_search_vector
  BEFORE INSERT OR UPDATE ON public.foods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_foods_search_vector();

-- ==================== AUTO-UPDATE TIMESTAMP ====================

CREATE TRIGGER trigger_foods_updated_at
  BEFORE UPDATE ON public.foods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== INSERT MASTER DATA ====================

INSERT INTO public.foods (name, category, satuan, description, tags) VALUES
('Daging Ayam Ras', 'peternakan', 'kg', 'Daging ayam ras segar berkualitas untuk konsumsi harian', ARRAY['ayam', 'daging', 'protein', 'peternakan']),
('Telur Ayam Ras', 'peternakan', 'butir', 'Telur ayam ras segar dari peternakan lokal', ARRAY['telur', 'ayam', 'protein', 'peternakan']),
('Daging Sapi Murni', 'peternakan', 'kg', 'Daging sapi murni segar pilihan dari sapi lokal', ARRAY['sapi', 'daging', 'protein', 'peternakan'])
ON CONFLICT (name) DO NOTHING;

-- ==================== ENABLE RLS ====================

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES ====================

-- Public can view all non-deleted foods
CREATE POLICY "foods_select_public"
ON public.foods FOR SELECT
USING (deleted_at IS NULL);

-- Admins can insert new foods
CREATE POLICY "foods_insert_admin"
ON public.foods FOR INSERT
WITH CHECK (is_admin());

-- Admins can update foods
CREATE POLICY "foods_update_admin"
ON public.foods FOR UPDATE
USING (is_admin());

-- Admins can soft delete foods
CREATE POLICY "foods_delete_admin"
ON public.foods FOR DELETE
USING (is_admin());

-- ==================== HELPER FUNCTIONS ====================

-- Get food by slug
CREATE OR REPLACE FUNCTION public.get_food_by_slug(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  slug VARCHAR,
  name VARCHAR,
  category VARCHAR,
  description TEXT,
  satuan VARCHAR,
  image_url TEXT,
  specifications TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id, f.slug, f.name, f.category, f.description,
    f.satuan, f.image_url, f.specifications, f.tags,
    f.created_at, f.updated_at
  FROM public.foods f
  WHERE f.slug = p_slug AND f.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_food_by_slug(TEXT) IS 'Get food by slug';

-- Search foods with full-text search
CREATE OR REPLACE FUNCTION public.search_foods(
  p_search_term TEXT,
  p_category TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug VARCHAR,
  name VARCHAR,
  category VARCHAR,
  description TEXT,
  satuan VARCHAR,
  image_url TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id, f.slug, f.name, f.category, f.description,
    f.satuan, f.image_url,
    ts_rank(f.search_vector, query) AS rank
  FROM public.foods f,
       to_tsquery('indonesian', p_search_term) query
  WHERE f.deleted_at IS NULL
  AND f.search_vector @@ query
  AND (p_category IS NULL OR f.category = p_category)
  ORDER BY rank DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.search_foods(TEXT, TEXT, INTEGER) IS 'Full-text search for foods with ranking';

-- List all foods by category
CREATE OR REPLACE FUNCTION public.list_foods(
  p_category TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  slug VARCHAR,
  name VARCHAR,
  category VARCHAR,
  description TEXT,
  satuan VARCHAR,
  image_url TEXT,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id, f.slug, f.name, f.category, f.description,
    f.satuan, f.image_url, f.tags
  FROM public.foods f
  WHERE f.deleted_at IS NULL
  AND (p_category IS NULL OR f.category = p_category)
  ORDER BY f.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.list_foods(TEXT) IS 'List all foods, optionally filtered by category';

-- ==================== GRANT PERMISSIONS ====================

GRANT SELECT ON public.foods TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.foods TO authenticated;

GRANT EXECUTE ON FUNCTION public.generate_slug(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_food_by_slug(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_foods(TEXT, TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_foods(TEXT) TO anon, authenticated;

-- ==================== VERIFICATION ====================

DO $$
DECLARE
  total_records INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_records FROM public.foods WHERE deleted_at IS NULL;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'FOODS TABLE CREATED SUCCESSFULLY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total master commodities: %', total_records;
  RAISE NOTICE '';
  RAISE NOTICE 'Table structure:';
  RAISE NOTICE '  ✓ foods (master data)';
  RAISE NOTICE '  ✓ Unique slug & name constraints';
  RAISE NOTICE '  ✓ Full-text search enabled';
  RAISE NOTICE '  ✓ Auto-slug generation';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions created:';
  RAISE NOTICE '  ✓ generate_slug(text)';
  RAISE NOTICE '  ✓ get_food_by_slug(slug)';
  RAISE NOTICE '  ✓ search_foods(term, category, limit)';
  RAISE NOTICE '  ✓ list_foods(category)';
  RAISE NOTICE '';
  RAISE NOTICE 'Old food_prices table dropped';
  RAISE NOTICE 'Run migration 005 to recreate food_prices';
  RAISE NOTICE '========================================';
END $$;

