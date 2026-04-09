export default defineNuxtRouteMiddleware(async (to) => {
  const { setDefaultTheme } = useTheme();
  const { autoLogin, isAuthenticated } = useAuth();
  const { closeModal } = useModal();
  const { resetQueue } = useQueue();
  const { getPlaylists, playlists } = usePlaylist();

  closeModal();
  resetQueue();

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
