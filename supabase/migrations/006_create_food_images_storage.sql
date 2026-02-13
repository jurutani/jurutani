-- =====================================================
-- CREATE FOOD IMAGES STORAGE BUCKET
-- =====================================================
-- Author: Senior Backend Developer
-- Purpose: Storage bucket for food commodity images
-- Date: 2026-02-14
-- =====================================================

-- ==================== CREATE STORAGE BUCKET ====================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'food-images',
  'food-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ==================== STORAGE POLICIES ====================

-- Public can view images
CREATE POLICY "food_images_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'food-images');

-- Authenticated users can upload images
CREATE POLICY "food_images_insert_authenticated"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'food-images' 
  AND auth.role() = 'authenticated'
);

-- Users can update their own uploads or admins can update any
CREATE POLICY "food_images_update_owner_or_admin"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'food-images' 
  AND (
    auth.uid() = owner 
    OR is_admin()
  )
);

-- Users can delete their own uploads or admins can delete any
CREATE POLICY "food_images_delete_owner_or_admin"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'food-images' 
  AND (
    auth.uid() = owner 
    OR is_admin()
  )
);

-- ==================== HELPER FUNCTIONS ====================

-- Get public URL for storage object
CREATE OR REPLACE FUNCTION public.get_food_image_url(
  p_file_path TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_base_url TEXT;
BEGIN
  -- Get Supabase project URL from settings or use placeholder
  v_base_url := current_setting('app.supabase_url', true);
  
  IF v_base_url IS NULL THEN
    v_base_url := 'https://your-project.supabase.co';
  END IF;
  
  RETURN v_base_url || '/storage/v1/object/public/food-images/' || p_file_path;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.get_food_image_url(TEXT) IS 'Generate public URL for food image';

-- Update food image URL from storage path
CREATE OR REPLACE FUNCTION public.update_food_image(
  p_food_id UUID,
  p_file_path TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_image_url TEXT;
BEGIN
  v_image_url := public.get_food_image_url(p_file_path);
  
  UPDATE public.foods
  SET 
    image_url = v_image_url,
    updated_at = NOW()
  WHERE id = p_food_id
  AND deleted_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.update_food_image(UUID, TEXT) IS 'Update food with new image URL from storage';

-- ==================== GRANT PERMISSIONS ====================

GRANT EXECUTE ON FUNCTION public.get_food_image_url(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_food_image(UUID, TEXT) TO authenticated;

-- ==================== VERIFICATION ====================

DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM storage.buckets WHERE id = 'food-images'
  ) INTO bucket_exists;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'STORAGE BUCKET SETUP COMPLETED';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Bucket created: %', bucket_exists;
  RAISE NOTICE 'Bucket name: food-images';
  RAISE NOTICE 'Public access: Yes';
  RAISE NOTICE 'File size limit: 5MB';
  RAISE NOTICE 'Allowed formats: JPEG, PNG, WebP, GIF';
  RAISE NOTICE '';
  RAISE NOTICE 'Storage policies:';
  RAISE NOTICE '  ✓ Public read access';
  RAISE NOTICE '  ✓ Authenticated users can upload';
  RAISE NOTICE '  ✓ Owners/admins can update & delete';
  RAISE NOTICE '';
  RAISE NOTICE 'Helper functions:';
  RAISE NOTICE '  ✓ get_food_image_url(path)';
  RAISE NOTICE '  ✓ update_food_image(id, path)';
  RAISE NOTICE '========================================';
END $$;
