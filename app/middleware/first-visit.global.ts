export default defineNuxtRouteMiddleware((to) => {
  const firstVisit = useCookie('firstVisit', {
    maxAge: 60 * 60 * 24 // 1 hari dalam detik (86400)
  })

  if (!firstVisit.value && to.path === '/') {
    firstVisit.value = 'visited'
    return navigateTo('/welcome')
  }
})
