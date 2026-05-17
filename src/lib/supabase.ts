import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const PDF_BUCKET = "pdf-uploads"

export function assertSupabaseConfigured() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    )
  }
}
