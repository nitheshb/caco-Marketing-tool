-- Strategy Planner: strategies and strategy_posts tables
CREATE TABLE IF NOT EXISTS public.strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  business_type TEXT,
  brand_name TEXT,
  target_audience TEXT,
  goal TEXT,
  platforms TEXT[],
  theme TEXT,
  duration_days INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.strategy_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,
  theme TEXT,
  idea TEXT,
  caption TEXT,
  description TEXT,
  goal TEXT,
  status TEXT DEFAULT 'planned',
  include_in_calendar BOOLEAN DEFAULT TRUE,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.strategy_posts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_posts_strategy_id ON public.strategy_posts(strategy_id);
