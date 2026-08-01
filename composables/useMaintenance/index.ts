export function useMaintenance() {
  const { logError } = useErrorHandler();
  const { clearServerQueue, restoreQueueStateFromLocal } = useQueue();

  const cacheEstimate = ref('');

  async function fetchCacheEstimate() {
    if (!import.meta.client || !('storage' in globalThis.navigator)) {
      cacheEstimate.value = 'Unavailable';
      return;
    }

    try {
      const estimate = await globalThis.navigator.storage.estimate();
      const usageMB = formatBytesToMB(estimate.usage);
      const quotaMB = formatBytesToMB(estimate.quota);
      cacheEstimate.value = `${usageMB} MB used of ${quotaMB} MB available`;
    } catch {
      cacheEstimate.value = 'Unavailable';
    }
  }

  async function clearAllAppStorage() {
    deleteLocalStorage(LOCAL_STORAGE_KEYS.player);
    deleteLocalStorage(LOCAL_STORAGE_KEYS.queue);
    await clearServerQueue();

    // Restore the queue to its default (empty) state now that everything is cleared.
    restoreQueueStateFromLocal();
  }

  async function clearPwaCaches() {
    if (!import.meta.client || !('caches' in globalThis)) {
      return;
    }

    try {
      const keys = await globalThis.caches.keys();

      const deletePromises = keys.reduce<Promise<boolean>[]>(
        (promises, name) => {
          if (
            CACHE_NAMES.includes(name) ||
            name.startsWith('workbox-precache')
          ) {
            promises.push(globalThis.caches.delete(name));
          }

          return promises;
        },
        [],
      );

      await Promise.all(deletePromises);

      // Refresh the estimate UI after clearing.
      await fetchCacheEstimate();
    } catch (error) {
      logError(error, 'caches');
    }
  }

  return {
    cacheEstimate,
    clearAllAppStorage,
    clearPwaCaches,
    fetchCacheEstimate,
  };
}
