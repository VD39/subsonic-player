export default defineNuxtRouteMiddleware(async (to) => {
  if (
    !(
      to.params.sortBy &&
      [
        ROUTE_PODCASTS_SORT_BY_PARAMS.Recent,
        ROUTE_PODCASTS_SORT_BY_PARAMS['A-Z'],
      ].includes(to.params.sortBy as never)
    )
  ) {
    return navigateTo(`/podcasts/${ROUTE_PODCASTS_SORT_BY_PARAMS.Recent}`);
  }
});
