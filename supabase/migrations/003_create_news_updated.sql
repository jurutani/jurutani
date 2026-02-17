-- Create news_updated table with multi-image and rich content support
CREATE TABLE IF NOT EXISTS public.news_updated (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  sub_title text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL,
  link text,
  status_news text NOT NULL DEFAULT 'pending'::text CHECK (status_news = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  published_at timestamp with time zone,
  deleted_at timestamp with time zone,
  user_id uuid,
  cover_image text,
  images jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  slug text UNIQUE,
  CONSTRAINT news_updated_pkey PRIMARY KEY (id),
  CONSTRAINT news_updated_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT news_updated_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_news_updated_images ON public.news_updated USING GIN (images);
CREATE INDEX IF NOT EXISTS idx_news_updated_attachments ON public.news_updated USING GIN (attachments);
CREATE INDEX IF NOT EXISTS idx_news_updated_content ON public.news_updated USING GIN (content);
CREATE INDEX IF NOT EXISTS idx_news_updated_slug ON public.news_updated(slug);
CREATE INDEX IF NOT EXISTS idx_news_updated_status ON public.news_updated(status_news);
CREATE INDEX IF NOT EXISTS idx_news_updated_category ON public.news_updated(category);

-- Enable Row Level Security
ALTER TABLE public.news_updated ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (safe re-run)
DROP POLICY IF EXISTS "Public users can view approved news_updated" ON public.news_updated;
DROP POLICY IF EXISTS "Authenticated users can insert news_updated" ON public.news_updated;
DROP POLICY IF EXISTS "Users can update their own news_updated" ON public.news_updated;
DROP POLICY IF EXISTS "Users can view their own news_updated" ON public.news_updated;
DROP POLICY IF EXISTS "Admins can view all news_updated" ON public.news_updated;
DROP POLICY IF EXISTS "Admins can update any news_updated" ON public.news_updated;

-- RLS Policies for news_updated

-- Public can view approved news
CREATE POLICY "Public users can view approved news_updated"
  ON public.news_updated
  FOR SELECT
  USING (status_news = 'approved' AND deleted_at IS NULL);

-- Authenticated users can insert news
CREATE POLICY "Authenticated users can insert news_updated"
  ON public.news_updated
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own news
CREATE POLICY "Users can update their own news_updated"
  ON public.news_updated
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view their own news regardless of status
CREATE POLICY "Users can view their own news_updated"
  ON public.news_updated
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view and update any news (using is_admin field from profiles)
CREATE POLICY "Admins can view all news_updated"
  ON public.news_updated
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update any news_updated"
  ON public.news_updated
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_news_updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if any (safe re-run)
DROP TRIGGER IF EXISTS update_news_updated_timestamp ON public.news_updated;

-- Trigger to call the function
CREATE TRIGGER update_news_updated_timestamp
  BEFORE UPDATE ON public.news_updated
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_timestamp();

-- Add comments for documentation
COMMENT ON TABLE public.news_updated IS 'News table with multi-image and rich content support using TipTap JSON format';
COMMENT ON COLUMN public.news_updated.content IS 'Rich text content in TipTap JSON format';
COMMENT ON COLUMN public.news_updated.cover_image IS 'Main/cover image URL or path';
COMMENT ON COLUMN public.news_updated.images IS 'Array of image URLs/paths for gallery';
COMMENT ON COLUMN public.news_updated.attachments IS 'Array of attachment objects with name, url, size, type';
