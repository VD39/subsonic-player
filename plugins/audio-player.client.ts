export default defineNuxtPlugin((nuxtApp) => {
  const { initAudioPlayer } = useAudioPlayer();

  nuxtApp.hook('app:suspense:resolve', () => {
    callOnce(() => {
      initAudioPlayer();
    });
  });
});
