import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: media, error: err1 } = await supabase.from('media_assets').select('*').limit(10);
  console.log("Media Assets:", media?.length, err1);
  const { data: folders, error: err2 } = await supabase.from('folders').select('*').limit(10);
  console.log("Folders:", folders?.length, err2);
  const { data: videos, error: err3 } = await supabase.from('videos').select('*').limit(10);
  console.log("Videos:", videos?.length, err3);
}
run();
