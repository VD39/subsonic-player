export default defineNuxtRouteMiddleware((to) => {
  if (
    !(
      to.params[ROUTE_PARAM_KEYS.genre.mediaType] &&
      to.params[ROUTE_PARAM_KEYS.genre.genre] &&
      [ROUTE_MEDIA_TYPE_PARAMS.Albums, ROUTE_MEDIA_TYPE_PARAMS.Tracks].includes(
        to.params[ROUTE_PARAM_KEYS.genre.mediaType] as never,
      )
    )
  ) {
    return navigateTo({
      name: ROUTE_NAMES.genres,
    });
  }
});
