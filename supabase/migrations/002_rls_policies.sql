-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Author: Senior Backend Developer
-- Purpose: Secure and optimized RLS policies to minimize server load
-- Strategy: Granular access control with performance optimization
-- =====================================================

-- ==================== ENABLE RLS ON ALL TABLES ====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_expert ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_stats ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Public can view all profiles (for user discovery)
CREATE POLICY "profiles_select_all"
ON public.profiles FOR SELECT
USING (deleted_at IS NULL);

-- Users can insert their own profile (on signup)
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Only admins can delete profiles (soft delete)
CREATE POLICY "profiles_delete_admin"
ON public.profiles FOR UPDATE
USING (is_admin() AND deleted_at IS NULL)
WITH CHECK (is_admin());

-- =====================================================
-- CONVERSATIONS TABLE POLICIES
-- =====================================================

-- Users can view their own conversations
CREATE POLICY "conversations_select_own"
ON public.conversations FOR SELECT
USING (
  participant1_id = auth.uid() OR 
  participant2_id = auth.uid()
);

-- Users can create conversations
CREATE POLICY "conversations_insert_own"
ON public.conversations FOR INSERT
WITH CHECK (
  participant1_id = auth.uid() OR 
  participant2_id = auth.uid()
);

-- Participants can update conversation (e.g., last_message)
CREATE POLICY "conversations_update_participant"
ON public.conversations FOR UPDATE
USING (
  participant1_id = auth.uid() OR 
  participant2_id = auth.uid()
);

-- =====================================================
-- MESSAGES TABLE POLICIES
-- =====================================================

-- Conversation participants can view messages
CREATE POLICY "messages_select_participant"
ON public.messages FOR SELECT
USING (is_conversation_participant(conversation_id));

-- Users can insert messages in their conversations
CREATE POLICY "messages_insert_participant"
ON public.messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND 
  is_conversation_participant(conversation_id)
);

-- Senders can update their own messages (e.g., editing)
CREATE POLICY "messages_update_sender"
ON public.messages FOR UPDATE
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Participants can update messages (e.g., mark as read)
CREATE POLICY "messages_update_participant"
ON public.messages FOR UPDATE
USING (is_conversation_participant(conversation_id));

-- =====================================================
-- PARTICIPANTS TABLE POLICIES
-- =====================================================

-- Users can view participants of their conversations
CREATE POLICY "participants_select_own"
ON public.participants FOR SELECT
USING (user_id = auth.uid() OR is_conversation_participant(conversation_id));

-- Users can insert themselves as participants
CREATE POLICY "participants_insert_own"
ON public.participants FOR INSERT
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "notifications_select_own"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

-- System can insert notifications (via function)
CREATE POLICY "notifications_insert_system"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own"
ON public.notifications FOR DELETE
USING (user_id = auth.uid());

-- =====================================================
-- DEVICE_TOKENS TABLE POLICIES
-- =====================================================

-- Users can view their own device tokens
CREATE POLICY "device_tokens_select_own"
ON public.device_tokens FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own device tokens
CREATE POLICY "device_tokens_insert_own"
ON public.device_tokens FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own device tokens
CREATE POLICY "device_tokens_update_own"
ON public.device_tokens FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own device tokens
CREATE POLICY "device_tokens_delete_own"
ON public.device_tokens FOR DELETE
USING (user_id = auth.uid());

-- =====================================================
-- EXPERTS TABLE POLICIES
-- =====================================================

-- Public can view all experts
CREATE POLICY "experts_select_all"
ON public.experts FOR SELECT
USING (deleted_at IS NULL);

-- Users can insert their own expert profile
CREATE POLICY "experts_insert_own"
ON public.experts FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own expert profile
CREATE POLICY "experts_update_own"
ON public.experts FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can update any expert profile
CREATE POLICY "experts_update_admin"
ON public.experts FOR UPDATE
USING (is_admin());

-- Admins can delete expert profiles
CREATE POLICY "experts_delete_admin"
ON public.experts FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- INSTRUCTORS TABLE POLICIES
-- =====================================================

-- Public can view all instructors
CREATE POLICY "instructors_select_all"
ON public.instructors FOR SELECT
USING (deleted_at IS NULL);

-- Users can insert their own instructor profile
CREATE POLICY "instructors_insert_own"
ON public.instructors FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own instructor profile
CREATE POLICY "instructors_update_own"
ON public.instructors FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can update any instructor profile
CREATE POLICY "instructors_update_admin"
ON public.instructors FOR UPDATE
USING (is_admin());

-- Admins can delete instructor profiles
CREATE POLICY "instructors_delete_admin"
ON public.instructors FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- MARKETS TABLE POLICIES
-- =====================================================

-- Public can view published markets
CREATE POLICY "markets_select_published"
ON public.markets FOR SELECT
USING (
  deleted_at IS NULL AND
  (status = 'published' OR user_id = auth.uid() OR is_admin())
);

-- Authenticated users can insert markets
CREATE POLICY "markets_insert_authenticated"
ON public.markets FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  user_id = auth.uid()
);

-- Users can update their own markets
CREATE POLICY "markets_update_own"
ON public.markets FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can update any market
CREATE POLICY "markets_update_admin"
ON public.markets FOR UPDATE
USING (is_admin());

-- Users can delete their own markets (soft delete)
CREATE POLICY "markets_delete_own"
ON public.markets FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can delete any market
CREATE POLICY "markets_delete_admin"
ON public.markets FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- NEWS TABLE POLICIES
-- =====================================================

-- Public can view published news
CREATE POLICY "news_select_published"
ON public.news FOR SELECT
USING (
  deleted_at IS NULL AND
  (status_news = 'published' OR user_id = auth.uid() OR is_admin())
);

-- Authenticated users can insert news
CREATE POLICY "news_insert_authenticated"
ON public.news FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  user_id = auth.uid()
);

-- Users can update their own news
CREATE POLICY "news_update_own"
ON public.news FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can update any news
CREATE POLICY "news_update_admin"
ON public.news FOR UPDATE
USING (is_admin());

-- Users can delete their own news (soft delete)
CREATE POLICY "news_delete_own"
ON public.news FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can delete any news
CREATE POLICY "news_delete_admin"
ON public.news FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- COURSES TABLE POLICIES
-- =====================================================

-- Public can view non-archived courses
CREATE POLICY "courses_select_public"
ON public.courses FOR SELECT
USING (deleted_at IS NULL AND archived_at IS NULL);

-- Admins can view all courses
CREATE POLICY "courses_select_admin"
ON public.courses FOR SELECT
USING (is_admin());

-- Admins can insert courses
CREATE POLICY "courses_insert_admin"
ON public.courses FOR INSERT
WITH CHECK (is_admin());

-- Admins can update courses
CREATE POLICY "courses_update_admin"
ON public.courses FOR UPDATE
USING (is_admin());

-- Admins can delete courses
CREATE POLICY "courses_delete_admin"
ON public.courses FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- VIDEOS TABLE POLICIES
-- =====================================================

-- Public can view all videos
CREATE POLICY "videos_select_public"
ON public.videos FOR SELECT
USING (deleted_at IS NULL);

-- Admins can insert videos
CREATE POLICY "videos_insert_admin"
ON public.videos FOR INSERT
WITH CHECK (is_admin());

-- Admins can update videos
CREATE POLICY "videos_update_admin"
ON public.videos FOR UPDATE
USING (is_admin());

-- Admins can delete videos
CREATE POLICY "videos_delete_admin"
ON public.videos FOR DELETE
USING (is_admin());

-- =====================================================
-- MEETINGS TABLE POLICIES
-- =====================================================

-- Public can view non-archived meetings
CREATE POLICY "meetings_select_public"
ON public.meetings FOR SELECT
USING (deleted_at IS NULL AND archived_at IS NULL);

-- Authenticated users can insert meetings
CREATE POLICY "meetings_insert_authenticated"
ON public.meetings FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  author_id = auth.uid()
);

-- Authors can update their own meetings
CREATE POLICY "meetings_update_own"
ON public.meetings FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- Admins can update any meeting
CREATE POLICY "meetings_update_admin"
ON public.meetings FOR UPDATE
USING (is_admin());

-- Authors can delete their own meetings
CREATE POLICY "meetings_delete_own"
ON public.meetings FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- Admins can delete any meeting
CREATE POLICY "meetings_delete_admin"
ON public.meetings FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- BANNER TABLE POLICIES
-- =====================================================

-- Public can view all banners
CREATE POLICY "banner_select_public"
ON public.banner FOR SELECT
USING (deleted_at IS NULL);

-- Admins can insert banners
CREATE POLICY "banner_insert_admin"
ON public.banner FOR INSERT
WITH CHECK (is_admin());

-- Admins can update banners
CREATE POLICY "banner_update_admin"
ON public.banner FOR UPDATE
USING (is_admin());

-- Admins can delete banners
CREATE POLICY "banner_delete_admin"
ON public.banner FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- CATEGORY TABLES POLICIES (category, category_expert, category_markets, category_news)
-- =====================================================

-- Public can view all categories
CREATE POLICY "category_select_public"
ON public.category FOR SELECT
USING (deleted_at IS NULL);

CREATE POLICY "category_expert_select_public"
ON public.category_expert FOR SELECT
USING (deleted_at IS NULL);

CREATE POLICY "category_markets_select_public"
ON public.category_markets FOR SELECT
USING (deleted_at IS NULL);

CREATE POLICY "category_news_select_public"
ON public.category_news FOR SELECT
USING (deleted_at IS NULL);

-- Admins can manage all categories
CREATE POLICY "category_insert_admin"
ON public.category FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "category_expert_insert_admin"
ON public.category_expert FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "category_markets_insert_admin"
ON public.category_markets FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "category_news_insert_admin"
ON public.category_news FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "category_update_admin"
ON public.category FOR UPDATE
USING (is_admin());

CREATE POLICY "category_expert_update_admin"
ON public.category_expert FOR UPDATE
USING (is_admin());

CREATE POLICY "category_markets_update_admin"
ON public.category_markets FOR UPDATE
USING (is_admin());

CREATE POLICY "category_news_update_admin"
ON public.category_news FOR UPDATE
USING (is_admin());

CREATE POLICY "category_delete_admin"
ON public.category FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "category_expert_delete_admin"
ON public.category_expert FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "category_markets_delete_admin"
ON public.category_markets FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "category_news_delete_admin"
ON public.category_news FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- HERO_DATA TABLE POLICIES
-- =====================================================

-- Public can view active hero data
CREATE POLICY "hero_data_select_public"
ON public.hero_data FOR SELECT
USING (deleted_at IS NULL AND status = 'active');

-- Admins can view all hero data
CREATE POLICY "hero_data_select_admin"
ON public.hero_data FOR SELECT
USING (is_admin());

-- Admins can insert hero data
CREATE POLICY "hero_data_insert_admin"
ON public.hero_data FOR INSERT
WITH CHECK (is_admin());

-- Admins can update hero data
CREATE POLICY "hero_data_update_admin"
ON public.hero_data FOR UPDATE
USING (is_admin());

-- Admins can delete hero data
CREATE POLICY "hero_data_delete_admin"
ON public.hero_data FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- DISTRICTS TABLE POLICIES
-- =====================================================

-- Public can view all districts (read-only reference data)
CREATE POLICY "districts_select_public"
ON public.districts FOR SELECT
USING (true);

-- Admins can manage districts
CREATE POLICY "districts_insert_admin"
ON public.districts FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "districts_update_admin"
ON public.districts FOR UPDATE
USING (is_admin());

CREATE POLICY "districts_delete_admin"
ON public.districts FOR DELETE
USING (is_admin());

-- =====================================================
-- VISIT_STATS TABLE POLICIES
-- =====================================================

-- Public can view visit stats
CREATE POLICY "visit_stats_select_public"
ON public.visit_stats FOR SELECT
USING (true);

-- System can insert/update visit stats (via function)
CREATE POLICY "visit_stats_insert_system"
ON public.visit_stats FOR INSERT
WITH CHECK (true);

CREATE POLICY "visit_stats_update_system"
ON public.visit_stats FOR UPDATE
USING (true);

-- Admins can delete visit stats
CREATE POLICY "visit_stats_delete_admin"
ON public.visit_stats FOR DELETE
USING (is_admin());

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Grant select on all tables to anon (with RLS restrictions)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant all on all tables to authenticated (with RLS restrictions)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant execute on all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;
