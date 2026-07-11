import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import { windowEventListenerMock } from '@/test/eventListenersMock';

import settingsPlugin from './settings.client';

const applyThemePreferenceMock = vi.fn();
const loadSettingsMock = vi.fn();
const syncFromStorageMock = vi.fn();
const themePreferenceMock = ref('auto');

mockNuxtImport('useSettings', () => () => ({
  applyThemePreference: applyThemePreferenceMock,
  loadSettings: loadSettingsMock,
  syncFromStorage: syncFromStorageMock,
  themePreference: themePreferenceMock,
}));

let hookCallback: () => void;

const nuxtApp = {
  hook: vi.fn((_event: string, cb: () => void) => {
    hookCallback = cb;
  }),
} as never;

let colorSchemeChangeCallback: () => void;

Object.defineProperty(globalThis, 'matchMedia', {
  value: vi.fn(() => ({
    addEventListener: vi.fn((_event: string, cb: () => void) => {
      colorSchemeChangeCallback = cb;
    }),
  })),
  writable: true,
});

const requestAnimationFrameSpy = vi
  .spyOn(globalThis, 'requestAnimationFrame')
  .mockImplementation((callback) => {
    callback(0);
    return 0;
  });

const { windowEvents } = windowEventListenerMock();

describe('settings.client plugin', () => {
  beforeEach(() => {
    settingsPlugin(nuxtApp);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when the plugin is initialised', () => {
    it('does not call the loadSettings function', () => {
      expect(loadSettingsMock).not.toHaveBeenCalled();
    });

    it('does not call the syncFromStorage function', () => {
      expect(syncFromStorageMock).not.toHaveBeenCalled();
    });

    it('does not call the applyThemePreference function', () => {
      expect(applyThemePreferenceMock).not.toHaveBeenCalled();
    });
  });

  describe('when the page:finish hook is triggered', () => {
    beforeEach(() => {
      hookCallback();
    });

    it('calls the requestAnimationFrame function', () => {
      expect(requestAnimationFrameSpy).toHaveBeenCalled();
    });

    it('calls the loadSettings function', () => {
      expect(loadSettingsMock).toHaveBeenCalled();
    });
  });

  describe('when the storage event is fired', () => {
    describe('when the event key matches the settings key', () => {
      beforeEach(() => {
        windowEvents.storage(
          new StorageEvent('storage', {
            key: LOCAL_STORAGE_KEYS.settings,
          }),
        );
      });

      it('calls the syncFromStorage function', () => {
        expect(syncFromStorageMock).toHaveBeenCalled();
      });
    });

    describe('when the event key does not match the settings key', () => {
      beforeEach(() => {
        windowEvents.storage(
          new StorageEvent('storage', {
            key: LOCAL_STORAGE_KEYS.player,
          }),
        );
      });

      it('does not call the syncFromStorage function', () => {
        expect(syncFromStorageMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the color scheme change event is fired', () => {
    describe('when the themePreference value is auto', () => {
      beforeEach(() => {
        themePreferenceMock.value = 'auto';
        colorSchemeChangeCallback();
      });

      it('calls the applyThemePreference function', () => {
        expect(applyThemePreferenceMock).toHaveBeenCalled();
      });
    });

    describe('when the themePreference value is dark', () => {
      beforeEach(() => {
        themePreferenceMock.value = 'dark';
        colorSchemeChangeCallback();
      });

      afterEach(() => {
        themePreferenceMock.value = 'auto';
      });

      it('does not call the applyThemePreference function', () => {
        expect(applyThemePreferenceMock).not.toHaveBeenCalled();
      });
    });
  });
});
