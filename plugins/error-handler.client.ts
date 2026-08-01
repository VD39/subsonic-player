export default defineNuxtPlugin((nuxtApp) => {
  const { logError } = useErrorHandler();

  nuxtApp.hook('vue:error', (error) => {
    logError(error, 'vue:error');
  });

  globalThis.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'unhandledRejection');
    event.preventDefault();
  });

  globalThis.onerror = (_event, _source, _lineno, _colno, error) => {
    logError(error || 'Unknown error', 'window.onerror');
  };
});
