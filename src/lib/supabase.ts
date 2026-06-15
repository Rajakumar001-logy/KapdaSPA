import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const PLACEHOLDER_URL = 'https://placeholder.supabase.co'

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== PLACEHOLDER_URL &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey !== 'placeholder-key' &&
    supabaseAnonKey !== 'your-anon-key',
)

if (!isSupabaseConfigured) {
  console.error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before building (e.g. in Vercel → Settings → Environment Variables), then redeploy.',
  )
}

export const supabase = createClient(
  supabaseUrl ?? PLACEHOLDER_URL,
  supabaseAnonKey ?? 'placeholder-key',
)
