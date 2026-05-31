export default defineNuxtRouteMiddleware(async (to) => {
  const { loadThemePreference } = useTheme();
  const { autoLogin, isAuthenticated } = useAuth();
  const { closeModal } = useModal();
  const { closeQueuePanels, restoreQueueState } = useQueue();
  const { restoreAudioPlayerState } = useAudioPlayer();
  const { getPlaylists, playlists } = usePlaylist();

  closeModal();
  closeQueuePanels();

  await callOnce(async () => {
    await autoLogin();
  });

  if (import.meta.client) {
    await callOnce(() => {
      loadThemePreference();
    });
  }

  if (isAuthenticated.value && !playlists.value.length) {
    if (import.meta.client) {
      getPlaylists();
    } else {
      await getPlaylists();
    }
  }

  if (isAuthenticated.value && import.meta.client) {
    await restoreQueueState();
    await restoreAudioPlayerState();
  }

  if (to.name === ROUTE_NAMES.login && isAuthenticated.value) {
    const destination = to.query.redirect?.toString() || {
      name: ROUTE_NAMES.index,
    };

    return navigateTo(destination);
  }

  if (to.name !== ROUTE_NAMES.login && !isAuthenticated.value) {
    return navigateTo({
      name: ROUTE_NAMES.login,
      query: {
        redirect: to.fullPath,
      },
    });
  }
});
