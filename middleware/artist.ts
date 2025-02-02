export default defineNuxtRouteMiddleware((to) => {
  if (!to.params.id) {
    return navigateTo('/artists');
  }
});
