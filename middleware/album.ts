export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.params.id) {
    return navigateTo('/albums');
  }
});
