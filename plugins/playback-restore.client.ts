export default defineNuxtPlugin((nuxtApp) => {
  const { isAuthenticated } = useAuth();
  const { restoreQueueStateFromLocal, restoreQueueStateFromServer } =
    useQueue();
  const { restoreAudioPlayerState } = useAudioPlayer();

  nuxtApp.hook('page:finish', async () => {
    if (!isAuthenticated.value) {
      return;
    }

    await restoreQueueStateFromServer();
    restoreQueueStateFromLocal();
    await nextTick();
    await restoreAudioPlayerState();
  });
});
