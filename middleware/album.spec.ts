import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { routeMock } from '@/test/fixtures';
import albumMiddleware from './album';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('album-middleware', () => {
  beforeEach(() => {
    albumMiddleware(routeMock, routeMock);
  });

  describe('when to.params.id is not defined', () => {
    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/albums');
    });
  });

  describe('when to.params.id is defined', () => {
    beforeEach(() => {
      vi.clearAllMocks();
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
      expect(navigateToMock).not.toBeCalled();
    });
  });
});
