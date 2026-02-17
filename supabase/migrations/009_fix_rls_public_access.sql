-- =====================================================
-- FIX RLS POLICIES FOR PUBLIC ACCESS
-- =====================================================
-- Author: Senior Backend Developer
-- Date: 2026-02-14
-- Purpose: Ensure public (anon) users can view all appropriate data
-- =====================================================

-- ==================== DROP EXISTING RESTRICTIVE POLICIES ====================

-- Drop restrictive hero_data policies
DROP POLICY IF EXISTS "hero_data_select_public" ON public.hero_data;

-- Drop restrictive markets policies
DROP POLICY IF EXISTS "markets_select_published" ON public.markets;

-- Drop restrictive news policies
DROP POLICY IF EXISTS "news_select_published" ON public.news;

-- ==================== CREATE NEW PUBLIC POLICIES ====================

-- =====================================================
-- HERO_DATA TABLE - Public can view active only
-- =====================================================

CREATE POLICY "hero_data_select_public"
ON public.hero_data FOR SELECT
USING (deleted_at IS NULL AND status = 'active');

-- Note: Admin policy still exists for viewing all including deleted
-- "hero_data_select_admin" already allows admins to see everything

-- =====================================================
-- MARKETS TABLE - Public can view all non-deleted
-- =====================================================

-- Public can view all non-deleted markets (regardless of status)
-- Note: markets.status can be 'Pending', 'Approved', etc. but no strict constraint exists
CREATE POLICY "markets_select_public"
ON public.markets FOR SELECT
USING (deleted_at IS NULL);

-- Users can view their own markets (including deleted/archived)
CREATE POLICY "markets_select_own"
ON public.markets FOR SELECT
USING (user_id = auth.uid());

-- =====================================================
-- NEWS TABLE - Public can view all approved news
-- =====================================================

-- Public can view approved news (status_news = 'approved')
CREATE POLICY "news_select_public"
ON public.news FOR SELECT
USING (
  deleted_at IS NULL AND
  status_news = 'approved'
);

-- Users can view their own news (all statuses)
CREATE POLICY "news_select_own"
ON public.news FOR SELECT
USING (user_id = auth.uid());

-- Note: Admin policy "news_update_admin" already allows admins full access

-- =====================================================
-- ADDITIONAL IMPROVEMENTS
-- =====================================================

-- Ensure GRANT permissions are set correctly
GRANT SELECT ON public.hero_data TO anon, authenticated;
GRANT SELECT ON public.markets TO anon, authenticated;
GRANT SELECT ON public.news TO anon, authenticated;
GRANT SELECT ON public.food_prices TO anon, authenticated;
GRANT SELECT ON public.banner TO anon, authenticated;
GRANT SELECT ON public.category TO anon, authenticated;
GRANT SELECT ON public.category_expert TO anon, authenticated;
GRANT SELECT ON public.category_markets TO anon, authenticated;
GRANT SELECT ON public.category_news TO anon, authenticated;
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT SELECT ON public.videos TO anon, authenticated;
GRANT SELECT ON public.meetings TO anon, authenticated;
GRANT SELECT ON public.experts TO anon, authenticated;
GRANT SELECT ON public.instructors TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.districts TO anon, authenticated;
GRANT SELECT ON public.visit_stats TO anon, authenticated;

-- =====================================================
-- FIX INCORRECT INDEX (from 001_helper_functions.sql)
-- =====================================================

-- Drop incorrect index that uses 'published' instead of 'approved'
DROP INDEX IF EXISTS public.idx_news_published;

-- Create correct index with 'approved' status
CREATE INDEX IF NOT EXISTS idx_news_approved 
ON public.news(published_at DESC) 
WHERE deleted_at IS NULL AND status_news = 'approved';

COMMENT ON INDEX idx_news_approved 
IS 'Index for approved news sorted by publish date';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- To verify the policies are working, run these as anon user:
-- SELECT count(*) FROM public.hero_data WHERE deleted_at IS NULL AND status = 'active';
-- SELECT count(*) FROM public.markets WHERE deleted_at IS NULL;
-- SELECT count(*) FROM public.news WHERE status_news = 'approved' AND deleted_at IS NULL;
-- SELECT count(*) FROM public.food_prices WHERE deleted_at IS NULL;

-- Verify news statuses:
-- SELECT status_news, count(*) FROM public.news GROUP BY status_news;

COMMENT ON POLICY "hero_data_select_public" ON public.hero_data 
IS 'Public can view active hero data only (status = active)';

COMMENT ON POLICY "markets_select_public" ON public.markets 
IS 'Public can view all non-deleted markets for discovery';

COMMENT ON POLICY "markets_select_own" ON public.markets 
IS 'Users can view their own markets including archived/deleted';

COMMENT ON POLICY "news_select_public" ON public.news 
IS 'Public can view approved news only';

COMMENT ON POLICY "news_select_own" ON public.news 
IS 'Users can view all their own news regardless of status';
