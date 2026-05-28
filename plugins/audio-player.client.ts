export default defineNuxtPlugin((nuxtApp) => {
  const { restoreQueueState } = useQueue();
  const { initAudioPlayer } = useAudioPlayer();

  nuxtApp.hook('app:suspense:resolve', () => {
    callOnce(async () => {
      await restoreQueueState();
      await initAudioPlayer();
    });
  });
});
