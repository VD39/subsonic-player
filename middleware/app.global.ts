export default defineNuxtRouteMiddleware(async (to) => {
  const { setDefaultTheme } = useTheme();
  const { autoLogin, isAuthenticated } = useAuth();
  const { closeModal } = useModal();
  const { resetQueueState } = useQueue();
  const { getPlaylists, playlists } = usePlaylist();

  closeModal();
  resetQueueState();

  await callOnce(async () => {
    await autoLogin();
  });

  if (import.meta.client) {
    await callOnce(() => {
      setDefaultTheme();
    });
  }

  if (isAuthenticated.value && !playlists.value.length) {
    await getPlaylists();
  }

  if (to.name === 'login' && isAuthenticated.value) {
    return navigateTo('/');
  }

  if (to.name !== 'login' && !isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
