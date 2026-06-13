export default defineNuxtPlugin((nuxtApp) => {
  const { isAuthenticated } = useAuth();
  const {
    mergeBookmarksToCurrentQueue,
    restoreLocalState,
    restoreQueueStateFromLocal,
    restoreQueueStateFromServer,
  } = useQueue();
  const { restoreAudioPlayerState } = useAudioPlayer();

  nuxtApp.hook('page:finish', async () => {
    if (!isAuthenticated.value) {
      return;
    }

    await restoreQueueStateFromServer();
    restoreQueueStateFromLocal();
    await mergeBookmarksToCurrentQueue();
    await nextTick();
    await restoreAudioPlayerState();
    restoreLocalState();
  });
});
