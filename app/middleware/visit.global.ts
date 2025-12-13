import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtRouteMiddleware(async () => {
    if (import.meta.server) return

    const today = new Date().toISOString().slice(0, 10)
    const visited = useCookie('jt_visited_today', {
        expires: new Date(new Date().setHours(23, 59, 59, 999)) // Expire at end of day
    })

    // Check if already visited today
    if (visited.value === today) return

    const { supabase } = useSupabase()

    try {
        await supabase.rpc('increment_visit')
        visited.value = today // Store today's date
    } catch (error) {
        console.error('Failed to increment visit:', error)
    }
})
