import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { config, RouterLinkStub } from '@vue/test-utils';

import { intersectionObserverMock } from '@/test/intersectionObserverMock';

intersectionObserverMock([
  {
    isIntersecting: true,
  } as never,
]);

window.MutationObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
}));

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
vi.stubGlobal('getQuery', () => ({ id: 'id' }));
