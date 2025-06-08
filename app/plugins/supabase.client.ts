// app/plugins/supabase.client.ts

import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Biar bisa diakses di seluruh app pakai `useSupabaseClient`
  nuxtApp.provide('supabase', supabase)
})
