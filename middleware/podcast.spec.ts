import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { routeMock } from '@/test/fixtures';
import podcastMiddleware from './podcast';

const navigateToMock = vi.hoisted(() => vi.fn());

mockNuxtImport('navigateTo', () => navigateToMock);

describe('podcast-middleware', () => {
  beforeEach(() => {
    podcastMiddleware(routeMock, routeMock);
  });

  describe('when to.params.id is not defined', () => {
    it('calls the navigateTo function', () => {
      expect(navigateToMock).toBeCalledWith('/podcasts');
    });
  });

  describe('when to.params.id is defined', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      podcastMiddleware(
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
