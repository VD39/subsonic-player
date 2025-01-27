import { routeMock } from '@/test/fixtures';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

import albumMiddleware from './album';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('album-middleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when to.params.id is not defined', () => {
    beforeEach(() => {
      albumMiddleware(routeMock, routeMock);
    });

    it('calls the navigateTo function', () => {
      expect(navigateToMock).toHaveBeenCalledWith('/albums/a-z');
    });
  });

  describe('when to.params.id is defined', () => {
    beforeEach(() => {
      albumMiddleware(
        {
          ...routeMock,
          params: {
            ...routeMock.params,
            id: 'id',
          },
        },
        routeMock,
      );
    });

    it('does not call the navigateTo function', () => {
      expect(navigateToMock).not.toHaveBeenCalled();
    });
  });
});
