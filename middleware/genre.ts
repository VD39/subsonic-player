export default defineNuxtRouteMiddleware((to) => {
  if (
    !(
      to.params.mediaType &&
      to.params.genre &&
      [ROUTE_MEDIA_TYPE_PARAMS.Albums, ROUTE_MEDIA_TYPE_PARAMS.Tracks].includes(
        to.params.mediaType as never,
      )
    )
  ) {
    return navigateTo('/genres');
  }
});
