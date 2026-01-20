-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.banner (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  CONSTRAINT banner_pkey PRIMARY KEY (id)
);
CREATE TABLE public.category (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  CONSTRAINT category_pkey PRIMARY KEY (id)
);
CREATE TABLE public.category_expert (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  CONSTRAINT category_expert_pkey PRIMARY KEY (id)
);
CREATE TABLE public.category_markets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  CONSTRAINT category_markets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.category_news (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  CONSTRAINT category_news_pkey PRIMARY KEY (id)
);
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  participant1_id uuid NOT NULL,
  participant2_id uuid NOT NULL,
  last_message text,
  last_message_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT conversations_pkey PRIMARY KEY (id),
  CONSTRAINT conversations_participant1_id_fkey FOREIGN KEY (participant1_id) REFERENCES public.profiles(id),
  CONSTRAINT conversations_participant2_id_fkey FOREIGN KEY (participant2_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.courses (
  title text NOT NULL,
  description text,
  files jsonb,
  link_drive text,
  link_youtube text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  archived_at timestamp with time zone,
  category text DEFAULT 'Pertanian'::text,
  image_url text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.device_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  token text NOT NULL,
  platform text NOT NULL DEFAULT 'android'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT device_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT device_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.districts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  inserted_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  province text NOT NULL,
  CONSTRAINT districts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.experts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  category text,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  CONSTRAINT experts_pkey PRIMARY KEY (id),
  CONSTRAINT fk_profiles FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.hero_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  caption text,
  title text,
  description text,
  button_text text,
  button_link text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  status text,
  CONSTRAINT hero_data_pkey PRIMARY KEY (id)
);
CREATE TABLE public.instructors (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL UNIQUE,
  provinces text,
  district text,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  CONSTRAINT instructors_pkey PRIMARY KEY (id),
  CONSTRAINT fk_instructor_profile FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.markets (
  name text NOT NULL,
  description text NOT NULL,
  price numeric,
  price_range text,
  attachments text DEFAULT '[]'::jsonb,
  links jsonb DEFAULT '[]'::jsonb,
  category text NOT NULL,
  seller text NOT NULL,
  contact_seller text,
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  archived_at timestamp with time zone,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  status text DEFAULT 'Pending'::text,
  slug text UNIQUE,
  CONSTRAINT markets_pkey PRIMARY KEY (id),
  CONSTRAINT markets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT markets_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.meetings (
  title text NOT NULL,
  content text NOT NULL,
  link text,
  attachments jsonb DEFAULT '[]'::jsonb,
  organization text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  archived_at timestamp with time zone,
  author_id uuid,
  image_url text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  CONSTRAINT meetings_pkey PRIMARY KEY (id),
  CONSTRAINT announcement_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id),
  CONSTRAINT fk_profiles FOREIGN KEY (author_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL CHECK (length(TRIM(BOTH FROM content)) > 0),
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  image_url text,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.news (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  sub_title text,
  content text NOT NULL,
  category text NOT NULL,
  link text,
  status_news text NOT NULL DEFAULT 'pending'::text CHECK (status_news = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  published_at timestamp with time zone,
  deleted_at timestamp with time zone,
  user_id uuid,
  image_url text,
  attachment_url text,
  slug text UNIQUE,
  CONSTRAINT news_pkey PRIMARY KEY (id),
  CONSTRAINT news_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT news_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.participants (
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT participants_pkey PRIMARY KEY (conversation_id, user_id),
  CONSTRAINT participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text UNIQUE CHECK (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  website text,
  phone text UNIQUE,
  bio text,
  is_admin boolean DEFAULT false,
  role text DEFAULT 'petani'::text CHECK (role = ANY (ARRAY['pakar'::text, 'petani'::text, 'penyuluh'::text, 'admin'::text])),
  birth_date date,
  deleted_at timestamp with time zone,
  archived_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  address text,
  email text UNIQUE,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.videos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  description text,
  link_yt text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at timestamp with time zone,
  category text DEFAULT 'Pertanian'::text,
  slug text UNIQUE,
  CONSTRAINT videos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.visit_stats (
  date date NOT NULL,
  count bigint NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visit_stats_pkey PRIMARY KEY (date)
);