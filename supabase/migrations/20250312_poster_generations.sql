-- Poster generations: store each generation for history and regenerate flow
CREATE TABLE IF NOT EXISTS public.poster_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  output_url TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  format TEXT,
  style TEXT,
  tone TEXT,
  prompt TEXT,
  negative_prompt TEXT,
  parent_id UUID REFERENCES public.poster_generations(id) ON DELETE SET NULL,
  saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.poster_generations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_poster_generations_user_id ON public.poster_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_poster_generations_parent_id ON public.poster_generations(parent_id);
CREATE INDEX IF NOT EXISTS idx_poster_generations_created_at ON public.poster_generations(created_at DESC);
