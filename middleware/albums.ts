export default defineNuxtRouteMiddleware((to) => {
  if (
    !(
      to.params[ROUTE_PARAM_KEYS.albums.sortBy] &&
      Object.keys(ALBUMS_SORT_BY).includes(
        to.params[ROUTE_PARAM_KEYS.albums.sortBy] as string,
      )
    )
  ) {
    return navigateTo({
      name: ROUTE_NAMES.albums,
      params: {
        [ROUTE_PARAM_KEYS.albums.sortBy]: ROUTE_ALBUMS_SORT_BY_PARAMS['A-Z'],
      },
    });
  }
});
