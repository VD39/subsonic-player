export default defineNuxtRouteMiddleware(async (to) => {
  if (!Object.keys(SORT_BY_TYPES).includes(to.params.sortBy as string)) {
    return navigateTo('/albums/a-z');
  }
});
