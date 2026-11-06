export default defineNuxtRouteMiddleware((to) => {
  if (!to.params[ROUTE_PARAM_KEYS.playlist.id]) {
    return navigateTo({
      name: ROUTE_NAMES.playlists,
    });
  }
});
