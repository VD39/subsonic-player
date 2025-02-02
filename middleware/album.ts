export default defineNuxtRouteMiddleware((to) => {
  if (!to.params.id) {
    return navigateTo(`/albums/${ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z']}`);
  }
});
