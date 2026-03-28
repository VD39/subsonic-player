import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { config, RouterLinkStub } from '@vue/test-utils';
import { vi } from 'vitest';

import { intersectionObserverMock } from '@/test/intersectionObserverMock';

// Mock localStorage for tests (webOS utilities use localStorage)
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    clear: () => {
      store = {};
    },
    getItem: (key: string) => store[key] || null,
    removeItem: (key: string) => {
      store[key] = '';
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  };
})();

globalThis.localStorage = localStorageMock as Storage;

intersectionObserverMock([
  {
    isIntersecting: true,
  } as never,
]);

globalThis.MutationObserver = vi.fn().mockImplementation(function () {
  return {
    disconnect: vi.fn(),
    observe: vi.fn(),
  };
});

mockNuxtImport('callOnce', () => {
  return <T>(cb: () => T) => {
    cb();
  };
});

vi.mock('crypto-js/md5', () => ({
  default: vi.fn().mockReturnValue('MD5'),
}));

mockNuxtImport('useAPI', () => () => ({
  fetchData: vi.fn(() => ({
    data: null,
  })),
  getDownloadUrl: vi.fn((path) => path),
  getImageUrl: vi.fn((path) => path),
  getStreamUrl: vi.fn((path) => path),
}));

mockNuxtImport('debounce', () => {
  return <T>(cb: () => T) => {
    return cb;
  };
});

mockNuxtImport('useId', () => () => Math.random().toString(36).substring(2));

config.global.stubs = {
  RouterLink: RouterLinkStub,
  teleport: true,
};

vi.stubGlobal('defineEventHandler', (func: unknown) => func);
vi.stubGlobal('getQuery', () => ({ id: 'id' }));

// Assign $fetch directly on globalThis (not via vi.stubGlobal) so that it
// survives vitest's per-file cleanup.  Nuxt's payload.client plugin schedules
// `setTimeout(getAppManifest, 1e3)` which fires *after* the test file is torn
// down, and vi.stubGlobal values are restored (removed) at that point.
if (!globalThis.$fetch) {
  const fetchFn = (..._args: unknown[]) => Promise.resolve({});
  globalThis.$fetch = Object.assign(fetchFn, {
    create: () =>
      Object.assign((..._args: unknown[]) => Promise.resolve({}), {
        create:
          () =>
          (..._args: unknown[]) =>
            Promise.resolve({}),
      }),
  }) as typeof globalThis.$fetch;
}
