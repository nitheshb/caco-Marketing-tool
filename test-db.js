require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: media } = await supabase.from('media_assets').select('*');
  console.log("Media count:", media?.length);
  const { data: folders } = await supabase.from('folders').select('*');
  console.log("Folders count:", folders?.length);
  const { data: videos } = await supabase.from('videos').select('*');
  console.log("Videos count:", videos?.length);
  if (media && media.length > 0) {
     console.log("Sample media user_id:", media[0].user_id);
  }
}
run();
