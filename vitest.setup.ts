import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { config, RouterLinkStub } from '@vue/test-utils';
import { vi } from 'vitest';

import { intersectionObserverMock } from '@/test/intersectionObserverMock';

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

config.global.stubs = {
  RouterLink: RouterLinkStub,
  teleport: true,
};

vi.stubGlobal('defineEventHandler', (func: unknown) => func);

// Stub $fetch with .create() to prevent ReferenceError from Nuxt's internal manifest.js.
const $fetchMock = Object.assign(vi.fn().mockResolvedValue({}), {
  create: vi.fn().mockReturnValue(vi.fn().mockResolvedValue({})),
});

vi.stubGlobal('$fetch', $fetchMock);

vi.stubGlobal('getQuery', () => ({ id: 'id' }));
