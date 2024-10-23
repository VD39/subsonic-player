export default defineNuxtRouteMiddleware(async (to) => {
  if (
    !(
      to.params.mediaType &&
      to.params.query &&
      [
        ROUTE_MEDIA_TYPE_PARAMS.Albums,
        ROUTE_MEDIA_TYPE_PARAMS.Artists,
        ROUTE_MEDIA_TYPE_PARAMS.Tracks,
      ].includes(to.params.mediaType as never)
    )
  ) {
    return navigateTo('/');
  }
});
