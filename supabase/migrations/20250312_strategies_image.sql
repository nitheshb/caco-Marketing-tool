-- Add cover image URL to strategies
ALTER TABLE public.strategies ADD COLUMN IF NOT EXISTS image_url TEXT;
