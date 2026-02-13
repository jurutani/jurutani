export default defineNuxtRouteMiddleware((to, from) => {
  const userAgent = useRequestHeaders()['user-agent'] || ''
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent)

  if (isBot) return
})
