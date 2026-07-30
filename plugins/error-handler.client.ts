export default defineNuxtPlugin((nuxtApp) => {
  const { handleError } = useErrorHandler();

  nuxtApp.hook('vue:error', (error) => {
    handleError(error, 'vue:error');
  });

  globalThis.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, 'unhandledRejection');
    event.preventDefault();
  });

  globalThis.onerror = (_event, _source, _lineno, _colno, error) => {
    handleError(error || 'Unknown error', 'window.onerror');
  };
});
