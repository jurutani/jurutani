export default defineNuxtRouteMiddleware((to, from) => {
  const userAgent = useRequestHeaders()['user-agent'] || ''
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent)

  if (isBot) return // jangan redirect jika bot

  const firstVisit = useCookie('firstVisit', { maxAge: 86400 })

  if (!firstVisit.value && to.path === '/') {
    firstVisit.value = 'visited'
    return navigateTo('/welcome')
  }
})
