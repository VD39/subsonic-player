import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { routeMock } from '@/test/fixtures';
import artistMiddleware from './artist';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('artist-middleware', () => {
  beforeEach(() => {
    artistMiddleware(routeMock, routeMock);
  });

  describe('when to.params.id is not defined', () => {
    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/artists');
    });
  });

  describe('when to.params.id is defined', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      artistMiddleware(
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
