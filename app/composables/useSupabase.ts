import { createClient } from '@supabase/supabase-js'

/**
 * Composable untuk menyediakan Supabase client instance
 * Menggunakan singleton pattern untuk memastikan hanya ada satu instance
 */

// Singleton Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const useSupabase = () => {
  const config = useRuntimeConfig()

  // Create singleton instance
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      config.public.supabaseUrl,
      config.public.supabaseKey
    )
  }

  return {
    supabase: supabaseInstance
  }
}