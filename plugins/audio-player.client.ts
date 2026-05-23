export default defineNuxtPlugin((nuxtApp) => {
  const { loadFromServer } = useQueue();
  const { initAudioPlayer } = useAudioPlayer();

  nuxtApp.hook('app:suspense:resolve', () => {
    callOnce(async () => {
      await loadFromServer();
      await initAudioPlayer();
    });
  });
});
