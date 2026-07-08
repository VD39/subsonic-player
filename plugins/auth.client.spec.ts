import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { windowEventListenerMock } from '@/test/eventListenersMock';

import authPlugin from './auth.client';

const logoutAndRedirectMock = vi.fn();
const deleteLocalStorageMock = vi.hoisted(() => vi.fn());

mockNuxtImport('useAuth', () => () => ({
  logoutAndRedirect: logoutAndRedirectMock,
}));

mockNuxtImport('deleteLocalStorage', () => deleteLocalStorageMock);

const reloadMock = vi.fn();

beforeAll(() => {
  Object.defineProperty(globalThis, 'location', {
    value: { reload: reloadMock },
    writable: true,
  });
});

const { windowEvents } = windowEventListenerMock();

describe('auth.client plugin', () => {
  beforeEach(() => {
    authPlugin({} as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the plugin is initialised', () => {
    it('does not call the logoutAndRedirect function', () => {
      expect(logoutAndRedirectMock).not.toHaveBeenCalled();
    });
  });

  describe('when the storage event is fired', () => {
    describe('when the event key matches the logout key', () => {
      beforeEach(() => {
        windowEvents.storage(
          new StorageEvent('storage', {
            key: LOCAL_STORAGE_KEYS.logout,
            newValue: 'timestamp',
          }),
        );
      });

      it('calls the deleteLocalStorage function with the correct key', () => {
        expect(deleteLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.logout,
        );
      });

      it('calls the logoutAndRedirect function', () => {
        expect(logoutAndRedirectMock).toHaveBeenCalled();
      });
    });

    describe('when the event key matches the login key', () => {
      beforeEach(() => {
        windowEvents.storage(
          new StorageEvent('storage', {
            key: LOCAL_STORAGE_KEYS.login,
            newValue: 'timestamp',
          }),
        );
      });

      it('calls the deleteLocalStorage function with the correct key', () => {
        expect(deleteLocalStorageMock).toHaveBeenCalledWith(
          LOCAL_STORAGE_KEYS.login,
        );
      });

      it('calls the reload function', () => {
        expect(reloadMock).toHaveBeenCalled();
      });

      it('does not call the logoutAndRedirect function', () => {
        expect(logoutAndRedirectMock).not.toHaveBeenCalled();
      });
    });

    describe('when the event key does not match any auth key', () => {
      beforeEach(() => {
        windowEvents.storage(
          new StorageEvent('storage', {
            key: LOCAL_STORAGE_KEYS.player,
            newValue: 'timestamp',
          }),
        );
      });

      it('does not call the deleteLocalStorage function', () => {
        expect(deleteLocalStorageMock).not.toHaveBeenCalled();
      });

      it('does not call the logoutAndRedirect function', () => {
        expect(logoutAndRedirectMock).not.toHaveBeenCalled();
      });

      it('does not call the reload function', () => {
        expect(reloadMock).not.toHaveBeenCalled();
      });
    });

    describe('when the event newValue is null', () => {
      beforeEach(() => {
        windowEvents.storage(
          new StorageEvent('storage', {
            key: LOCAL_STORAGE_KEYS.logout,
            newValue: null,
          }),
        );
      });

      it('does not call the deleteLocalStorage function', () => {
        expect(deleteLocalStorageMock).not.toHaveBeenCalled();
      });

      it('does not call the logoutAndRedirect function', () => {
        expect(logoutAndRedirectMock).not.toHaveBeenCalled();
      });

      it('does not call the reload function', () => {
        expect(reloadMock).not.toHaveBeenCalled();
      });
    });

    describe('when the event key is null', () => {
      beforeEach(() => {
        windowEvents.storage(
          new StorageEvent('storage', {
            key: null,
            newValue: 'timestamp',
          }),
        );
      });

      it('does not call the deleteLocalStorage function', () => {
        expect(deleteLocalStorageMock).not.toHaveBeenCalled();
      });

      it('does not call the logoutAndRedirect function', () => {
        expect(logoutAndRedirectMock).not.toHaveBeenCalled();
      });

      it('does not call the reload function', () => {
        expect(reloadMock).not.toHaveBeenCalled();
      });
    });
  });
});
