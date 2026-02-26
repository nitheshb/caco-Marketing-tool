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





-- Create social_integrations table for custom OAuth apps
CREATE TABLE IF NOT EXISTS public.social_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, client_id)
);
ALTER TABLE public.social_integrations ENABLE ROW LEVEL SECURITY;

-- Create social_connections table
CREATE TABLE IF NOT EXISTS public.social_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  integration_id UUID REFERENCES public.social_integrations(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  profile_name TEXT,
  platform_user_id TEXT,
  internal_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, platform_user_id)
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

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
  series_id UUID REFERENCES public.series(id) ON DELETE SET NULL,
  account_id UUID REFERENCES public.social_connections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT,
  type TEXT DEFAULT 'event',
  platform TEXT,
  color TEXT DEFAULT 'indigo',
  scheduled_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create folders table for media library
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Create media_assets table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for media_assets
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Storage Bucket: media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;
