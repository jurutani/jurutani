// Nuxt 4 plugin for Auth initialization
export default defineNuxtPlugin(async () => {
    const { initialize } = useAuth()
    await initialize()
})
