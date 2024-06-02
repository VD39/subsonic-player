export default defineNuxtRouteMiddleware(async (to) => {
  if (
    !(
      to.params.mediaType &&
      to.params.genre &&
      ['albums', 'tracks'].includes(to.params.mediaType as string)
    )
  ) {
    return navigateTo('/genres');
  }
});
