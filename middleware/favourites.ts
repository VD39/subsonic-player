export default defineNuxtRouteMiddleware(async (to) => {
  if (
    !(
      to.params.mediaType &&
      ['albums', 'tracks', 'artists'].includes(to.params.mediaType as string)
    )
  ) {
    return navigateTo('/favourites/albums');
  }
});
