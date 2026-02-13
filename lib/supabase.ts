import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Standard client for client-side interactions (if used without SSR)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client with full privileges (service role)
// WARNING: Only use this in server-side contexts (API routes, Server Actions, getServerSideProps)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
