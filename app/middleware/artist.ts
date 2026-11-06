export default defineNuxtRouteMiddleware((to) => {
  if (!to.params[ROUTE_PARAM_KEYS.artist.id]) {
    return navigateTo({
      name: ROUTE_NAMES.artists,
    });
  }
});
