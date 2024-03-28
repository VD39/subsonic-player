import { mockNuxtImport } from '@nuxt/test-utils/runtime';

mockNuxtImport('useState', () => {
  return <T>(_key: string, init: () => T) => {
    return ref(init());
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
