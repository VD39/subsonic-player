export default defineNuxtRouteMiddleware((to) => {
  if (
    !(
      to.params[ROUTE_PARAM_KEYS.search.mediaType] &&
      to.params[ROUTE_PARAM_KEYS.search.query] &&
      Object.values(ROUTE_MEDIA_TYPE_PARAMS).includes(
        to.params[ROUTE_PARAM_KEYS.search.mediaType] as never,
      )
    )
  ) {
    return navigateTo({
      name: ROUTE_NAMES.index,
    });
  }
});
