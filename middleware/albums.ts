export default defineNuxtRouteMiddleware((to) => {
  if (
    !(
      to.params.sortBy &&
      Object.keys(ALBUMS_SORT_BY).includes(to.params.sortBy as string)
    )
  ) {
    return navigateTo(`/albums/${ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z']}`);
  }
});
