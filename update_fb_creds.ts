import { supabaseAdmin } from "./lib/supabase";

async function main() {
  const { data, error } = await supabaseAdmin
    .from('social_integrations')
    .update({
      client_id: '1435914344699150',
      client_secret: '7aa75879876cbfecb806207686e4af29'
    })
    .eq('platform', 'instagram');

  if (error) {
    console.error("Error updating credentials:", error);
  } else {
    console.log("Successfully updated Instagram credentials in DB to use Facebook App ID/Secret.");
  }
}

main().catch(console.error);
