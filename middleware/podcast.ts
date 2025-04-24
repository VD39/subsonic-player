export default defineNuxtRouteMiddleware((to) => {
  if (
    !(
      to.params[ROUTE_PARAM_KEYS.podcast.sortBy] &&
      to.params[ROUTE_PARAM_KEYS.podcast.id] &&
      Object.values(ROUTE_PODCAST_SORT_BY_PARAMS).includes(
        to.params[ROUTE_PARAM_KEYS.podcast.sortBy] as never,
      )
    )
  ) {
    return navigateTo({
      name: ROUTE_NAMES.podcasts,
    });
  }
});
