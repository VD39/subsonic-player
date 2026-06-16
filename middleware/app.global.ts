export default defineNuxtRouteMiddleware(async (to) => {
  const { loadThemePreference } = useTheme();
  const { autoLogin, isAuthenticated } = useAuth();
  const { closeModal } = useModal();
  const { closeQueuePanels } = useQueue();
  const { getPlaylists, playlists } = usePlaylist();
  const { bookmarks, getBookmarks } = useBookmark();

  await callOnce(async () => {
    await autoLogin();
  });

  if (import.meta.client) {
    await callOnce(() => {
      loadThemePreference();
    });
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

  closeModal();
  closeQueuePanels();

  if (isAuthenticated.value) {
    await Promise.all([
      !playlists.value.length && getPlaylists(),
      !bookmarks.value.length && getBookmarks(),
    ]);
  }
});
