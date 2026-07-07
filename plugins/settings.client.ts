export default defineNuxtPlugin((nuxtApp) => {
  const {
    applyThemePreference,
    loadSettings,
    syncFromStorage,
    themePreference,
  } = useSettings();

  nuxtApp.hook('page:finish', () => {
    loadSettings();
  });

  globalThis.addEventListener('storage', (event) => {
    if ((event as StorageEvent).key === LOCAL_STORAGE_KEYS.settings) {
      syncFromStorage();
    }
  });

  globalThis
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (themePreference.value === 'auto') {
        applyThemePreference();
      }
    });
});
