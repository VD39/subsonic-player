import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { vi } from 'vitest';

const addRouteMock = vi.fn();
const afterEachMock = vi.fn();
const backMock = vi.fn();
const beforeEachMock = vi.fn();
const beforeResolveMock = vi.fn();
const currentRouteMock = ref({
  fullPath: '/',
  hash: '',
  meta: {},
  name: undefined,
  params: {},
  path: '/',
  query: {},
});
const forwardMock = vi.fn();
const getRoutesMock = vi.fn(() => []);
const goMock = vi.fn();
const hasRouteMock = vi.fn(() => false);
const installMock = vi.fn();
const isReadyMock = vi.fn(() => Promise.resolve());
const onErrorMock = vi.fn();
const pushMock = vi.fn(() => Promise.resolve());
const removeRouteMock = vi.fn();
const replaceMock = vi.fn(() => Promise.resolve());
const resolveMock = vi.fn((to) => to);

const routerMock = {
  addRoute: addRouteMock,
  afterEach: afterEachMock,
  back: backMock,
  beforeEach: beforeEachMock,
  beforeResolve: beforeResolveMock,
  currentRoute: currentRouteMock,
  forward: forwardMock,
  getRoutes: getRoutesMock,
  go: goMock,
  hasRoute: hasRouteMock,
  install: installMock,
  isReady: isReadyMock,
  onError: onErrorMock,
  options: { history: {} },
  push: pushMock,
  removeRoute: removeRouteMock,
  replace: replaceMock,
  resolve: resolveMock,
};

export function useRouterMock() {
  mockNuxtImport('useRouter', (original) => () => ({
    ...original(),
    ...routerMock,
  }));

  return {
    addRouteMock,
    afterEachMock,
    backMock,
    beforeEachMock,
    beforeResolveMock,
    currentRouteMock,
    forwardMock,
    getRoutesMock,
    goMock,
    hasRouteMock,
    installMock,
    isReadyMock,
    onErrorMock,
    pushMock,
    removeRouteMock,
    replaceMock,
    resolveMock,
    routerMock,
  };
}
