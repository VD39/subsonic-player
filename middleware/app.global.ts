export default defineNuxtRouteMiddleware(async (to) => {
  const { setDefaultTheme } = useTheme();
  const { authenticated, autoLogin } = useAuth();
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

  if (authenticated.value && !playlists.value.length) {
    await getPlaylists();
  }

  if (to.name === 'login' && authenticated.value) {
    return await navigateTo('/');
  }

  if (to.name !== 'login' && !authenticated.value) {
    return await navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
