import { intersectionObserverMock } from '@@/test/intersectionObserverMock';
import { config, RouterLinkStub } from '@vue/test-utils';
import { vi } from 'vitest';

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

vi.mock('crypto-js/md5', () => ({
  default: vi.fn().mockReturnValue('MD5'),
}));

config.global.stubs = {
  RouterLink: RouterLinkStub,
  teleport: true,
};
