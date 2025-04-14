export default defineNuxtRouteMiddleware((to) => {
  if (
    !(
      to.params.sortBy &&
      to.params.id &&
      [
        ROUTE_PODCAST_SORT_BY_PARAMS.All,
        ROUTE_PODCAST_SORT_BY_PARAMS.Downloaded,
        ROUTE_PODCAST_SORT_BY_PARAMS['Not downloaded'],
      ].includes(to.params.sortBy as never)
    )
  ) {
    return navigateTo('/podcasts');
  }
});
