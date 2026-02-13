-- =====================================================
-- HELPER FUNCTIONS FOR RLS POLICIES
-- =====================================================
-- Author: Senior Backend Developer
-- Purpose: Optimized helper functions to minimize server load
-- =====================================================

-- ==================== CHECK IF USER IS ADMIN ====================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT is_admin 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND deleted_at IS NULL
    LIMIT 1
  ) = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_admin() IS 'Check if current user is admin';

-- ==================== CHECK IF USER OWNS PROFILE ====================
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_profile_owner(UUID) IS 'Check if current user owns the profile';

-- ==================== CHECK IF USER IS CONVERSATION PARTICIPANT ====================
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conversation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_conversation_participant(UUID) IS 'Check if current user is participant in conversation';

-- ==================== GET USER ROLE ====================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND deleted_at IS NULL
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_user_role() IS 'Get current user role';

-- ==================== CHECK IF USER IS EXPERT ====================
CREATE OR REPLACE FUNCTION public.is_expert()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.experts 
    WHERE user_id = auth.uid() 
    AND deleted_at IS NULL
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_expert() IS 'Check if current user is an expert';

-- ==================== CHECK IF USER IS INSTRUCTOR ====================
CREATE OR REPLACE FUNCTION public.is_instructor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.instructors 
    WHERE user_id = auth.uid() 
    AND deleted_at IS NULL
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_instructor() IS 'Check if current user is an instructor';

-- ==================== CHECK IF USER OWNS MARKET ITEM ====================
CREATE OR REPLACE FUNCTION public.is_market_owner(market_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.markets 
    WHERE id = market_id 
    AND user_id = auth.uid()
    AND deleted_at IS NULL
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_market_owner(UUID) IS 'Check if current user owns the market item';

-- ==================== CHECK IF USER IS NEWS AUTHOR ====================
CREATE OR REPLACE FUNCTION public.is_news_author(news_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.news 
    WHERE id = news_id 
    AND user_id = auth.uid()
    AND deleted_at IS NULL
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_news_author(UUID) IS 'Check if current user is the author of the news';

-- ==================== CHECK IF USER IS MEETING AUTHOR ====================
CREATE OR REPLACE FUNCTION public.is_meeting_author(meeting_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.meetings 
    WHERE id = meeting_id 
    AND author_id = auth.uid()
    AND deleted_at IS NULL
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_meeting_author(UUID) IS 'Check if current user is the author of the meeting';

-- ==================== GET UNREAD MESSAGES COUNT ====================
CREATE OR REPLACE FUNCTION public.get_unread_messages_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.messages m
    INNER JOIN public.conversations c ON m.conversation_id = c.id
    WHERE (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    AND m.sender_id != auth.uid()
    AND m.is_read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_unread_messages_count() IS 'Get count of unread messages for current user';

-- ==================== GET UNREAD NOTIFICATIONS COUNT ====================
CREATE OR REPLACE FUNCTION public.get_unread_notifications_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.notifications
    WHERE user_id = auth.uid()
    AND is_read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_unread_notifications_count() IS 'Get count of unread notifications for current user';

-- ==================== MARK ALL NOTIFICATIONS AS READ ====================
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = true, updated_at = NOW()
  WHERE user_id = auth.uid() AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.mark_all_notifications_read() IS 'Mark all notifications as read for current user';

-- ==================== MARK CONVERSATION MESSAGES AS READ ====================
CREATE OR REPLACE FUNCTION public.mark_conversation_messages_read(conversation_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.messages
  SET is_read = true, updated_at = NOW()
  WHERE conversation_id = $1
  AND sender_id != auth.uid()
  AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.mark_conversation_messages_read(UUID) IS 'Mark all messages in conversation as read for current user';

-- ==================== CREATE OR GET CONVERSATION ====================
CREATE OR REPLACE FUNCTION public.create_or_get_conversation(other_user_id UUID)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Check if conversation already exists
  SELECT id INTO conversation_id
  FROM public.conversations
  WHERE (participant1_id = current_user_id AND participant2_id = other_user_id)
     OR (participant1_id = other_user_id AND participant2_id = current_user_id)
  LIMIT 1;
  
  -- If not exists, create new conversation
  IF conversation_id IS NULL THEN
    INSERT INTO public.conversations (participant1_id, participant2_id)
    VALUES (current_user_id, other_user_id)
    RETURNING id INTO conversation_id;
  END IF;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.create_or_get_conversation(UUID) IS 'Create new conversation or get existing one between two users';

-- ==================== UPDATE CONVERSATION LAST MESSAGE ====================
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_conversation_last_message() IS 'Trigger function to update conversation last message';

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON public.messages;
CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_last_message();

-- ==================== SEND NOTIFICATION ====================
CREATE OR REPLACE FUNCTION public.send_notification(
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, body, data)
  VALUES (p_user_id, p_title, p_body, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.send_notification(UUID, TEXT, TEXT, JSONB) IS 'Send notification to user';

-- ==================== AUTO UPDATE UPDATED_AT ====================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger function to auto update updated_at column';

-- ==================== SOFT DELETE ====================
CREATE OR REPLACE FUNCTION public.soft_delete()
RETURNS TRIGGER AS $$
BEGIN
  NEW.deleted_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.soft_delete() IS 'Trigger function for soft delete';

-- ==================== SEARCH USERS ====================
CREATE OR REPLACE FUNCTION public.search_users(search_term TEXT, user_limit INT DEFAULT 20)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  role TEXT,
  bio TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.role,
    p.bio
  FROM public.profiles p
  WHERE p.deleted_at IS NULL
  AND (
    p.full_name ILIKE '%' || search_term || '%'
    OR p.username ILIKE '%' || search_term || '%'
    OR p.email ILIKE '%' || search_term || '%'
  )
  ORDER BY 
    CASE 
      WHEN p.username ILIKE search_term THEN 1
      WHEN p.full_name ILIKE search_term THEN 2
      ELSE 3
    END,
    p.full_name
  LIMIT user_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.search_users(TEXT, INT) IS 'Search users by name, username, or email';

-- ==================== GET USER STATS ====================
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'markets_count', (
      SELECT COUNT(*) FROM public.markets 
      WHERE user_id = p_user_id AND deleted_at IS NULL
    ),
    'news_count', (
      SELECT COUNT(*) FROM public.news 
      WHERE user_id = p_user_id AND deleted_at IS NULL
    ),
    'is_expert', (
      SELECT EXISTS(SELECT 1 FROM public.experts WHERE user_id = p_user_id AND deleted_at IS NULL)
    ),
    'is_instructor', (
      SELECT EXISTS(SELECT 1 FROM public.instructors WHERE user_id = p_user_id AND deleted_at IS NULL)
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_user_stats(UUID) IS 'Get user statistics';

-- ==================== CREATE INDEXES FOR PERFORMANCE ====================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role) WHERE deleted_at IS NULL;

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON public.conversations(participant1_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON public.conversations(participant2_id, last_message_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(conversation_id, is_read) WHERE is_read = false;

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- Markets indexes
CREATE INDEX IF NOT EXISTS idx_markets_user ON public.markets(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_markets_category ON public.markets(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_markets_slug ON public.markets(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_markets_status ON public.markets(status) WHERE deleted_at IS NULL;

-- News indexes
CREATE INDEX IF NOT EXISTS idx_news_user ON public.news(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status_news) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published_at DESC) WHERE deleted_at IS NULL AND status_news = 'published';

-- Courses indexes
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug) WHERE deleted_at IS NULL;

-- Videos indexes
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category) WHERE deleted_at IS NULL;

-- Experts indexes
CREATE INDEX IF NOT EXISTS idx_experts_user ON public.experts(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_experts_category ON public.experts(category) WHERE deleted_at IS NULL;

-- Instructors indexes
CREATE INDEX IF NOT EXISTS idx_instructors_user ON public.instructors(user_id) WHERE deleted_at IS NULL;

-- Device tokens indexes
CREATE INDEX IF NOT EXISTS idx_device_tokens_user ON public.device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_token ON public.device_tokens(token);
