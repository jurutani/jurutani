export default defineNuxtRouteMiddleware((to, from) => {
  const userAgent = useRequestHeaders()['user-agent'] || ''
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent)

  if (isBot) return // jangan redirect jika bot

  // Modal akan menangani first visit, jadi middleware tidak perlu melakukan apa-apa
  // Cookie 'firstVisit' akan diset oleh component FirstVisitModal
})
