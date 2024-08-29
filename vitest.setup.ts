import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { config, RouterLinkStub } from '@vue/test-utils';

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
  getImageUrl: vi.fn((path) => path),
  getStreamUrl: vi.fn((path) => path),
}));

config.global.stubs['RouterLink'] = RouterLinkStub;
