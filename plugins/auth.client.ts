export default defineNuxtPlugin(() => {
  const { logoutAndRedirect } = useAuth();

  globalThis.addEventListener('storage', async (event: StorageEvent) => {
    const { key, newValue } = event;

    if (!newValue || !key) {
      return;
    }

    if (key === LOCAL_STORAGE_KEYS.logout) {
      deleteLocalStorage(key);
      await logoutAndRedirect();
    }

    if (key === LOCAL_STORAGE_KEYS.login) {
      deleteLocalStorage(key);
      globalThis.location.reload();
    }
  });
});
