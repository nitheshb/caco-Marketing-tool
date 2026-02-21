DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  email text,
  name text,
  created_at timestamp with time zone DEFAULT now(),
  credits bigint DEFAULT 0,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_user_id_key UNIQUE (user_id),
  CONSTRAINT users_email_key UNIQUE (email)
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;





-- Create social_connections table
CREATE TABLE IF NOT EXISTS public.social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  profile_name TEXT,
  access_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Enable RLS for social_connections
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

-- Create series table
CREATE TABLE IF NOT EXISTS public.series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  niche TEXT,
  is_custom_niche BOOLEAN DEFAULT FALSE,
  language TEXT,
  voice TEXT,
  model_name TEXT,
  model_lang_code TEXT,
  background_music TEXT,
  video_style TEXT,
  caption_style TEXT,
  series_name TEXT,
  duration TEXT,
  platforms JSONB,
  publish_time TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for series
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID NOT NULL REFERENCES public.series(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  title TEXT,
  script JSONB,
  voiceover_url TEXT,
  captions JSONB,
  images JSONB,
  video_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Storage Bucket: voiceovers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('voiceovers', 'voiceovers', true)
ON CONFLICT (id) DO NOTHING;

