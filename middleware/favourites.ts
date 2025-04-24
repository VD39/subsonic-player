export default defineNuxtRouteMiddleware((to) => {
  if (
    !(
      to.params[ROUTE_PARAM_KEYS.favourites.mediaType] &&
      Object.values(ROUTE_MEDIA_TYPE_PARAMS).includes(
        to.params[ROUTE_PARAM_KEYS.favourites.mediaType] as never,
      )
    )
  ) {
    return navigateTo({
      name: ROUTE_NAMES.favourites,
      params: {
        [ROUTE_PARAM_KEYS.favourites.mediaType]: ROUTE_MEDIA_TYPE_PARAMS.Albums,
      },
    });
  }
});
