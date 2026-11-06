export default defineNuxtPlugin((nuxtApp) => {
  const {
    applyThemePreference,
    loadSettings,
    syncFromStorage,
    themePreference,
  } = useSettings();

  nuxtApp.hook('page:finish', () => {
    // Run after Nuxt page transitions finish to prevent Unhead reactivity locks.
    requestAnimationFrame(() => {
      loadSettings();
    });
  });

  globalThis.addEventListener('storage', (event: StorageEvent) => {
    if (event.key === LOCAL_STORAGE_KEYS.settings) {
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
