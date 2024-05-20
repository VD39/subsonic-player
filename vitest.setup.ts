import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { config, RouterLinkStub } from '@vue/test-utils';

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

config.global.stubs['RouterLink'] = RouterLinkStub;
