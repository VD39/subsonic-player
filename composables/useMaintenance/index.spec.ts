import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { cachesMock, navigatorStorageMock } from '@/test/browserMocks';

import { useMaintenance } from './index';

const clearServerQueueMock = vi.hoisted(() => vi.fn());
const restoreQueueStateFromLocalMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useQueue', () => () => ({
  clearServerQueue: clearServerQueueMock,
  restoreQueueStateFromLocal: restoreQueueStateFromLocalMock,
}));

const deleteLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('deleteLocalStorage', () => deleteLocalStorageMock);

const handleErrorMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useErrorHandler', () => () => ({
  handleError: handleErrorMock,
}));

const { deleteMock, keysMock, restore: restoreCachesMock } = cachesMock();
const { estimateMock, restore: restoreStorageMock } = navigatorStorageMock();

const {
  cacheEstimate,
  clearAllAppStorage,
  clearPwaCaches,
  fetchCacheEstimate,
} = useMaintenance();

describe('useMaintenance', () => {
  afterEach(() => {
    vi.clearAllMocks();
    restoreCachesMock();
    restoreStorageMock();
  });

  it('sets the default cacheEstimate value', () => {
    expect(cacheEstimate.value).toBe('');
  });

  describe('when the fetchCacheEstimate function is called', () => {
    describe('when navigator.storage.estimate returns a value', () => {
      beforeEach(async () => {
        estimateMock.mockResolvedValue({
          quota: 1073741824,
          usage: 5242880,
        });

        await fetchCacheEstimate();
      });

      it('sets the correct cacheEstimate value', () => {
        expect(cacheEstimate.value).toBe('5.0 MB used of 1024.0 MB available');
      });
    });

    describe('when the storage estimate returns undefined usage and quota', () => {
      beforeEach(async () => {
        estimateMock.mockResolvedValue({});

        await fetchCacheEstimate();
      });

      it('sets the correct cacheEstimate value', () => {
        expect(cacheEstimate.value).toBe('0.0 MB used of 0.0 MB available');
      });
    });

    describe('when navigator.storage.estimate throws an error', () => {
      beforeEach(async () => {
        estimateMock.mockRejectedValue(new Error('error'));

        await fetchCacheEstimate();
      });

      it('sets the correct cacheEstimate value', () => {
        expect(cacheEstimate.value).toBe('Unavailable');
      });
    });

    describe('when navigator.storage is not available', () => {
      beforeEach(async () => {
        delete (globalThis.navigator as unknown as Record<string, unknown>)
          .storage;
        await fetchCacheEstimate();
      });

      it('sets the correct cacheEstimate value', () => {
        expect(cacheEstimate.value).toBe('Unavailable');
      });
    });
  });

  describe('when the clearAllAppStorage function is called', () => {
    beforeEach(async () => {
      clearServerQueueMock.mockResolvedValue(undefined);
      await clearAllAppStorage();
    });

    it('calls the deleteLocalStorage function with the correct parameters', () => {
      expect(deleteLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.player,
      );
      expect(deleteLocalStorageMock).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEYS.queue,
      );
    });

    it('calls the clearServerQueue function', () => {
      expect(clearServerQueueMock).toHaveBeenCalled();
    });

    it('calls the restoreQueueStateFromLocal function', () => {
      expect(restoreQueueStateFromLocalMock).toHaveBeenCalled();
    });
  });

  describe('when the clearPwaCaches function is called', () => {
    describe('when the caches API is available', () => {
      beforeEach(async () => {
        keysMock.mockResolvedValue([
          ...CACHE_NAMES,
          'workbox-precache-v2',
          'other-cache',
        ]);

        await clearPwaCaches();
      });

      it('calls the caches.delete function with the correct parameters', () => {
        CACHE_NAMES.forEach((name) => {
          expect(deleteMock).toHaveBeenCalledWith(name);
        });
        expect(deleteMock).toHaveBeenCalledWith('workbox-precache-v2');
        expect(deleteMock).not.toHaveBeenCalledWith('other-cache');
      });

      it('calls the caches.delete function 5 times', () => {
        expect(deleteMock).toHaveBeenCalledTimes(5);
      });

      it('calls the fetchCacheEstimate function', () => {
        expect(estimateMock).toHaveBeenCalled();
      });
    });

    describe('when the caches API is not available', () => {
      beforeEach(async () => {
        delete (globalThis as Record<string, unknown>).caches;
        await clearPwaCaches();
      });

      it('does not attempt to fetch cache keys', () => {
        expect(keysMock).not.toHaveBeenCalled();
      });
    });

    describe('when caches.keys rejects', () => {
      beforeEach(async () => {
        keysMock.mockRejectedValue(new Error('error'));
        await clearPwaCaches();
      });

      it('does not call the caches.delete function', () => {
        expect(deleteMock).not.toHaveBeenCalled();
      });

      it('does not call the fetchCacheEstimate function', () => {
        expect(estimateMock).not.toHaveBeenCalled();
      });

      it('calls the handleError function with the correct parameters', () => {
        expect(handleErrorMock).toHaveBeenCalledWith(
          new Error('error'),
          'caches',
        );
      });
    });
  });
});
