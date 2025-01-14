import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { config, RouterLinkStub } from '@vue/test-utils';

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

config.global.stubs = {
  PhCaretDoubleRight: true,
  PhCheckCircle: true,
  PhCircleNotch: true,
  RouterLink: RouterLinkStub,
  teleport: true,
};
