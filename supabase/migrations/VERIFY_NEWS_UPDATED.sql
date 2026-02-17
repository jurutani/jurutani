-- ============================================================
-- VERIFICATION SCRIPT - Run after migration
-- ============================================================

-- 1. Check if news_updated table exists
SELECT 
  'news_updated table' as check_item,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'news_updated'
    ) THEN '✅ EXISTS'
    ELSE '❌ NOT FOUND'
  END as status;

-- 2. Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'news_updated'
ORDER BY ordinal_position;

-- 3. Check indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'news_updated'
ORDER BY indexname;

-- 4. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'news_updated'
ORDER BY policyname;

-- 5. Check triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'news_updated';

-- 6. Verify storage buckets (MUST EXIST)
SELECT 
  id as bucket_id,
  name,
  public,
  created_at,
  CASE 
    WHEN id IN ('news-images', 'news-attachments') THEN '✅ READY'
    ELSE '⚠️ UNEXPECTED'
  END as status
FROM storage.buckets
WHERE id IN ('news-images', 'news-attachments');

-- 7. Check storage policies for news-images
SELECT 
  name as policy_name,
  definition
FROM storage.policies
WHERE bucket_id = 'news-images';

-- 8. Check storage policies for news-attachments
SELECT 
  name as policy_name,
  definition
FROM storage.policies
WHERE bucket_id = 'news-attachments';

-- 9. Test insert (will be rolled back)
DO $$
DECLARE
  test_id uuid;
BEGIN
  -- Create test record
  INSERT INTO news_updated (
    title,
    content,
    category,
    status_news,
    slug
  ) VALUES (
    'Test Article',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Test content"}]}]}'::jsonb,
    'test',
    'pending',
    'test-article-' || extract(epoch from now())::text
  ) RETURNING id INTO test_id;

  RAISE NOTICE 'Test insert: ✅ SUCCESS (id: %)', test_id;

  -- Clean up test data
  DELETE FROM news_updated WHERE id = test_id;
  RAISE NOTICE 'Test cleanup: ✅ DONE';

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Test insert: ❌ FAILED - %', SQLERRM;
END $$;

-- 10. Summary
SELECT 
  'news_updated' as table_name,
  (SELECT COUNT(*) FROM news_updated) as total_records,
  (SELECT COUNT(*) FROM news_updated WHERE status_news = 'approved') as approved,
  (SELECT COUNT(*) FROM news_updated WHERE status_news = 'pending') as pending,
  (SELECT COUNT(*) FROM news_updated WHERE status_news = 'rejected') as rejected,
  (SELECT COUNT(*) FROM news_updated WHERE deleted_at IS NULL) as active;

-- ============================================================
-- IF ALL CHECKS PASS, YOU'RE READY TO GO! 🎉
-- ============================================================
