export default defineNuxtRouteMiddleware(async (to) => {
  if (
    !(
      to.params.mediaType &&
      to.params.query &&
      ['albums', 'tracks', 'artists'].includes(to.params.mediaType as string)
    )
  ) {
    return navigateTo('/');
  }
});
